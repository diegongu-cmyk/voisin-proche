"use client";
import Link from "next/link";

export default function CoursesService() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200"
            alt="Courses et commissions"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <div className="space-y-6 px-4">
            <div className="text-6xl">🛒</div>
            <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl">
              Courses et Commissions
            </h1>
            <div className="inline-flex rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white">
              8€
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
              Nous effectuons vos courses et commissions dans le lieu de votre choix, de la manière la plus 
              rapide possible. Le tarif de 8€ est valable pour une seule enseigne ou magasin. Si vous 
              souhaitez des courses dans plusieurs magasins, le tarif sera ajusté en conséquence. Le montant 
              des articles à acheter reste à la charge du client. Rapide, fiable et sans complications.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Vous ne payez que pour le service, les courses sont réglées directement par vous ou via une 
              avance remboursée. Je respecte scrupuleusement votre liste de courses, vos préférences et votre 
              budget. Service disponible avec une grande flexibilité horaire pour s'adapter à vos besoins.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-green-800">✅ Ce qui est inclus</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Courses alimentaires</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Retrait de documents administratifs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Dépôt de colis et lettres</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Pharmacie (ordonnances)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Service rapide et efficace</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Respect des listes et budgets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Livraison à domicile</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-blue-800">ℹ️ Informations importantes</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Disponible 7j/7 (selon horaires commerces)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Zone disponible sur demande</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Véhicule personnel disponible</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Ticket de caisse fourni</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Paiement possible par avance ou remboursement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Flexibilité d'horaires</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Confidentialité des courses assurée</span>
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
            <div className="rounded-2xl border border-green-400 bg-green-50 p-6 shadow-md">
              <div className="mb-2">
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">POPULAIRE</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Course simple</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">8€</p>
              <p className="text-gray-600">Une course unique</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 1 magasin/lieu</li>
                <li>• Durée: jusqu'à 1h</li>
                <li>• Livraison à domicile</li>
                <li>• Ticket de caisse fourni</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-gray-900">Courses multiples</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">15€</p>
              <p className="text-gray-600">Plusieurs endroits</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 2-3 magasins/lieux</li>
                <li>• Durée: jusqu'à 2h</li>
                <li>• Optimisation du parcours</li>
                <li>• Tarif groupé avantageux</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-gray-900">Abonnement mensuel</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">60€</p>
              <p className="text-gray-600">10 courses par mois</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 10 courses/mois</li>
                <li>• Tarif réduit: 6€/course</li>
                <li>• Flexibilité totale</li>
                <li>• Priorité disponibilité</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BOTÓN CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Besoin d'aide pour vos courses ?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Réservez dès maintenant votre service de courses et simplifiez-vous la vie avec un service rapide et fiable.
          </p>
          <Link
            href="/reserver?service=courses"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-700"
          >
            Réserver ce service
          </Link>
        </div>
      </section>
    </div>
  );
}
