"use client";
import Link from "next/link";

export default function AutresService() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200"
            alt="Autres services"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <div className="space-y-6 px-4">
            <div className="text-6xl">?!</div>
            <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl">
              Autres Services
            </h1>
            <div className="inline-flex rounded-full bg-purple-500 px-6 py-3 text-lg font-bold text-white">
              Sur mesure
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DESCRIPCIÓN DETALLADA */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Vous avez un besoin particulier ?</h2>
            <p className="text-lg leading-relaxed text-gray-600">
              Parlez-nous en ! Nous sommes à votre écoute et ferons de notre mieux pour trouver une solution 
              adaptée à votre situation. Chaque demande est unique et mérite une attention personnalisée.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Que ce soit pour une aide ponctuelle, un service spécifique que vous ne trouvez pas ailleurs, 
              ou simplement une question sur nos capacités d'intervention, n'hésitez pas à nous contacter. 
              Nous sommes flexibles, créatifs et toujours prêts à explorer de nouvelles possibilités pour vous aider.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-purple-800">? Ce que nous pouvons envisager</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600">?</span>
                  <span>Aide administrative simple</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600">?</span>
                  <span>Accompagnement pour déménagements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600">?</span>
                  <span>Garde de plantes pendant absence</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600">?</span>
                  <span>Petits travaux de bricolage</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600">?</span>
                  <span>Et bien d'autres possibilités...</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-blue-800">? Notre approche</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">?</span>
                  <span>Écoute attentive de votre besoin</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">?</span>
                  <span>Discussion ouverte des possibilités</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">?</span>
                  <span>Honnêteté sur nos capacités</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">?</span>
                  <span>Solution personnalisée si possible</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">?</span>
                  <span>Sans engagement de votre part</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
            <h3 className="mb-4 text-xl font-bold text-orange-800">? Comment procéder ?</h3>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-start gap-3">
                <span className="font-bold text-orange-600">1.</span>
                <span>Contactez-nous via le formulaire ci-dessous ou par téléphone</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-bold text-orange-600">2.</span>
                <span>Décrivez votre besoin en détail, sans filtre</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-bold text-orange-600">3.</span>
                <span>Nous étudierons votre demande et vous répondrons rapidement</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-bold text-orange-600">4.</span>
                <span>Si nous pouvons vous aider, nous proposerons une solution adaptée</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTÓN CTA */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Parlez-nous de votre projet</h2>
          <p className="mb-8 text-lg text-gray-600">
            Votre demande est unique ? Nous sommes là pour l'écouter et y répondre avec la plus grande attention.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-purple-700"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}
