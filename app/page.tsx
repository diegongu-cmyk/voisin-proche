"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const serviceMapping: Record<string, string> = {
  "Promenade de chiens": "promenade",
  "Garde d'animaux": "garde",
  "Accompagnement": "accompagnement",
  "Courses": "courses",
  "Ménage": "menage",
  "Cours d'espagnol": "espagnol",
};

const services = [
  {
    emoji: "🐕",
    titre: "Promenade de chiens",
    prix: "Depuis 8€",
    description: "Balades adaptées à votre compagnon.\nSuivi GPS en temps réel et photos incluses.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
  },
  {
    emoji: "🐾",
    titre: "Garde d'animaux",
    prix: "Depuis 15€/jour",
    description: "Visites à domicile tous les jours.\nSoin attentif et nouvelles régulières.",
    image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400",
  },
  {
    emoji: "🤝",
    titre: "Accompagnement",
    prix: "Depuis 12€/h",
    description: "Aide pour sorties et rendez-vous.\nPrésence rassurante et bienveillante.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
  },
  {
    emoji: "🛒",
    titre: "Courses",
    prix: "Depuis 8€",
    description: "Commissions du quotidien simplifiées.\nLivraison rapide à Fontenay-le-Comte.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
  },
  {
    emoji: "🧹",
    titre: "Ménage",
    prix: "Depuis 25€",
    description: "Maison ou bureau, service soigné.\nProduits inclus selon vos besoins.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
  },
  {
    emoji: "🇪🇸",
    titre: "Cours d'espagnol",
    prix: "Depuis 15€/h",
    description: "Cours personnalisés tous niveaux.\nFormat en ligne ou à domicile.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
  },
];

const sliderServices = [
  {
    titre: "Promenade de chiens",
    prix: "Depuis 8€",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600",
  },
  {
    titre: "Garde d'animaux",
    prix: "Depuis 15€/jour",
    image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600",
  },
  {
    titre: "Accompagnement",
    prix: "Depuis 12€",
    image: "https://images.unsplash.com/photo-1569398034126-476e3a9e3808?w=600",
  },
  {
    titre: "Courses et commissions",
    prix: "Depuis 8€",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
  },
  {
    titre: "Ménage maison/bureau",
    prix: "Depuis 25€",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
  },
  {
    titre: "Cours d'espagnol",
    prix: "Depuis 15€/heure",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
  },
  {
    titre: "Autres services",
    prix: "nous contacter",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderServices.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-[#1D9E75] px-6 py-12 text-white md:px-10 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
                Votre voisin de confiance à Fontenay-le-Comte
              </h1>
              <p className="mt-4 text-lg text-white/90 md:text-xl">
                Services de proximité pour vous simplifier le quotidien : promenade de chiens, garde d'animaux, accompagnement et bien plus encore.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border border-white px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#1D9E75]"
                >
                  Découvrir nos services
                </Link>
                <Link
                  href="/reserver"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1D9E75] transition hover:opacity-90"
                >
                  Réserver maintenant
                </Link>
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-2/5">
              <div className="relative overflow-hidden rounded-2xl border-4 border-white/20">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {sliderServices.map((service, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="relative">
                        <img
                          src={service.image}
                          alt={service.titre}
                          className="h-64 w-full object-cover md:h-80"
                          loading="lazy"
                        />
                        <span className="absolute right-3 top-3 rounded-full bg-[#1D9E75] px-3 py-1 text-xs font-bold text-white">
                          {service.prix}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-lg font-bold text-white">{service.titre}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {sliderServices.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        currentSlide === index ? "bg-white" : "bg-white/50"
                      }`}
                      aria-label={`Aller au slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-[#FFFBF5] px-4 py-8 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-[#085041]">Ce qui nous définit</h2>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#1D9E75]" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <article className="rounded-2xl border-[0.5px] border-slate-200 bg-white p-6 text-center shadow-sm">
            <svg
              className="mx-auto h-10 w-10 text-[#1D9E75]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z" />
              <path d="M8.5 12.2l2.2 2.2 4.8-4.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-[#085041]">Confiance</h3>
            <p className="mt-2 text-sm text-slate-500">
              Votre voisin de confiance, recommandé par vos voisins
            </p>
          </article>

          <article className="rounded-2xl border-[0.5px] border-slate-200 bg-white p-6 text-center shadow-sm">
            <svg
              className="mx-auto h-10 w-10 text-[#1D9E75]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-[#085041]">Proximité</h3>
            <p className="mt-2 text-sm text-slate-500">
              Toujours près de vous, où que vous soyez en Vendée
            </p>
          </article>

          <article className="rounded-2xl border-[0.5px] border-slate-200 bg-white p-6 text-center shadow-sm">
            <svg
              className="mx-auto h-10 w-10 text-[#F59E0B]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-[#085041]">Qualité</h3>
            <p className="mt-2 text-sm text-slate-500">
              Des services soignés, avec attention et professionnalisme
            </p>
          </article>

          <article className="rounded-2xl border-[0.5px] border-slate-200 bg-white p-6 text-center shadow-sm">
            <svg
              className="mx-auto h-10 w-10 text-[#1D9E75]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-[#085041]">Disponibilité</h3>
            <p className="mt-2 text-sm text-slate-500">
              7 jours sur 7, matin et soir, selon vos besoins
            </p>
          </article>
        </div>
      </section>

      <section id="services" className="space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Nos services</h2>
          <p className="mt-2 text-slate-600">
            Une offre claire, locale et adaptée à vos besoins du quotidien.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.titre}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <img
                src={service.image}
                alt={service.titre}
                className="h-44 w-full object-cover"
                loading="lazy"
              />
              <div className="space-y-3 p-5">
                <p className="text-2xl">{service.emoji}</p>
                <h3 className="text-lg font-extrabold text-slate-900">{service.titre}</h3>
                <p className="text-xl font-extrabold text-[#1D9E75]">{service.prix}</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
                <Link
                  href={`/reserver?service=${serviceMapping[service.titre] || "autre"}`}
                  className="inline-flex rounded-lg bg-[#1D9E75] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Réserver
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[#FFFBF5] px-6 py-10 md:px-10">
        <h2 className="text-3xl font-extrabold text-slate-900">Pourquoi nous choisir</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { icon: "🫶", title: "Confiance et proximité", text: "Une relation humaine et locale." },
            { icon: "💶", title: "Prix accessibles", text: "Des tarifs transparents et justes." },
            { icon: "📅", title: "Disponible 7j/7", text: "Une présence régulière toute la semaine." },
            { icon: "🇪🇸", title: "Espagnol natif", text: "Communication fluide en espagnol." },
          ].map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-3xl">{point.icon}</p>
              <h3 className="mt-2 text-lg font-bold text-[#085041]">{point.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{point.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
