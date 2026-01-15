'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getMarkdownHtmlTranslations } from '@/lib/i18n-markdown-html';
import toast from 'react-hot-toast';

type Mode = 'mdToHtml' | 'htmlToMd';

// Simple Markdown to HTML converter
function markdownToHtml(md: string): string {
  let html = md;

  // Escape HTML entities first (except for already processed parts)
  html = html.replace(/&(?!amp;|lt;|gt;|quot;)/g, '&amp;');

  // Code blocks (before other processing)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers
  html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Links and images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Blockquotes
  html = html.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Horizontal rule
  html = html.replace(/^[-*_]{3,}$/gm, '<hr>');

  // Unordered lists
  html = html.replace(/^[\*\-]\s+(.*)$/gm, '<li>$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>');

  // Wrap consecutive <li> in <ul> or <ol>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return '<ul>\n' + match + '</ul>\n';
  });

  // Line breaks
  html = html.replace(/  \n/g, '<br>\n');

  // Paragraphs (for text not already in tags)
  const lines = html.split('\n');
  const result: string[] = [];
  let inParagraph = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      result.push('');
    } else if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') ||
               trimmed.startsWith('<li') || trimmed.startsWith('<pre') || trimmed.startsWith('<blockquote') ||
               trimmed.startsWith('<hr') || trimmed.startsWith('</ul') || trimmed.startsWith('</ol')) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      result.push(line);
    } else {
      if (!inParagraph) {
        result.push('<p>' + line);
        inParagraph = true;
      } else {
        result.push(line);
      }
    }
  }
  if (inParagraph) {
    result.push('</p>');
  }

  return result.join('\n').trim();
}

// Simple HTML to Markdown converter
function htmlToMarkdown(html: string): string {
  let md = html;

  // Remove extra whitespace
  md = md.replace(/\s+/g, ' ');

  // Code blocks
  md = md.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_match, code) => {
    return '```\n' + code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim() + '\n```';
  });

  // Inline code
  md = md.replace(/<code>([^<]+)<\/code>/gi, '`$1`');

  // Headers
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n');

  // Bold and italic
  md = md.replace(/<strong><em>(.*?)<\/em><\/strong>/gi, '***$1***');
  md = md.replace(/<em><strong>(.*?)<\/strong><\/em>/gi, '***$1***');
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');

  // Strikethrough
  md = md.replace(/<del>(.*?)<\/del>/gi, '~~$1~~');
  md = md.replace(/<s>(.*?)<\/s>/gi, '~~$1~~');

  // Links and images
  md = md.replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]+alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gi, '![$1]($2)');
  md = md.replace(/<a[^>]+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Lists
  md = md.replace(/<ul[^>]*>/gi, '\n');
  md = md.replace(/<\/ul>/gi, '\n');
  md = md.replace(/<ol[^>]*>/gi, '\n');
  md = md.replace(/<\/ol>/gi, '\n');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n');

  // Horizontal rule
  md = md.replace(/<hr\s*\/?>/gi, '\n---\n');

  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '  \n');

  // Paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // Remove remaining tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");

  // Clean up extra newlines
  md = md.replace(/\n{3,}/g, '\n\n');

  return md.trim();
}

export function MarkdownHtml() {
  const { locale } = useI18n();
  const t = getMarkdownHtmlTranslations(locale);

  const [mode, setMode] = useState<Mode>('mdToHtml');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleMdToHtml = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = markdownToHtml(input);
      setOutput(result);
      toast.success(t.convertedSuccess);
    } catch {
      toast.error('Conversion error');
    }
  };

  const handleHtmlToMd = () => {
    if (!input.trim()) {
      toast.error(t.emptyInput);
      return;
    }

    try {
      const result = htmlToMarkdown(input);
      setOutput(result);
      toast.success(t.convertedSuccess);
    } catch {
      toast.error(t.invalidHtml);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t.copied);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleProcess = () => {
    if (mode === 'mdToHtml') {
      handleMdToHtml();
    } else {
      handleHtmlToMd();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-hub-card border border-hub-border rounded-lg w-fit">
        <button
          onClick={() => { setMode('mdToHtml'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'mdToHtml'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.mdToHtml}
        </button>
        <button
          onClick={() => { setMode('htmlToMd'); setInput(''); setOutput(''); }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'htmlToMd'
              ? 'bg-hub-accent text-hub-darker'
              : 'text-hub-muted hover:text-white'
          }`}
        >
          {t.htmlToMd}
        </button>
      </div>

      {/* Options */}
      {mode === 'mdToHtml' && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
              className="w-4 h-4 accent-hub-accent"
            />
            <span className="text-sm">{t.showPreview}</span>
          </label>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t.inputLabel}</h3>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'mdToHtml' ? t.mdPlaceholder : t.htmlPlaceholder}
            className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-hub-accent focus:ring-1 focus:ring-hub-accent transition-colors"
          />

          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              className="flex-1 px-4 py-2 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              {mode === 'mdToHtml' ? t.mdToHtmlButton : t.htmlToMdButton}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
            >
              {t.clearButton}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-hub-card border border-hub-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.outputLabel}</h3>
            {output && (
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg hover:bg-hub-accent/20 transition-colors text-sm font-medium"
              >
                {t.copyButton}
              </button>
            )}
          </div>

          <div className="w-full h-64 bg-hub-darker border border-hub-border rounded-lg p-4 font-mono text-sm overflow-auto whitespace-pre-wrap">
            {output || <span className="text-hub-muted">...</span>}
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && mode === 'mdToHtml' && output && (
        <div className="bg-hub-card border border-hub-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">{t.previewLabel}</h3>
          <div
            className="prose prose-invert max-w-none bg-hub-darker border border-hub-border rounded-lg p-4"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      )}

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{t.featuresTitle}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5, t.feature6].map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-hub-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">{t.aboutTitle}</h3>
        <p className="text-gray-300 leading-relaxed">{t.aboutText}</p>
      </div>
    </div>
  );
}
