import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'react-hot-toast';
import { I18nProvider } from '@/lib/i18n-context';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-tools-hub.dev'),
  title: {
    default: "DevTools Hub | Developer Tools & Utilities",
    template: "%s | DevTools Hub"
  },
  description: "Free developer tools for web developers. DNS checker, PostgreSQL optimizer, image converter, format converter, gradient generator, Base64, UUID, hash, and URL encoders. Everything runs in your browser.",
  keywords: [
    "developer tools",
    "web tools",
    "converters",
    "formatters",
    "generators",
    "DNS health check",
    "PostgreSQL optimizer",
    "image optimizer",
    "Base64 encoder",
    "UUID generator",
    "hash generator",
    "URL encoder",
    "JSON formatter",
    "YAML converter",
    "CSS gradient generator",
    "dev utilities",
    "free tools",
    "online tools"
  ],
  authors: [{ name: "DevTools Hub", url: "https://dev-tools-hub.dev" }],
  creator: "DevTools Hub",
  publisher: "DevTools Hub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ru_RU"],
    url: "https://dev-tools-hub.dev",
    siteName: "DevTools Hub",
    title: "DevTools Hub | Developer Tools & Utilities",
    description: "Free developer tools for web developers. DNS checker, image optimizer, format converters, and more. Everything runs in your browser.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevTools Hub - Developer Tools & Utilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTools Hub | Developer Tools & Utilities",
    description: "Free developer tools for web developers. Everything runs in your browser.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://dev-tools-hub.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <I18nProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: '',
              style: {
                background: '#12121a',
                color: '#e0e0e8',
                border: '1px solid #1e1e2e',
              },
              success: {
                iconTheme: {
                  primary: '#00ff88',
                  secondary: '#12121a',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff4466',
                  secondary: '#12121a',
                },
              },
            }}
          />
        </I18nProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
