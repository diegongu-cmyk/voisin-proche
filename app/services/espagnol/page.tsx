"use client";
import Link from "next/link";

export default function EspagnolService() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200"
            alt="Cours d'espagnol"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <div className="space-y-6 px-4">
            <div className="text-6xl">🇪🇸</div>
            <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl">
              Cours d'Espagnol
            </h1>
            <div className="inline-flex rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white">
              Depuis 15€/h
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
              Cours authentiques dispensés par un natif hispanophone. Je propose des cours d'espagnol 
              personnalisés pour tous niveaux, que vous soyez débutant ou avancé. Mon approche pédagogique 
              combine l'apprentissage structuré avec des conversations naturelles pour vous permettre 
              de progresser rapidement tout en découvrant la richesse de la culture hispanique.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Les cours s'adaptent à vos objectifs spécifiques : préparation aux voyages, perfectionnement 
              professionnel, soutien scolaire, ou simplement par passion pour la langue. J'offre une 
              flexibilité totale avec des cours à domicile, en ligne, ou dans des lieux neutres. 
              Mon accent natif et ma connaissance approfondie de la culture espagnole garantissent 
              un apprentissage authentique et immersif.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-green-800">✅ Ce qui est inclus</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Cours personnalisés selon votre niveau</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Grammaire et vocabulaire structurés</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Pratique orale intensive</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Exercices pratiques et corrigés</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Découverte culturelle hispanique</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Pédagogie adaptée enfants et adultes</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
              <div className="mb-4">
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">AVANTAGE UNIQUE</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">🌎</span>
                <h3 className="text-xl font-bold text-green-800">Authenticité Latino-Américaine</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Nous sommes des locuteurs natifs d'Amérique Latine, ce qui vous garantit un apprentissage authentique 
                de l'espagnol latino-américain. Vous bénéficierez non seulement d'une maîtrise parfaite de la langue, 
                mais aussi d'une immersion dans la richesse culturelle et la diversité de l'Amérique Latine.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-blue-800">ℹ️ Informations importantes</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Disponible 7j/7 (horaires flexibles)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Tous niveaux: débutant à avancé</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Cours individuels personnalisés</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>À domicile, en ligne ou sur lieu neutre</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Zone disponible sur demande</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">ℹ️</span>
                  <span>Accent natif latino-américain</span>
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
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-gray-900">Cours individuel</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">15€</p>
              <p className="text-gray-600">Par heure de cours</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 1 heure de cours personnalisé</li>
                <li>• Pédagogie individualisée</li>
                <li>• Progression rapide</li>
                <li>• Flexibilité horaire</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-green-400 bg-green-50 p-6 shadow-md">
              <div className="mb-2">
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">POPULAIRE</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Pack 10 heures</h3>
              <p className="mb-4 text-3xl font-bold text-green-600">130€</p>
              <p className="text-gray-600">Forfait de 10 heures</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 10 heures de cours</li>
                <li>• Tarif avantageux: 13€/h</li>
                <li>• Planning personnalisé</li>
                <li>• Support pédagogique inclus</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BOTÓN CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Prêt à parler espagnol ?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Réservez dès maintenant votre cours d'espagnol et découvrez la joie d'apprendre avec un natif passionné par l'enseignement.
          </p>
          <Link
            href="/reserver?service=espagnol"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-700"
          >
            Réserver ce service
          </Link>
        </div>
      </section>
    </div>
  );
}
