import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800'],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://bexo.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Bexo — Free URL Shortener',
    template: '%s | Bexo',
  },
  description:
    'Shorten long URLs instantly with Bexo. No signup required. Free, fast, and simple URL shortener. Track your links and share them anywhere.',
  keywords: [
    'url shortener',
    'link shortener',
    'free url shortener',
    'short link',
    'shorten url',
    'link management',
    'bexo',
  ],
  authors: [{ name: 'Bexo' }],
  creator: 'Bexo',
  publisher: 'Bexo',
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
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Bexo URL Shortener',
    title: 'Bexo — Free URL Shortener',
    description: 'Shorten long URLs instantly. No signup required. Free, fast, and simple.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Bexo URL Shortener' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bexo — Free URL Shortener',
    description: 'Shorten long URLs instantly. No signup required. Free, fast, and simple.',
    images: ['/og-image.png'],
    creator: '@bexoapp',
  },
  alternates: { canonical: BASE_URL },
  category: 'technology',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bexo URL Shortener',
  url: BASE_URL,
  description: 'Free URL shortener. Shorten long URLs instantly without signup.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['URL shortening', 'No registration required', 'Link history via browser cookies'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
