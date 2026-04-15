import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-light text-gray-200 mb-4">404</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Link not found</h1>
        <p className="text-gray-500 mb-8">
          This short link doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200"
        >
          ← Create a new short link
        </Link>
      </div>
    </div>
  );
}
