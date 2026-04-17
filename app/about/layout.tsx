import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://bexo.app';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn how Bexo works — free, private URL shortening with no signup required. QR code generation, click tracking, and browser-local history.',
  openGraph: {
    title: 'About Bexo — Free URL Shortener',
    description: 'Learn how Bexo works — free, private URL shortening with no signup required.',
    url: `${BASE_URL}/about`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About Bexo — Free URL Shortener',
    description: 'Learn how Bexo works — free, private URL shortening with no signup required.',
  },
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
