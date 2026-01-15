'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n-context';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAppStore } from '@/stores/appStore';

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-hub-border bg-hub-dark/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-hub-card rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {sidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold gradient-text">
                {t.siteName}
              </span>
              <span className="text-sm text-hub-muted hidden sm:inline group-hover:text-hub-accent transition-colors">
                {t.siteTagline}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`
                text-sm font-medium transition-colors hover:text-hub-accent
                ${isActive('/') ? 'text-hub-accent' : 'text-gray-300'}
              `}
            >
              {t.home}
            </Link>
            <Link
              href="/tools"
              className={`
                text-sm font-medium transition-colors hover:text-hub-accent
                ${isActive('/tools') ? 'text-hub-accent' : 'text-gray-300'}
              `}
            >
              {t.tools}
            </Link>
            <Link
              href="/favorites"
              className={`
                text-sm font-medium transition-colors hover:text-hub-accent
                ${isActive('/favorites') ? 'text-hub-accent' : 'text-gray-300'}
              `}
            >
              {t.favorites}
            </Link>
          </nav>

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
