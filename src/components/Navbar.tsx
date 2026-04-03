"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase-browser";

const NAV_LINKS: { href: string; label: string; authOnly?: boolean }[] = [
  { href: "/search", label: "Find a College" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/fafsa-guide", label: "FAFSA Guide" },
  { href: "/coach", label: "Coach" },
  { href: "/family", label: "Family", authOnly: true },
  { href: "/compare", label: "Compare" },
  { href: "/international", label: "International" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [listCount, setListCount] = useState(0);

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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-navy font-display text-xl font-bold tracking-display">
              Kid<span className="text-gold">To</span>College
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.filter((l) => !l.authOnly || isSignedIn).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-navy/70 hover:text-gold text-sm font-body font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
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
            <Link
              href="/account"
              className="text-sm font-body font-medium text-white bg-gold hover:bg-gold/90 px-4 py-2 rounded-md transition-colors"
            >
              {isSignedIn ? "Account" : "Sign In"}
            </Link>
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
              {NAV_LINKS.filter((l) => !l.authOnly || isSignedIn).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-navy/70 hover:text-gold text-base font-body py-2"
                >
                  {link.label}
                </Link>
              ))}
              {isSignedIn && (
                <Link
                  href="/my-list"
                  onClick={() => setMobileOpen(false)}
                  className="block text-navy/70 hover:text-gold text-base font-body py-2"
                >
                  My List{listCount > 0 ? ` (${listCount})` : ""}
                </Link>
              )}
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="block text-center text-white bg-gold hover:bg-gold/90 px-4 py-2 rounded-md font-body font-medium"
              >
                {isSignedIn ? "Account" : "Sign In"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
