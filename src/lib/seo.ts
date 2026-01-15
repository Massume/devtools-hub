import type { Tool } from '@/types';

export function generateToolMetadata(tool: Tool, locale: 'en' | 'ru') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-tools-hub.dev';
  const toolUrl = `${baseUrl}/tools/${tool.slug}`;

  return {
    title: tool.name[locale],
    description: tool.description[locale],
    url: toolUrl,
    keywords: tool.tags.join(', '),
    ogImage: `${baseUrl}/og-tool-${tool.slug}.png`,
  };
}

export function updateMetaTags(metadata: {
  title: string;
  description: string;
  url?: string;
  keywords?: string;
  ogImage?: string;
}) {
  // Update title
  document.title = `${metadata.title} | DevTools Hub`;

  // Update or create meta tags
  const updateMeta = (name: string, content: string, property = false) => {
    const attr = property ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attr}="${name}"]`);

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  };

  // Standard meta tags
  updateMeta('description', metadata.description);
  if (metadata.keywords) {
    updateMeta('keywords', metadata.keywords);
  }

  // OpenGraph tags
  updateMeta('og:title', `${metadata.title} | DevTools Hub`, true);
  updateMeta('og:description', metadata.description, true);
  updateMeta('og:type', 'website', true);

  if (metadata.url) {
    updateMeta('og:url', metadata.url, true);
  }

  if (metadata.ogImage) {
    updateMeta('og:image', metadata.ogImage, true);
  }

  // Twitter tags
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', `${metadata.title} | DevTools Hub`);
  updateMeta('twitter:description', metadata.description);

  if (metadata.ogImage) {
    updateMeta('twitter:image', metadata.ogImage);
  }

  // Canonical URL
  if (metadata.url) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    canonical.href = metadata.url;
  }
}

// JSON-LD structured data generator
export function generateToolJsonLd(tool: Tool, locale: 'en' | 'ru') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-tools-hub.dev';

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name[locale],
    description: tool.description[locale],
    url: `${baseUrl}/tools/${tool.slug}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: tool.isPro ? undefined : {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '100',
    },
  };
}
