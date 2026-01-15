'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { useI18n } from '@/lib/i18n-context';
import { useAppStore } from '@/stores/appStore';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { getToolBySlug, getCategoryById } from '@/data/tools-catalog';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export default function ToolPage({ params }: ToolPageProps) {
  const { t } = useI18n();
  const { addRecentTool } = useAppStore();

  // Unwrap params
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // Find tool by slug
  const tool = slug ? getToolBySlug(slug) : null;

  // Add to recent tools
  useEffect(() => {
    if (tool) {
      addRecentTool(tool.id);
    }
  }, [tool, addRecentTool]);

  // Tool not found
  if (slug && !tool) {
    notFound();
  }

  // Loading state
  if (!slug || !tool) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-hub-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-hub-muted">Loading tool...</p>
        </div>
      </div>
    );
  }

  const category = getCategoryById(tool.category);
  if (!category) {
    notFound();
  }

  const ToolComponent = tool.component;

  return (
    <ToolLayout tool={tool} category={category}>
      {ToolComponent ? (
        <ToolComponent />
      ) : (
        <div className="bg-hub-card border border-hub-border rounded-xl p-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{tool.icon}</div>
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-hub-muted mb-6">
              This tool is currently under development and will be available soon.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-hub-accent/10 text-hub-accent border border-hub-accent/20 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="font-medium">In Development</span>
            </div>
          </div>

          {/* Tool Information */}
          <div className="mt-12 pt-8 border-t border-hub-border">
            <h3 className="text-xl font-semibold mb-4">About This Tool</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-hub-muted mb-2">Features:</h4>
                <ul className="space-y-2">
                  {tool.tags.map((tag) => (
                    <li key={tag} className="flex items-center gap-2 text-gray-300">
                      <svg className="w-4 h-4 text-hub-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="capitalize">{tag.replace('-', ' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
