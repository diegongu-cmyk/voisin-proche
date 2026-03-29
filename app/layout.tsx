import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Voisin Proche",
  description: "Service de promenade de chiens a Fontenay-le-Comte",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <TopBanner />
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        <footer className="bg-[#085041] text-white">
        {/* Main Footer Content */}
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Column 1 - Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="10" fill="white"/>
                  <circle cx="14" cy="15" r="4" fill="#085041" opacity="0.8"/>
                  <path d="M8 26C8 22.5 10.7 20 14 20C17.3 20 20 22.5 20 26V28H8V26Z" fill="#085041" opacity="0.8"/>
                  <circle cx="26" cy="13" r="5" fill="#085041"/>
                  <path d="M19 26C19 22 22 19 26 19C30 19 33 22 33 26V28H19V26Z" fill="#085041"/>
                  <path d="M17 24C18.5 22.5 21 22 23 23" stroke="#085041" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                  <circle cx="12" cy="8" r="4" fill="#F59E0B"/>
                  <circle cx="12" cy="7" r="1.8" fill="white"/>
                  <path d="M10 9.5C10 9.5 12 13 12 13C12 13 14 9.5 14 9.5" fill="#F59E0B"/>
                </svg>
                <div className="flex flex-col leading-tight">
                  <span className="text-lg font-bold text-white">Voisin</span>
                  <span className="text-lg font-light text-[#9FE1CB]">Proche</span>
                </div>
              </div>
              
              <p className="text-sm text-white/70 leading-relaxed">
                Votre voisin de confiance à Fontenay-le-Comte. Services de proximité disponibles 7j/7.
              </p>
            </div>

            {/* Column 2 - Nos Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#9FE1CB]">Nos Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/services/promenade" className="text-sm text-white/70 hover:text-white transition-colors">
                    Promenade de chiens
                  </a>
                </li>
                <li>
                  <a href="/services/garde" className="text-sm text-white/70 hover:text-white transition-colors">
                    Garde d'animaux
                  </a>
                </li>
                <li>
                  <a href="/services/accompagnement" className="text-sm text-white/70 hover:text-white transition-colors">
                    Accompagnement
                  </a>
                </li>
                <li>
                  <a href="/services/courses" className="text-sm text-white/70 hover:text-white transition-colors">
                    Courses et commissions
                  </a>
                </li>
                <li>
                  <a href="/services/menage" className="text-sm text-white/70 hover:text-white transition-colors">
                    Ménage maison/bureau
                  </a>
                </li>
                <li>
                  <a href="/services/espagnol" className="text-sm text-white/70 hover:text-white transition-colors">
                    Cours d'espagnol
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - Liens utiles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#9FE1CB]">Liens utiles</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-sm text-white/70 hover:text-white transition-colors">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="/services" className="text-sm text-white/70 hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/reserver" className="text-sm text-white/70 hover:text-white transition-colors">
                    Réserver
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/mon-compte" className="text-sm text-white/70 hover:text-white transition-colors">
                    Mon compte
                  </a>
                </li>
                <li>
                  <a href="/mentions-legales" className="text-sm text-white/70 hover:text-white transition-colors">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="/politique-confidentialite" className="text-sm text-white/70 hover:text-white transition-colors">
                    Politique de confidentialité
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#9FE1CB]">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502.817l-2.462 2.462a1 1 0 01-.817.502l-4.493-1.498a1 1 0 00-.684.948L8 9.28a1 1 0 00-1 1.72V19a2 2 0 002 2h10a2 2 0 002-2V9.28a1 1 0 00-1-.72z" />
                    <path d="M2 8a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V8z" />
                  </svg>
                  <span className="text-sm text-white/70">+33 6 02 35 35 69</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                  <span className="text-sm text-white/70">voisinprochecontact@gmail.com</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2s7 2 7 7c0 5.5-7 10-7 10-7-2-7-7-7z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                  <span className="text-sm text-white/70">Fontenay-le-Comte, Vendée (85)</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-white/70">7j/7 · 8h - 20h</span>
                </div>
                
                <a
                  href="https://wa.me/33602353569"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white hover:bg-[#128C7E] transition-colors"
                >
                  <svg className="h-4 w-4" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.008-.371-.01-.57-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mx-auto w-full max-w-640 px-4">
          <div className="h-px bg-[#1D9E75] opacity-30"></div>
        </div>

        {/* Bottom Bar */}
        <div className="mx-auto w-full max-w-640 px-4 py-6">
          <div className="flex flex-col gap-4 text-center md:flex-row md:justify-between md:text-left">
            <p className="text-xs text-white/50">
              © 2026 Voisin Proche · Tous droits réservés
            </p>
            <p className="text-xs text-white/50">
              Fait avec à Fontenay-le-Comte
            </p>
          </div>
        </div>
      </footer>
        
        <WhatsAppButton />
      </body>
    </html>
  );
}

