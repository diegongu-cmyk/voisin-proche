"use client";
import Link from "next/link";

export default function PromenadeService() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200"
            alt="Promenade de chiens"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <div className="space-y-6 px-4">
            <div className="text-6xl">🐕</div>
            <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl">
              Promenade de Chiens
            </h1>
            <div className="inline-flex rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white">
              Depuis 8€
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
              Des promenades sécurisées et adaptées à votre compagnon. Je m'occupe de votre chien avec amour et professionnalisme, 
              en respectant ses besoins et son rythme. Chaque balade est une occasion pour lui de faire de l'exercice, 
              de socialiser et de s'amuser dans un environnement sécurisé.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Les promenades incluent des jeux, des caresses, et bien sûr de l'exercice physique adapté à la race et à l'âge de votre animal. 
              Je vous envoie régulièrement des photos pendant la balade pour que vous puissiez suivre les aventures de votre compagnon.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-green-800">✅ Ce qui est inclus</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Promenade de 45 minutes minimum</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Jeux et exercices adaptés</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Photos sur WhatsApp</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Caresses et attention personnalisée</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Rapport post-promenade détaillé</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Gestion des besoins (hygiène)</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-blue-800">ℹ️ Informations importantes</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Disponible 7j/7 (matin et soir)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Toutes tailles de chiens acceptées</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Préférence pour les chiens sociables</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Zone disponible sur demande</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Première promenade: rencontre gratuite</span>
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
              <h3 className="mb-2 text-xl font-bold text-gray-900">Simple</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">8€</p>
              <p className="text-gray-600">Promenade de 45 minutes</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 45 minutes de balade</li>
                <li>• Photos sur WhatsApp</li>
                <li>• Rapport simple</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-green-400 bg-green-50 p-6 shadow-md">
              <div className="mb-2">
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">POPULAIRE</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Complet</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">12€</p>
              <p className="text-gray-600">Promenade de 1 heure avec extras</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 1 heure de balade</li>
                <li>• Photos</li>
                <li>• Rapport détaillé</li>
                <li>• Jeux éducatifs</li>
                <li>• Brossage si nécessaire</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-gray-900">Abonnement</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">30€</p>
              <p className="text-gray-600">3 promenades par semaine</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 3 promenades/semaine</li>
                <li>• Tarif réduit: 10€/promenade</li>
                <li>• Flexibilité des jours</li>
                <li>• Priorité en haute saison</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BOTÓN CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Prêt à faire plaisir à votre compagnon ?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Réservez dès maintenant une promenade pour votre chien et offrez-lui le meilleur des soins.
          </p>
          <Link
            href="/reserver?service=promenade"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-700"
          >
            Réserver ce service
          </Link>
        </div>
      </section>
    </div>
  );
}
