"use client";

import Link from "next/link";
import { useState } from "react";

const serviceMapping: Record<string, string> = {
  "Promenade de chiens": "promenade",
  "Garde d'animaux": "garde",
  "Accompagnement": "accompagnement",
  "Courses et commissions": "courses",
  "Ménage maison/bureau": "menage",
  "Cours d'espagnol": "espagnol",
  "Autres services": "autre",
};

const services = [
  {
    emoji: "🐕",
    titre: "Promenade de chiens",
    prixPrincipal: "depuis 8€",
    description: "Nous promenons votre chien en toute sécurité dans les environs de Fontenay-le-Comte. Disponible en 30 min, 45 min ou 1 heure. Depuis 8€.",
    details: ["30min 8€", "45min 10€", "1h 12€", "Photos sur WhatsApp"],
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600",
  },
  {
    emoji: "🐾",
    titre: "Garde d'animaux",
    prixPrincipal: "12€/jour",
    description: "Nous gardons votre animal chez vous pendant votre absence. Prix minimum — détails confirmés par WhatsApp.",
    details: ["12€/jour", "Photos quotidiennes", "7j/7"],
    image:
      "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600",
  },
  {
    emoji: "🤝",
    titre: "Accompagnement",
    prixPrincipal: "12€/heure",
    description: "Nous accompagnons vos proches pour leurs rendez-vous médicaux, courses ou sorties. Depuis 12€/heure.",
    details: ["Rendez-vous médicaux", "Promenades", "Compagnie", "Minimum 1h"],
    image:
      "https://images.unsplash.com/photo-1706806594516-75f93dab6295?w=600",
  },
  {
    emoji: "🛒",
    titre: "Courses et commissions",
    prixPrincipal: "Depuis 8€",
    description: "Nous effectuons vos courses et commissions à votre place. Rapide et fiable. 8€.",
    details: ["Supermarché", "Pharmacie", "La Poste", "Articles à charge du client"],
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
  },
  {
    emoji: "🧹",
    titre: "Ménage maison/bureau",
    prixPrincipal: "depuis 22€",
    description: "Nettoyage complet de votre domicile ou bureau. Depuis 22€.",
    details: ["Maison", "Bureau", "Sur mesure"],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
  },
  {
    emoji: "🇪🇸",
    titre: "Cours d'espagnol",
    prixPrincipal: "depuis 15€/h",
    description: "Cours particuliers d'espagnol pour tous niveaux. Depuis 15€/heure.",
    details: ["Tous niveaux", "Enfants", "Adultes", "À domicile ou en ligne"],
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
  },
  {
    emoji: "✨",
    titre: "Autres services",
    prixPrincipal: "nous contacter",
    description: "Vous avez un besoin spécifique ? Contactez-nous !",
    details: ["Sur mesure", "Consultation", "Solutions adaptées", "Contact direct"],
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
  },
];

export default function ServicesPage() {
  return (
    <section className="space-y-8 bg-[#FFFBF5]">
      <header className="rounded-3xl bg-[#1D9E75] px-6 py-10 text-white md:px-10 md:py-12">
        <h1 className="text-4xl font-extrabold md:text-5xl">Nos Services</h1>
        <p className="mt-3 text-white/90">
          Tout ce dont vous avez besoin, près de chez vous
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.titre}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.titre}
                  className="h-[220px] w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute right-4 top-4 rounded-full bg-[#1D9E75] px-3 py-1 text-xs font-bold text-white">
                  {service.prixPrincipal}
                </span>
              </div>

              <div className="space-y-4 p-6">
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-[#085041]">
                  <span className="text-2xl">{service.emoji}</span>
                  {service.titre}
                </h2>

                {/* Description with hover effect */}
                <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-300 ease-in-out">
                  <div className="border-l-4 border-green-500 bg-green-50 p-3 mt-2">
                    <p className="text-sm text-gray-700">✨ {service.description}</p>
                  </div>
                </div>

                <ul className="space-y-1.5 text-sm text-slate-700">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2">
                      <span className="font-bold text-[#1D9E75]">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/reserver?service=${serviceMapping[service.titre] || "autre"}`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#1D9E75] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Réserver ce service
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Section Autre Besoin */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="bg-gradient-to-br from-[#1D9E75]/5 to-[#085041]/10 rounded-3xl border border-[#1D9E75]/20 p-8 text-center">
          {/* Icon */}
          <div className="text-6xl mb-6">🤝</div>
          
          {/* Titre */}
          <h2 className="text-3xl font-bold text-[#085041] mb-4">
            Un autre besoin ?
          </h2>
          
          {/* Texte */}
          <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Vous ne trouvez pas ce que vous cherchez ? 
            Contactez-nous ! Nous sommes là pour vous aider et trouver 
            ensemble une solution adaptée à vos besoins.
          </p>
          
          {/* Bouton */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1D9E75] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#085041] hover:shadow-lg hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
