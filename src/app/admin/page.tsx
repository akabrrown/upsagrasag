/* app/admin/page.tsx */
import Link from 'next/link';

export default function AdminHome() {
  return (
    <section className="bg-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/news"
          className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          News
        </Link>
        <Link
          href="/admin/events"
          className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          Events
        </Link>
        <Link
          href="/admin/opportunities"
          className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          Opportunities
        </Link>
        {/* Add other sections as needed */}
      </nav>
    </section>
  );
}
