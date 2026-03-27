"use client";

import Link from "next/link";
import { useState } from "react";

const serviceMapping: Record<string, string> = {
  "Promenade de chiens": "promenade",
  "Garde d'animaux à domicile": "garde",
  "Accompagnement de personnes": "accompagnement",
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
    details: ["30min 8€", "45min 11€", "1h 14€", "GPS inclus", "Photos incluses"],
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600",
  },
  {
    emoji: "🐾",
    titre: "Garde d'animaux à domicile",
    prixPrincipal: "depuis 15€/jour",
    description: "Nous gardons votre animal chez vous pendant votre absence, avec tout l'amour et l'attention qu'il mérite. Depuis 15€/jour.",
    details: ["Chats 15€/jour", "Chiens 20€/jour", "Photos quotidiennes", "7j/7"],
    image:
      "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600",
  },
  {
    emoji: "🤝",
    titre: "Accompagnement de personnes",
    prixPrincipal: "12€/heure",
    description: "Nous accompagnons vos proches pour leurs rendez-vous médicaux, courses ou sorties. Disponible 7j/7. Depuis 12€/heure.",
    details: ["Rendez-vous médicaux", "Promenades", "Compagnie", "Minimum 1h"],
    image:
      "https://images.unsplash.com/photo-1706806594516-75f93dab6295?w=600",
  },
  {
    emoji: "🛒",
    titre: "Courses et commissions",
    prixPrincipal: "8€",
    description: "Nous effectuons vos courses et commissions à votre place. Rapide et fiable. 8€.",
    details: ["Supermarché", "Pharmacie", "La Poste", "Livraison le jour même"],
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
  },
  {
    emoji: "🧹",
    titre: "Ménage maison/bureau",
    prixPrincipal: "depuis 25€",
    description: "Nettoyage complet de votre domicile ou bureau. Produits fournis sur demande. Depuis 25€.",
    details: ["Maison", "Bureau", "Produits inclus", "Sur mesure"],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
  },
  {
    emoji: "🇪🇸",
    titre: "Cours d'espagnol",
    prixPrincipal: "depuis 15€/h",
    description: "Cours particuliers d'espagnol pour tous niveaux, enfants et adultes. À domicile ou en ligne. Depuis 15€/heure.",
    details: ["Tous niveaux", "Enfants", "Adultes", "À domicile ou en ligne"],
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
  },
  {
    emoji: "✨",
    titre: "Autres services",
    prixPrincipal: "nous contacter",
    description: "Vous avez un besoin spécifique ? Contactez-nous et nous ferons notre possible pour vous aider.",
    details: ["Sur mesure", "Consultation", "Solutions adaptées", "Contact direct"],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
  },
];

export default function ServicesPage() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

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
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              onMouseEnter={() => setHoveredService(service.titre)}
              onMouseLeave={() => setHoveredService(null)}
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
                <div className="overflow-hidden">
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      hoveredService === service.titre 
                        ? 'max-h-32 opacity-100 translate-y-0' 
                        : 'max-h-0 opacity-0 -translate-y-2'
                    }`}
                  >
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
                      <p className="text-sm leading-relaxed text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✨</span>
                        <span>{service.description}</span>
                      </p>
                    </div>
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
