"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

interface NavLink {
  href: string;
  label: string;
  authOnly?: boolean;
  children?: { href: string; label: string }[];
}

const NAV_LINKS: NavLink[] = [
  { href: "/roadmap", label: "Roadmap" },
  { href: "/search", label: "Find a College" },
  { href: "/colleges", label: "Colleges" },
  { href: "/my-chances", label: "My Chances" },
  { href: "/coach", label: "Coach" },
  {
    href: "/more",
    label: "More",
    children: [
      { href: "/fafsa-guide", label: "FAFSA Guide" },
      { href: "/financial-aid", label: "State Aid Guides" },
      { href: "/financial-aid/calculator", label: "Net Price Calculator" },
      { href: "/scholarships", label: "Scholarships" },
      { href: "/compare", label: "Compare Colleges" },
      { href: "/deadlines", label: "Deadlines" },
      { href: "/college-fairs", label: "College Fairs" },
      { href: "/discover", label: "What Should I Study?" },
      { href: "/essays", label: "Essay Prompts & Coach" },
      { href: "/international", label: "International" },
      { href: "/family", label: "Family" },
      { href: "/blog", label: "Blog" },
    ],
  },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [listCount, setListCount] = useState(0);
  const [userInitials, setUserInitials] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const signedIn = !!data.user;
      setIsSignedIn(signedIn);
      if (signedIn) {
        fetch("/api/list")
          .then((r) => r.json())
          .then((d) => {
            if (d.items) setListCount(d.items.length);
          })
          .catch(() => {});
      }
      if (data.user?.email) {
        const parts = data.user.email.split("@")[0].split(/[._-]/);
        const initials = parts
          .slice(0, 2)
          .map((p: string) => p[0]?.toUpperCase())
          .join("");
        setUserInitials(initials || data.user.email[0].toUpperCase());
      }
    });
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-sm border-b border-gray-200"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile left — back button or spacer */}
          <div className="md:hidden w-9 flex-shrink-0">
            {!isHome ? (
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <div className="w-9" />
            )}
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group md:mr-auto">
            <span className="text-navy font-display text-xl font-bold tracking-display">
              Kid<span className="text-gold">To</span>College
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.filter((l) => !l.authOnly || isSignedIn).map((link) =>
              link.children ? (
                <div key={link.href} className="relative group">
                  <button className="text-navy/70 hover:text-gold text-sm font-body font-medium transition-colors flex items-center gap-1">
                    {link.label}
                    <svg className="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[180px]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm font-body text-navy/70 hover:text-gold hover:bg-cream transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-navy/70 hover:text-gold text-sm font-body font-medium transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            {isSignedIn && (
              <Link
                href="/my-list"
                className="text-navy/70 hover:text-gold text-sm font-body font-medium transition-colors flex items-center gap-1.5"
              >
                My List
                {listCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold/20 text-gold text-[10px] font-bold">
                    {listCount}
                  </span>
                )}
              </Link>
            )}
            {userInitials ? (
              <Link
                href="/account"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-navy text-white text-sm font-bold border-2 border-gold hover:opacity-90 transition-opacity"
              >
                {userInitials}
              </Link>
            ) : (
              <Link
                href="/account"
                className="text-sm font-body font-medium text-white bg-gold hover:bg-gold/90 px-4 py-2 rounded-md transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-navy p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.filter((l) => !l.authOnly || isSignedIn).map((link) =>
                link.children ? (
                  <div key={link.href}>
                    <p className="text-navy/40 text-xs font-body uppercase tracking-wider pt-2 pb-1">
                      {link.label}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block text-navy/70 hover:text-gold text-base font-body py-2 pl-3"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-navy/70 hover:text-gold text-base font-body py-2"
                  >
                    {link.label}
                  </Link>
                )
              )}
              {isSignedIn && (
                <Link
                  href="/my-list"
                  onClick={() => setMobileOpen(false)}
                  className="block text-navy/70 hover:text-gold text-base font-body py-2"
                >
                  My List{listCount > 0 ? ` (${listCount})` : ""}
                </Link>
              )}
              {userInitials ? (
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-navy/70 hover:text-gold text-base font-body py-2"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white text-xs font-bold border-2 border-gold">
                    {userInitials}
                  </span>
                  Account
                </Link>
              ) : (
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center text-white bg-gold hover:bg-gold/90 px-4 py-2 rounded-md font-body font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
