'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { categories, tools } from '@/data/tools-catalog';

export default function HomePage() {
  const { t, locale } = useI18n();

  return (
    <main className="min-h-screen grid-bg">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-block">
            <span className="px-4 py-2 bg-hub-card border border-hub-border rounded-full text-sm text-hub-accent">
              ✨ {t.features.free.title} & {t.features.opensource.title}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="gradient-text">{t.heroTitle}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/tools"
              className="px-8 py-4 bg-hub-accent text-hub-darker font-medium rounded-lg hover:bg-hub-accent-dim transition-colors glow-accent"
            >
              {t.tryNow}
            </Link>
            <a
              href="https://github.com/Massume/devtools-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
            >
              {t.quickLinks.github} →
            </a>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t.categories}
        </h2>
        <p className="text-center text-hub-muted mb-12">
          Browse tools by category
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/tools?category=${category.id}`}
              className={`
                bg-hub-card border border-hub-border rounded-xl p-6
                hover:border-hub-accent transition-all hover:-translate-y-1
                flex flex-col items-center text-center gap-3
                animate-fade-in stagger-${index + 1}
              `}
            >
              <span className="text-4xl">{category.icon}</span>
              <h3 className={`font-semibold ${category.color}`}>
                {category.name[locale]}
              </h3>
              <p className="text-xs text-hub-muted">
                {tools.filter(t => t.category === category.id).length} tools
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-hub-card border border-hub-border text-white font-medium rounded-lg hover:border-hub-accent transition-colors"
          >
            {t.allTools} →
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {Object.entries(t.features).map(([key, feature], index) => (
            <div
              key={key}
              className={`bg-hub-card border border-hub-border rounded-xl p-6 hover:border-hub-accent transition-all animate-fade-in stagger-${index + 1}`}
            >
              <h3 className="text-xl font-semibold mb-2 text-hub-accent">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
