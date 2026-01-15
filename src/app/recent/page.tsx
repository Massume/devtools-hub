'use client';

import { useI18n } from '@/lib/i18n-context';
import { useAppStore } from '@/stores/appStore';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolCard } from '@/components/tools/ToolCard';
import { getToolById } from '@/data/tools-catalog';
import Link from 'next/link';

export default function RecentPage() {
  const { t } = useI18n();
  const { recentTools } = useAppStore();

  const recentToolsData = recentTools
    .map((id) => getToolById(id))
    .filter((tool) => tool !== undefined);

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🕒</span>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                {t.recent}
              </h1>
            </div>
            <p className="text-hub-muted">
              Recently used tools
            </p>
          </div>

          {/* Tools Grid or Empty State */}
          {recentToolsData.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🕒</div>
              <h3 className="text-xl font-semibold mb-2">No Recent Tools</h3>
              <p className="text-hub-muted mb-6">
                Tools you use will appear here for quick access
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
              >
                Browse Tools
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-hub-muted">
                  {t.toolsCount(recentToolsData.length)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {recentToolsData.map((tool, index) => (
                  <div key={tool.id} className={`stagger-${Math.min(index % 6 + 1, 6)}`}>
                    <ToolCard tool={tool} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
