"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  // Hide navbar on admin routes and sign‑in page
  if (pathname.startsWith("/admin") || pathname === "/signin") {
    return null;
  }
  return <Navbar />;
}
