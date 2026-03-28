import Link from "next/link";
import { DisclaimerBar } from "./DisclaimerBar";

const FOOTER_LINKS = {
  Research: [
    { href: "/search", label: "Find a College" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/compare", label: "Compare Colleges" },
  ],
  Coach: [
    { href: "/coach/roadmap", label: "The Roadmap" },
    { href: "/coach/essay", label: "Essay Coach" },
    { href: "/coach/test-prep", label: "Test Prep" },
    { href: "/coach/financial-aid", label: "Financial Aid" },
  ],
  International: [
    { href: "/international/uk", label: "UK Universities" },
    { href: "/international/canada", label: "Canada" },
    { href: "/international/europe", label: "Europe" },
    { href: "/international/global-scholarships", label: "Global Scholarships" },
  ],
  More: [
    { href: "/coach/interviews", label: "Interviews" },
    { href: "/coach/recommendations", label: "Recommendations" },
    { href: "/coach/checklist", label: "Checklist" },
    { href: "/account", label: "My Account" },
  ],
};

export function Footer() {
  return (
    <>
      <DisclaimerBar />
      <footer className="bg-navy text-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div>
              <span className="text-gold font-display text-xl font-bold">
                KidToCollege
              </span>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Free college guidance for every family. No ads, no affiliates,
                no paywalls. 100% independent.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-mono-label text-xs uppercase tracking-wider text-gold mb-4">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} KidToCollege. All rights
              reserved.
            </p>
            <p className="text-xs text-white/40">
              Your data is never sold, shared with colleges, or used for
              advertising.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
