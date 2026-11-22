"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, UserRound } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Tutors", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAE4EF]">
      <nav className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#64748B] hover:text-[#8B78B5] transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-5 py-2.5 text-sm font-semibold text-[#30213D] hover:text-[#8B78B5] transition"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="px-5 py-2.5 rounded-xl bg-[#8B78B5] text-white text-sm font-semibold hover:bg-[#75619E] transition shadow-sm"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#30213D] p-2"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#EAE4EF] px-5 py-5 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-[#30213D] hover:text-[#8B78B5]"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-3 pt-3 border-t border-[#EAE4EF]">
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-[#30213D]"
            >
              <UserRound size={17} />
              Sign In
            </Link>

            <Link
              href="/sign-up"
              onClick={() => setMenuOpen(false)}
              className="text-center px-5 py-3 rounded-xl bg-[#8B78B5] text-white text-sm font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
