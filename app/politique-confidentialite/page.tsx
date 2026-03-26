"use client";

import Link from "next/link";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
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
