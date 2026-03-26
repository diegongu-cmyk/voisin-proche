export default function Footer() {
  return (
    <footer className="bg-[#085041] text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4">
          {/* Nombre de la empresa */}
          <h3 className="text-xl font-bold">Voisin Proche</h3>
          
          {/* Enlace a política de confidencialidad */}
          <div className="space-y-2">
            <a
              href="/politique-confidentialite"
              className="text-sm hover:opacity-80 transition-opacity inline-block"
            >
              Politique de confidentialité
            </a>
          </div>
          
          {/* Información de contacto */}
          <div className="space-y-1 text-sm">
            <p>📧 voisinprochecontact@gmail.com</p>
            <p>📞 +33 6 02 35 35 69</p>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-white/20 pt-4 mt-6">
            <p className="text-xs opacity-75">
              © 2026 Voisin Proche. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
