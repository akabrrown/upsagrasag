"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-gray-50 border-r p-4 h-screen flex flex-col">
      <ScrollArea className="flex-1">
        <nav className="flex-1 space-y-1">
          {[
            { href: "/admin/executives", label: "Executives" },
            { href: "/admin/opportunities", label: "Opportunities" },
            { href: "/admin/past-questions", label: "Past Questions" },
            { href: "/admin/resources", label: "Resources" },
            { href: "/admin/partners", label: "Partners" },
            { href: "/admin/chatbot-logs", label: "Chatbot Logs" },
            { href: "/admin/site-settings", label: "Site Settings" },
            { href: "/admin/news", label: "News" },
            { href: "/admin/events", label: "Events" },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "block py-2 px-3 rounded transition-colors " +
                  (isActive ? "bg-indigo-200 text-indigo-900" : "text-gray-700 hover:bg-indigo-100")
                }
              >
                {item.label}
              </Link>
            );
          })}

        {/* Create Links */}
          {[
            { href: "/admin/partners/create", label: "Create Partner" },
            { href: "/admin/news/create", label: "Create News" },
            { href: "/admin/events/create", label: "Create Event" },
            { href: "/admin/opportunities/create", label: "Create Opportunity" },
            { href: "/admin/resources/create", label: "Create Resource" },
            { href: "/admin/past-questions/create", label: "Create Past Question" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 px-3 rounded text-gray-700 hover:bg-indigo-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-4">
        <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          <Link href="/">Switch to Public Site</Link>
        </Button>
      </div>
    </aside>
  );
}
