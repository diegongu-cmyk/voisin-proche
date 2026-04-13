"use client";
import Link from "next/link";

export default function MenageService() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200"
            alt="Ménage maison/bureau"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <div className="space-y-6 px-4">
            <div className="text-6xl">🧹</div>
            <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl">
              Ménage Maison/Bureau
            </h1>
            <div className="inline-flex rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white">
              Depuis 22€
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
              Nettoyage détaillé et professionnel pour votre maison ou votre bureau. Nous proposons un service 
              de ménage complet et soigné, adapté à vos besoins spécifiques. Que ce soit pour un entretien 
              régulier, un grand nettoyage de printemps, ou une préparation pour un événement, nous assurons 
              un travail méticuleux avec des produits adaptés à vos besoins.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Nous respectons votre intimité et votre espace personnel, avec une discrétion totale garantie. 
              Notre approche professionnelle combine efficacité et attention aux détails pour vous offrir 
              un environnement propre et accueillant. Flexible et fiable, nous nous adaptons à vos horaires 
              et à vos exigences pour un service sur mesure.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-green-800">✅ Ce qui est inclus</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Aspirateur et lavage des sols</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Dépoussiérage des surfaces</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Nettoyage des sanitaires</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Cuisine (plans de travail, évier)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Salles de bain complètes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Vitres (intérieures)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Tri des déchets</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-blue-800">ℹ️ Informations importantes</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Disponible 7j/7 (selon disponibilités)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Zone disponible sur demande</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Confidentialité et discrétion garanties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Devis gratuit pour grands espaces</span>
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
              <h3 className="mb-2 text-xl font-bold text-gray-900">Petit ménage</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">22€</p>
              <p className="text-gray-600">2 heures de service</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 2 heures de service</li>
                <li>• Pièces principales</li>
                <li>• Cuisine et salle de bain</li>
                <li>• Nettoyage standard</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-green-400 bg-green-50 p-6 shadow-md">
              <div className="mb-2">
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">POPULAIRE</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Ménage moyen</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">33€</p>
              <p className="text-gray-600">3 heures de service</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 3 heures de service</li>
                <li>• Toutes les pièces</li>
                <li>• Nettoyage approfondi</li>
                <li>• Vitres incluses</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-gray-900">Grand ménage</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">55€</p>
              <p className="text-gray-600">5 heures de service</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 5 heures de service</li>
                <li>• Sur devis personnalisé</li>
                <li>• Service complet</li>
                <li>• Options spécifiques</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BOTÓN CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Un espace propre qui vous ressemble ?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Réservez dès maintenant votre service de ménage et profitez d'un espace impeccablement entretenu avec discrétion et professionnalisme.
          </p>
          <Link
            href="/reserver?service=menage"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-700"
          >
            Réserver ce service
          </Link>
        </div>
      </section>
    </div>
  );
}
