'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { useAppStore } from '@/stores/appStore';
import { Tool, ToolCategoryData } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface ToolLayoutProps {
  tool: Tool;
  category: ToolCategoryData;
  children: ReactNode;
}

export function ToolLayout({ tool, category, children }: ToolLayoutProps) {
  const { t, locale } = useI18n();
  const { favoriteTools, toggleFavorite } = useAppStore();
  const isFavorite = favoriteTools.includes(tool.id);

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-hub-muted mb-6">
            <Link href="/" className="hover:text-hub-accent transition-colors">
              {t.home}
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-hub-accent transition-colors">
              {t.tools}
            </Link>
            <span>/</span>
            <Link
              href={`/tools?category=${category.id}`}
              className="hover:text-hub-accent transition-colors"
            >
              {category.name[locale]}
            </Link>
            <span>/</span>
            <span className="text-white">{tool.name[locale]}</span>
          </nav>

          {/* Tool Header */}
          <div className="bg-hub-card border border-hub-border rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="text-5xl">{tool.icon}</span>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{tool.name[locale]}</h1>
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
                  </div>
                  <p className="text-hub-muted mb-3">{tool.description[locale]}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/tools?category=${category.id}`}
                      className={`px-3 py-1 ${category.color} bg-hub-dark rounded-lg text-sm flex items-center gap-2 hover:bg-hub-darker transition-colors`}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name[locale]}</span>
                    </Link>
                    {tool.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-hub-dark text-hub-muted text-sm rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(tool.id)}
                className="p-3 hover:bg-hub-dark rounded-lg transition-colors flex-shrink-0"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? (
                  <svg className="w-6 h-6 text-hub-accent fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-hub-muted hover:text-hub-accent transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Tool Content */}
          <div className="animate-fade-in">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
