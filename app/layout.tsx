import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';

const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
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
    'Shorten long URLs instantly with Bexo. No signup required. Free, fast, and simple URL shortener with QR code generation and sharing.',
  keywords: [
    'url shortener',
    'link shortener',
    'free url shortener',
    'short link',
    'shorten url',
    'qr code',
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

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bexo URL Shortener',
    url: BASE_URL,
    description: 'Free URL shortener. Shorten long URLs instantly without signup.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'URL shortening',
      'QR code generation',
      'Link sharing',
      'No registration required',
      'Link history via browser cookies',
      'Password-protected links',
      'Safe mode preview',
      'Click tracking',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bexo',
    url: BASE_URL,
    description: 'Free, privacy-first URL shortener — no signup, no tracking, no friction.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Bexo free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Bexo is completely free with no registration required.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need an account to shorten URLs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. You can shorten URLs instantly without creating an account.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is my link history stored?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your recent links are stored only in your browser via cookies. They are never uploaded to any server.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I generate a QR code for my short link?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every shortened link includes a downloadable QR code generated instantly in your browser.',
        },
      },
    ],
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#B8845A" />
      </head>
      <body className="min-h-full antialiased">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
