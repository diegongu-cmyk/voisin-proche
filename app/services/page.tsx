import Link from "next/link";

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
    description:
      "Balades adaptées au rythme de votre chien.\nSuivi GPS en temps réel pendant chaque sortie.\nPhotos incluses pour chaque promenade.",
    details: ["30min 8€", "45min 11€", "1h 14€", "GPS inclus", "Photos incluses"],
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600",
  },
  {
    emoji: "🐾",
    titre: "Garde d'animaux à domicile",
    prixPrincipal: "depuis 15€/jour",
    description:
      "Visites à domicile pour nourrir et rassurer vos animaux.\nUn suivi simple avec nouvelles quotidiennes.\nService disponible toute la semaine.",
    details: ["Chats 15€/jour", "Chiens 20€/jour", "Photos quotidiennes", "7j/7"],
    image:
      "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600",
  },
  {
    emoji: "🤝",
    titre: "Accompagnement de personnes",
    prixPrincipal: "12€/heure",
    description:
      "Un accompagnement humain pour le quotidien.\nPrésence rassurante lors de déplacements.\nService flexible selon vos besoins.",
    details: ["Rendez-vous médicaux", "Promenades", "Compagnie", "Minimum 1h"],
    image:
      "https://images.unsplash.com/photo-1569398034126-476e3a9e3808?w=600",
  },
  {
    emoji: "🛒",
    titre: "Courses et commissions",
    prixPrincipal: "8€",
    description:
      "On s'occupe de vos achats essentiels.\nService pratique pour votre quotidien.\nLivraison rapide selon disponibilité.",
    details: ["Supermarché", "Pharmacie", "La Poste", "Livraison le jour même"],
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
  },
  {
    emoji: "🧹",
    titre: "Ménage maison/bureau",
    prixPrincipal: "depuis 25€",
    description:
      "Nettoyage soigné de vos espaces de vie ou de travail.\nIntervention adaptée à la taille du logement.\nService fiable et professionnel.",
    details: ["Studio 25€", "2 pièces 35€", "3+ pièces 45€", "Produits inclus"],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
  },
  {
    emoji: "🇪🇸",
    titre: "Cours d'espagnol",
    prixPrincipal: "depuis 15€/heure",
    description:
      "Cours adaptés à votre niveau et à vos objectifs.\nAccompagnement personnalisé pour progresser rapidement.\nNatif espagnol pour une pratique authentique.",
    details: ["Enfants 15€/heure", "Adultes 18€/heure", "En ligne", "En personne"],
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
  },
  {
    emoji: "✨",
    titre: "Autres services",
    prixPrincipal: "à venir",
    description:
      "Des prestations supplémentaires arrivent bientôt.\nNous adaptons l'offre à vos besoins locaux.\nN'hésitez pas à nous contacter.",
    details: ["Service sur demande", "Besoin spécifique", "Contact personnalisé"],
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600",
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
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
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

                <p className="text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>

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
    </section>
  );
}
