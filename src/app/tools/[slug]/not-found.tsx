'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ToolNotFound() {
  return (
    <div className="min-h-screen grid-bg flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4 py-20">
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-hub-muted mb-8 max-w-md">
            The tool you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools"
              className="px-6 py-3 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors"
            >
              Browse All Tools
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
