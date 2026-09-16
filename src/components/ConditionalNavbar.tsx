"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  // While public frontend is covered with the Launching Soon gateway, hide standard navbar
  if (!pathname.startsWith("/admin")) {
    return null;
  }
  return null;
}

