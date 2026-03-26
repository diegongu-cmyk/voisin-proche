"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bcfxjnqtxakdcsnqhbis.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZnhqbnF0eGFrZGNzbnFoYmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMTQ4NTYsImV4cCI6MjA4OTY5MDg1Nn0.eH5lemH7U1mp5y8AHw7rSv3H8spy_Ami_M1knpguXbk'
)

const links = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/reserver", label: "Réserver" },
  { href: "/contact", label: "Contact" },
];

export default function PolitiqueConfidentialitePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsAdmin(session?.user?.app_metadata?.role === 'admin' || false);
      
      if (session?.user) {
        // Get user name
        if (session.user.user_metadata?.full_name) {
          setUserName(session.user.user_metadata.full_name);
        } else if (session.user.email) {
          setUserName(session.user.email.split('@')[0]);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: any, session: any) => {
        setIsLoggedIn(!!session);
        setIsAdmin(session?.user?.app_metadata?.role === 'admin' || false);
        
        if (session?.user) {
          if (session.user.user_metadata?.full_name) {
            setUserName(session.user.user_metadata.full_name);
          } else if (session.user.email) {
            setUserName(session.user.email.split('@')[0]);
          }
        } else {
          setUserName("");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const getUserInitials = () => {
    if (!userName) return "U";
    const names = userName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return userName.charAt(0);
  };

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
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Navbar */}
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
            {isLoggedIn || isAdmin ? (
              <div className="relative">
                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D9E75] text-white text-sm font-bold">
                    {getUserInitials()}
                  </div>
                  <span className="hidden md:block font-bold text-lg text-[#1D9E75] bg-gradient-to-r from-[#1D9E75] to-[#085041] bg-clip-text text-transparent">{userName}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-[#1D9E75] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#085041]"
              >
                Connexion
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#085041] mb-4">
              Politique de Confidentialité — Voisin Proche
            </h1>
            <p className="text-slate-600">
              Date de mise à jour: 26 mars 2026
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* 1. INTRODUCTION */}
            <section className="bg-[#FFFBF5] rounded-xl p-6 border border-[#1D9E75]/20">
              <h2 className="text-xl font-bold text-[#085041] mb-4">1. INTRODUCTION</h2>
              <p className="text-slate-700 leading-relaxed">
                Voisin Proche (voisin-proche.vercel.app) est un service de proximité 
                basé à Fontenay-le-Comte, Vendée, France. Nous respectons votre vie 
                privée et nous engageons à protéger vos données personnelles.
              </p>
            </section>

            {/* 2. DONNÉES COLLECTÉES */}
            <section className="bg-[#FFFBF5] rounded-xl p-6 border border-[#1D9E75]/20">
              <h2 className="text-xl font-bold text-[#085041] mb-4">2. DONNÉES COLLECTÉES</h2>
              <p className="text-slate-700 mb-3">
                Nous collectons uniquement les données suivantes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
              </ul>
              <p className="text-slate-700 mt-3">
                Via les méthodes: formulaire d'inscription, connexion Google, 
                connexion Facebook
              </p>
            </section>

            {/* 3. UTILISATION DES DONNÉES */}
            <section className="bg-[#FFFBF5] rounded-xl p-6 border border-[#1D9E75]/20">
              <h2 className="text-xl font-bold text-[#085041] mb-4">3. UTILISATION DES DONNÉES</h2>
              <p className="text-slate-700 mb-3">
                Vos données sont utilisées exclusivement pour:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Gérer votre compte et vos réservations</li>
                <li>Vous envoyer des confirmations de réservation par email</li>
                <li>Gérer votre programme de fidélité</li>
                <li>Vous contacter concernant vos services</li>
              </ul>
            </section>

            {/* 4. PARTAGE DES DONNÉES */}
            <section className="bg-[#FFFBF5] rounded-xl p-6 border border-[#1D9E75]/20">
              <h2 className="text-xl font-bold text-[#085041] mb-4">4. PARTAGE DES DONNÉES</h2>
              <p className="text-slate-700 leading-relaxed">
                Vos données personnelles ne sont jamais partagées, vendues ou 
                transmises à des tiers. Elles sont uniquement utilisées en interne 
                par Voisin Proche.
              </p>
            </section>

            {/* 5. COOKIES ET AUTHENTIFICATION */}
            <section className="bg-[#FFFBF5] rounded-xl p-6 border border-[#1D9E75]/20">
              <h2 className="text-xl font-bold text-[#085041] mb-4">5. COOKIES ET AUTHENTIFICATION</h2>
              <p className="text-slate-700 leading-relaxed">
                Nous utilisons des cookies de session uniquement pour maintenir 
                votre connexion. Nous n'utilisons pas de cookies publicitaires.
              </p>
            </section>

            {/* 6. VOS DROITS (RGPD) */}
            <section className="bg-[#FFFBF5] rounded-xl p-6 border border-[#1D9E75]/20">
              <h2 className="text-xl font-bold text-[#085041] mb-4">6. VOS DROITS (RGPD)</h2>
              <p className="text-slate-700 mb-3">
                Conformément au RGPD, vous avez le droit de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier vos données</li>
                <li>Supprimer votre compte et vos données</li>
                <li>Vous opposer au traitement de vos données</li>
              </ul>
              <p className="text-slate-700 mt-3">
                Pour exercer ces droits, contactez-nous à: <span className="font-semibold text-[#1D9E75]">voisinprochecontact@gmail.com</span>
              </p>
            </section>

            {/* 7. SÉCURITÉ */}
            <section className="bg-[#FFFBF5] rounded-xl p-6 border border-[#1D9E75]/20">
              <h2 className="text-xl font-bold text-[#085041] mb-4">7. SÉCURITÉ</h2>
              <p className="text-slate-700 leading-relaxed">
                Vos données sont stockées de manière sécurisée via Supabase 
                (infrastructure conforme aux normes européennes).
              </p>
            </section>

            {/* 8. CONTACT */}
            <section className="bg-[#1D9E75] text-white rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">8. CONTACT</h2>
              <div className="space-y-2">
                <p className="font-semibold">Voisin Proche</p>
                <p>Fontenay-le-Comte, Vendée, France</p>
                <p>Email: <span className="font-semibold">voisinprochecontact@gmail.com</span></p>
                <p>Téléphone: <span className="font-semibold">+33 6 02 35 35 69</span></p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1D9E75] px-6 py-3 text-white font-medium transition hover:bg-[#085041]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#085041] text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Voisin Proche</h3>
              <p className="text-sm opacity-90">
                Votre service de proximité de confiance à Fontenay-le-Comte et ses environs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/services" className="hover:opacity-80 transition">
                    Nos services
                  </Link>
                </li>
                <li>
                  <Link href="/reserver" className="hover:opacity-80 transition">
                    Réserver
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:opacity-80 transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/politique-confidentialite" className="hover:opacity-80 transition">
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>📍 Fontenay-le-Comte, Vendée</li>
                <li>📧 voisinprochecontact@gmail.com</li>
                <li>📞 +33 6 02 35 35 69</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-75">
            <p>&copy; 2026 Voisin Proche. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
