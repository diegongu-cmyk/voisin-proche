"use client";
import Link from "next/link";

export default function AccompagnementService() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1706806594516-75f93dab6295?w=1200"
            alt="Accompagnement de personnes"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <div className="space-y-6 px-4">
            <div className="text-6xl">🤝</div>
            <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl">
              Accompagnement de Personnes
            </h1>
            <div className="inline-flex rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white">
              Depuis 12€/h
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
              Une présence chaleureuse et bienveillante pour vos rendez-vous ou simplement pour échanger. 
              Je propose un service d'accompagnement personnalisé adapté à vos besoins, que ce soit pour des 
              rendez-vous médicaux, courses administratives, ou simplement pour rompre la solitude.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Mon rôle est d'être à vos côtés avec patience et écoute, en respectant votre rythme et vos préférences. 
              Je peux vous aider dans vos déplacements, vous assister dans vos démarches, ou simplement partager 
              un moment de convivialité. Disponible 7 jours sur 7, je m'adapte à votre emploi du temps pour vous 
              apporter le soutien dont vous avez besoin.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Notre langue maternelle est l'espagnol, ce qui apporte une dimension humaine et culturelle unique à chaque accompagnement.
              Nous communiquons en français au quotidien, et pour les échanges plus complexes nous nous appuyons sur
              des outils de traduction fiables afin de garantir une compréhension parfaite.
              Cette particularité est souvent appréciée comme une occasion de découvrir une autre culture et d'égayer les conversations.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-green-800">✅ Ce qui est inclus</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Accompagnement aux rendez-vous</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Support administratif simple</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Présence rassurante à domicile</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Écoute et conversation bienveillante</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Flexibilité des horaires</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Transport si nécessaire (véhicule personnel)</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-blue-800">ℹ️ Informations importantes</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Disponible 7j/7 (matin, après-midi, soir)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Possibilité de missions ponctuelles ou régulières</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Zone disponible sur demande</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Patience et empathie garanties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Discrétion et confidentialité assurées</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Permis de conduire valide</span>
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
              <h3 className="mb-2 text-xl font-bold text-gray-900">Horaire</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">12€</p>
              <p className="text-gray-600">Par heure d'accompagnement</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• Tarif horaire simple</li>
                <li>• Minimum 1 heure</li>
                <li>• Flexibilité totale</li>
                <li>• Ajustable selon besoins</li>
              </ul>
            </div>
                                  </div>
        </div>
      </section>

      {/* BOTÓN CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Besoin d'une présence bienveillante ?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Réservez dès maintenant un service d'accompagnement et bénéficiez d'un soutien personnalisé et attentionné.
          </p>
          <Link
            href="/reserver?service=accompagnement"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-700"
          >
            Réserver ce service
          </Link>
        </div>
      </section>
    </div>
  );
}
