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
              Depuis 15€/jour
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
              Votre animal gardé à domicile avec tout l'amour qu'il mérite. Je propose un service de garde personnalisé 
              où votre compagnon reste dans son environnement familier, ce qui réduit le stress et l'anxiété liés au déplacement.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Pendant votre absence, je m'occupe de votre animal comme s'il était le mien : alimentation selon ses habitudes, 
              jeux, promenades (pour chiens), câlins et surtout beaucoup d'attention. Je vous envoie quotidiennement 
              des photos et des vidéos pour que vous puissiez suivre le bien-être de votre compagnon à distance.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-green-800">✅ Ce qui est inclus</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Garde à domicile 24h/24</span>
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
                  <span>Promenades (2-3 par jour pour chiens)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Jeux et moments de complicité</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Administration de médicaments si nécessaire</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Entretien de l'espace de vie</span>
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
                  <span>Zone: Fontenay-le-Comte et environs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Assurance responsabilité civile incluse</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Références disponibles sur demande</span>
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
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-gray-900">Journée</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">15€</p>
              <p className="text-gray-600">Garde sur une journée</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• Garde 12h (8h-20h)</li>
                <li>• 2 promenades (chiens)</li>
                <li>• Photos quotidiennes</li>
                <li>• Alimentation incluse</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-green-400 bg-green-50 p-6 shadow-md">
              <div className="mb-2">
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">POPULAIRE</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">24h</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">25€</p>
              <p className="text-gray-600">Garde jour et nuit</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• Garde 24h complète</li>
                <li>• 3 promenades (chiens)</li>
                <li>• Photos et vidéos</li>
                <li>• Nuit sur place</li>
                <li>• Rapport détaillé</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-gray-900">Week-end</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">60€</p>
              <p className="text-gray-600">Du vendredi soir au dimanche soir</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 3 jours de garde</li>
                <li>• Tarif préférentiel</li>
                <li>• Service complet</li>
                <li>• Disponibilité totale</li>
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
