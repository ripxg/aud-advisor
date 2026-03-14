"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/advisor", label: "Get My Report" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AUD Advisor
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            const isCTA = href === "/advisor";

            if (isCTA) {
              return (
                <Link key={href} href={href}>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white ml-2"
                  >
                    {label}
                  </Button>
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-emerald-400 bg-emerald-400/10"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
