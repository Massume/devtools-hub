'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToolCard } from '@/components/tools/ToolCard';
import { tools, getToolsByCategory, getCategoryById } from '@/data/tools-catalog';

function ToolsContent() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tools
  const filteredTools = selectedCategory
    ? getToolsByCategory(selectedCategory)
    : tools;

  // Apply search filter
  const displayedTools = searchQuery
    ? filteredTools.filter((tool) =>
        tool.name[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredTools;

  const categoryData = selectedCategory ? getCategoryById(selectedCategory) : null;

  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />

        <main className="flex-1 grid-bg">
          <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                {categoryData && (
                  <span className="text-4xl">{categoryData.icon}</span>
                )}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                    {categoryData ? categoryData.name[locale] : t.allTools}
                  </h1>
                  {categoryData && (
                    <p className="text-hub-muted mt-1">
                      {categoryData.description[locale]}
                    </p>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-xl">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full px-4 py-3 pl-12 bg-hub-card border border-hub-border rounded-lg text-white placeholder-hub-muted focus:outline-none focus:border-hub-accent transition-colors"
                  />
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hub-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tools Count */}
            <div className="mb-6">
              <p className="text-hub-muted">
                {displayedTools.length === 0 ? (
                  <span>No tools found</span>
                ) : (
                  <span>
                    {t.toolsCount(displayedTools.length)}
                    {selectedCategory && ` in ${categoryData?.name[locale]}`}
                  </span>
                )}
              </p>
            </div>

            {/* Tools Grid */}
            {displayedTools.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-hub-muted">
                  Try adjusting your search or filter
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {displayedTools.map((tool, index) => (
                  <div key={tool.id} className={`stagger-${Math.min(index % 6 + 1, 6)}`}>
                    <ToolCard tool={tool} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-hub-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-hub-muted">Loading tools...</p>
        </div>
      </div>
    }>
      <ToolsContent />
    </Suspense>
  );
}
