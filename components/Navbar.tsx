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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check Supabase session on component mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsAdmin(session?.user?.app_metadata?.role === 'admin' || false);
      
      if (session?.user) {
        setUser(session.user);
        // Get user name from metadata or fallback to email
        const fullName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.first_name || 
                        session.user.email || "";
        setUserName(fullName);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
        setIsAdmin(session?.user?.app_metadata?.role === 'admin' || false);
        
        if (session?.user) {
          setUser(session.user);
          const fullName = session.user.user_metadata?.full_name || 
                          session.user.user_metadata?.first_name || 
                          session.user.email || "";
          setUserName(fullName);
        } else {
          setUser(null);
          setUserName("");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userName) return "U";
    const names = userName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return userName.charAt(0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    setUserName("");
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

          {/* User menu dropdown (when logged in) */}
          {isLoggedIn || isAdmin ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {/* Avatar with initials */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D9E75] text-white text-sm font-bold">
                  {getUserInitials()}
                </div>
                
                {/* User name */}
                <span className="hidden md:block">{userName}</span>
                
                {/* Dropdown arrow */}
                <svg 
                  className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-50">
                  <div className="py-1">
                    <Link
                      href="/profil"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      👤 Mon profil
                    </Link>
                    <Link
                      href="/mon-compte"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      📋 Mes réservations
                    </Link>
                    <Link
                      href="/profil"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      ⚙️ Modifier mon profil
                    </Link>
                    <div className="border-t border-slate-200 my-1"></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 w-full text-left"
                    >
                      🚪 Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Auth buttons (when not logged in) */
            <div className="flex items-center gap-2">
              <Link
                href="/register"
                className="rounded-md px-3 py-2 text-sm font-medium text-[#1D9E75] bg-white border border-[#1D9E75] transition hover:bg-[#1D9E75] hover:text-white"
                style={{ borderRadius: "8px" }}
              >
                S'inscrire
              </Link>
              <Link
                href={connexionLink.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white transition bg-[#1D9E75] hover:bg-[#1a8a63]"
                style={{ borderRadius: "8px" }}
              >
                {connexionLink.label}
              </Link>
            </div>
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
