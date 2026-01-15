'use client';

import Link from 'next/link';
import { Tool } from '@/types';
import { useI18n } from '@/lib/i18n-context';
import { useAppStore } from '@/stores/appStore';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { t, locale } = useI18n();
  const { favoriteTools, toggleFavorite } = useAppStore();
  const isFavorite = favoriteTools.includes(tool.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block bg-hub-card border border-hub-border rounded-xl p-6 hover:border-hub-accent transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-hub-accent/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{tool.icon}</span>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-hub-accent transition-colors">
              {tool.name[locale]}
            </h3>
          </div>
        </div>

        <button
          onClick={handleFavoriteClick}
          className="p-2 hover:bg-hub-dark rounded-lg transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <svg className="w-5 h-5 text-hub-accent fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-hub-muted hover:text-hub-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {tool.description[locale]}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {tool.isNew && (
          <span className="px-2 py-1 bg-hub-accent/10 text-hub-accent text-xs font-medium rounded border border-hub-accent/20">
            {t.new}
          </span>
        )}
        {tool.isBeta && (
          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded border border-blue-500/20">
            {t.beta}
          </span>
        )}
        {tool.isPro && (
          <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded border border-purple-500/20">
            {t.pro}
          </span>
        )}
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-hub-dark text-hub-muted text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
