"use client";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales - Voisin Proche",
  description: "Mentions légales du site Voisin Proche",
};

export default function MentionsLegales() {
  return (
    <section className="rounded-3xl bg-[#FFFBF5] px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Mentions Légales</h1>

        <div className="space-y-8">
          {/* Éditeur du site */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1D9E75] mb-4">1. ÉDITEUR DU SITE</h2>
            <div className="space-y-2 text-slate-700">
              <p><span className="font-semibold">Nom:</span> Voisin Proche</p>
              <p><span className="font-semibold">Activité:</span> Services de proximité</p>
              <p><span className="font-semibold">Adresse:</span> Fontenay-le-Comte, Vendée (85), France</p>
              <p><span className="font-semibold">Email:</span> voisinprochecontact@gmail.com</p>
              <p><span className="font-semibold">Téléphone:</span> +33 6 02 35 35 69</p>
            </div>
          </div>

          {/* Hébergement */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1D9E75] mb-4">2. HÉBERGEMENT</h2>
            <div className="space-y-2 text-slate-700">
              <p><span className="font-semibold">Hébergeur:</span> Vercel Inc.</p>
              <p><span className="font-semibold">Adresse:</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, USA</p>
              <p><span className="font-semibold">Site web:</span> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#1D9E75] hover:underline">https://vercel.com</a></p>
            </div>
          </div>

          {/* Propriété intellectuelle */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1D9E75] mb-4">3. PROPRIÉTÉ INTELLECTUELLE</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                L'ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive de Voisin Proche. 
                Toute reproduction est interdite sans autorisation préalable.
              </p>
            </div>
          </div>

          {/* Responsabilité */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1D9E75] mb-4">4. RESPONSABILITÉ</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                Voisin Proche s'efforce de fournir des informations exactes et à jour. 
                Nous ne pouvons être tenus responsables des erreurs ou omissions.
              </p>
            </div>
          </div>

          {/* Données personnelles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1D9E75] mb-4">5. DONNÉES PERSONNELLES</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                Conformément au RGPD, vous disposez de droits sur vos données personnelles. 
                Pour plus d'informations, consultez notre Politique de confidentialité.
              </p>
              <p>
                <span className="font-semibold">Contact:</span> voisinprochecontact@gmail.com
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1D9E75] mb-4">6. COOKIES</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                Ce site utilise uniquement des cookies de session nécessaires au bon fonctionnement du service.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-slate-600">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </section>
  );
}
