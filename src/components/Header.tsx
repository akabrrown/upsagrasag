import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-12 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4">
      <Link href="/" className="flex items-center gap-3">
        <div className="relative flex h-12 w-72 overflow-hidden bg-background">
          <Image src="/grasag-logo.jpeg" alt="GRASAG UPSA Logo" width={288} height={48} className="object-cover w-full h-full" />
        </div>
      </Link>
      <nav className="hidden lg:flex flex-1 justify-center items-center gap-1 mx-auto">
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/">Home</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/about">About</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/agenda">Agenda</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/leadership">Leadership</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/opportunities">Opportunities</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/welfare">Welfare</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/resources">Resources</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/academics/past-questions">Past Questions</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/academics/tutorials">Tutorials</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/events">Events</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/research-and-opportunities">Research &amp; Opportunities</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/news-updates">News &amp; Updates</Link>
        <Link className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all" href="/contact">Contact</Link>
      </nav>
      <button className="rounded-lg p-2.5 text-neutral-600 hover:bg-neutral-50 lg:hidden" aria-label="Open menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu h-6 w-6">
          <path d="M4 5h16" />
          <path d="M4 12h16" />
          <path d="M4 19h16" />
        </svg>
      </button>
    </header>
  );
}
