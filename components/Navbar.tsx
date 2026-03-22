"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/reserver", label: "Réserver" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

const connexionLink = { href: "/login", label: "Connexion" };
const monCompteLink = { href: "/mon-compte", label: "Mon compte" };

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check Supabase session on component mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsAdmin(session?.user?.app_metadata?.role === 'admin' || false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
        setIsAdmin(session?.user?.app_metadata?.role === 'admin' || false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = '/';
  };

  // Conditional links based on authentication status
  const getLinks = () => {
    const baseLinks = [
      { href: "/", label: "Accueil" },
      { href: "/services", label: "Services" },
      { href: "/reserver", label: "Réserver" },
      { href: "/contact", label: "Contact" },
    ];

    if (isAdmin) {
      return [
        ...baseLinks,
        { href: "/mon-compte", label: "Mon compte" },
        { href: "/admin", label: "Admin" },
      ];
    } else if (isLoggedIn) {
      return [
        ...baseLinks,
        { href: "/mon-compte", label: "Mon compte" },
      ];
    } else {
      return baseLinks;
    }
  };
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#1D9E75"/>
            <circle cx="14" cy="15" r="4" fill="white" opacity="0.8"/>
            <path d="M8 26C8 22.5 10.7 20 14 20C17.3 20 20 22.5 20 26V28H8V26Z" fill="white" opacity="0.8"/>
            <circle cx="26" cy="13" r="5" fill="white"/>
            <path d="M19 26C19 22 22 19 26 19C30 19 33 22 33 26V28H19V26Z" fill="white"/>
            <path d="M17 24C18.5 22.5 21 22 23 23" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <circle cx="12" cy="8" r="4" fill="#F59E0B"/>
            <circle cx="12" cy="7" r="1.8" fill="white"/>
            <path d="M10 9.5C10 9.5 12 13 12 13C12 13 14 9.5 14 9.5" fill="#F59E0B"/>
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-[#085041]">Voisin</span>
            <span className="text-lg font-light text-[#1D9E75]">Proche</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex flex-wrap items-center gap-2 text-sm font-medium">
          {getLinks().map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-brand/10 hover:text-brand"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"
            aria-label="Menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Auth button (always visible) */}
          {isLoggedIn || isAdmin ? (
            <button
              onClick={handleLogout}
              className="rounded-md px-3 py-2 text-sm font-medium text-white transition bg-[#1D9E75] hover:bg-[#1a8a63]"
              style={{ borderRadius: "8px" }}
            >
              Déconnexion
            </button>
          ) : (
            <Link
              href={connexionLink.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-white transition bg-[#1D9E75] hover:bg-[#1a8a63]"
              style={{ borderRadius: "8px" }}
            >
              {connexionLink.label}
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4">
          <ul className="flex flex-col gap-2 text-sm font-medium">
            {getLinks().map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-slate-700 transition hover:bg-brand/10 hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
