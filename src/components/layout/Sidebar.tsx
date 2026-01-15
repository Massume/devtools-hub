'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n-context';
import { useAppStore } from '@/stores/appStore';
import { categories, getToolsByCategory, tools } from '@/data/tools-catalog';

export function Sidebar() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  // Close sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!sidebarOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.querySelector('[aria-label="Toggle menu"]');

      if (
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        !menuButton?.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="mobile-sidebar"
        className={`
          fixed lg:static top-16 left-0 h-[calc(100vh-4rem)] lg:h-auto
          w-72 bg-hub-dark border-r border-hub-border z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          {/* Categories Section */}
          <div>
            <h3 className="text-sm font-semibold text-hub-muted uppercase tracking-wider mb-4">
              {t.categories}
            </h3>

            <div className="space-y-1">
              {/* All Tools */}
              <Link
                href="/tools"
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                  ${!selectedCategory
                    ? 'bg-hub-accent/10 text-hub-accent border border-hub-accent/20'
                    : 'text-gray-300 hover:bg-hub-card hover:text-hub-accent'
                  }
                `}
              >
                <span className="text-xl">📦</span>
                <div className="flex-1">
                  <div className="font-medium">{t.allTools}</div>
                  <div className="text-xs text-hub-muted">
                    {t.toolsCount(tools.length)}
                  </div>
                </div>
              </Link>

              {/* Category Links */}
              {categories.map((category) => {
                const toolCount = getToolsByCategory(category.id).length;
                const isActive = selectedCategory === category.id;

                return (
                  <Link
                    key={category.id}
                    href={`/tools?category=${category.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                      ${isActive
                        ? 'bg-hub-accent/10 text-hub-accent border border-hub-accent/20'
                        : 'text-gray-300 hover:bg-hub-card hover:text-hub-accent'
                      }
                    `}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{category.name[locale]}</div>
                      <div className="text-xs text-hub-muted">
                        {t.toolsCount(toolCount)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="pt-6 border-t border-hub-border">
            <h3 className="text-sm font-semibold text-hub-muted uppercase tracking-wider mb-4">
              {t.links}
            </h3>

            <div className="space-y-1">
              <Link
                href="/favorites"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-hub-card hover:text-hub-accent transition-all"
              >
                <span className="text-xl">⭐</span>
                <span className="font-medium">{t.favorites}</span>
              </Link>

              <Link
                href="/recent"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-hub-card hover:text-hub-accent transition-all"
              >
                <span className="text-xl">🕒</span>
                <span className="font-medium">{t.recent}</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
