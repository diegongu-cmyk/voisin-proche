"use client";
import Link from "next/link";

export default function GardeService() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=1200"
            alt="Garde d'animaux"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <div className="space-y-6 px-4">
            <div className="text-6xl">🐾</div>
            <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl">
              Garde d'Animaux
            </h1>
            <div className="inline-flex rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white">
              Dès 15€/jour
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DESCRIPCIÓN DETALLADA */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Description du service</h2>
            <p className="text-lg leading-relaxed text-gray-600">
              Dès 15€/jour. Le tarif de base comprend une visite quotidienne d'une heure minimum à votre animal, 
              à l'horaire de votre choix. La visite inclut nourriture, propreté, jeux et promenade si nécessaire. 
              Visites supplémentaires possibles avec supplément (idéal pour chiens nécessitant plusieurs sorties par jour 
              ou animaux avec besoins spécifiques). Le prix final sera confirmé par WhatsApp ou par email après votre demande de réservation.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-green-800">✅ Ce qui est inclus</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>1 visite quotidienne d'1 heure minimum</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Alimentation selon vos instructions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Photos quotidiennes sur WhatsApp</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Promenade pendant la visite (chiens)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Jeux et moments de complicité</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Administration de médicaments (supplément)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Entretien de l'espace de vie</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Visites supplémentaires possibles (supplément)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Horaire de visite au choix du client</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-blue-800">ℹ️ Informations importantes</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Disponible pour week-ends et vacances</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Toutes races et tailles acceptées</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Animaux sociables préférables</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Visite préalable gratuite</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Zone disponible sur demande</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN PRECIOS */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Tarifs</h2>
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-gray-900">Par jour</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">Dès 15€/jour</p>
              <p className="text-gray-600">1 visite d'1h/jour à l'horaire de votre choix</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 1 visite d'1 heure minimum/jour</li>
                <li>• Photos quotidiennes sur WhatsApp</li>
                <li>• Alimentation selon vos instructions et dosages</li>
                <li>• Jeux et attention personnalisée</li>
                <li>• Promenades pour les chiens</li>
                <li>• Visites supplémentaires sur demande (supplément)</li>
              </ul>
            </div>
                      </div>
        </div>
      </section>

      {/* BOTÓN CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Votre animal entre de bonnes mains ?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Réservez dès maintenant le service de garde et partez l'esprit tranquille en sachant que votre compagnon est chouchouté.
          </p>
          <Link
            href="/reserver?service=garde"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-700"
          >
            Réserver ce service
          </Link>
        </div>
      </section>
    </div>
  );
}

