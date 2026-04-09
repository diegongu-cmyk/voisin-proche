"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ReservationConfirmeePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add entrance animations
    const timer = setTimeout(() => {
      document.body.classList.add("loaded");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Capture payment_intent_id from URL if payment was completed
    const sessionId = searchParams.get('session_id');
    const reservationId = searchParams.get('reservation_id');
    
    if (sessionId) {
      // In a real implementation, you would fetch the session from Stripe
      // to get the payment_intent_id. For now, we'll use the session_id as a placeholder
      setPaymentIntentId(sessionId);
    }
    setLoading(false);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-5px) rotate(5deg); }
        }
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        .confetti {
          position: fixed;
          font-size: 2rem;
          animation: confetti 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 50;
        }
        .confetti:nth-child(1) { left: 10%; animation-delay: 0s; }
        .confetti:nth-child(2) { left: 30%; animation-delay: 0.5s; }
        .confetti:nth-child(3) { left: 50%; animation-delay: 1s; }
        .confetti:nth-child(4) { left: 70%; animation-delay: 1.5s; }
        .confetti:nth-child(5) { left: 90%; animation-delay: 2s; }
      `}</style>

      {/* Animated Confetti */}
      <div className="confetti">🎉</div>
      <div className="confetti">🐾</div>
      <div className="confetti">✅</div>
      <div className="confetti">💚</div>
      <div className="confetti">🎊</div>

      {/* Main Content */}
      <div className="max-w-2xl w-full fade-in">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          
          {/* Animated Success Icon */}
          <div className="mb-6">
            <div className="bounce text-6xl md:text-7xl">🎉✅</div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-600 mb-4">
            Réservation envoyée !
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Merci pour votre confiance 🙏
          </p>

          {/* Main Message Box */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Votre réservation a bien été reçue. Nous vous confirmons 
              votre service dans les 15 prochaines minutes.
            </p>
          </div>

          {/* Payment Confirmation Code */}
          {paymentIntentId && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
              <div className="text-center">
                <h3 className="text-lg font-bold text-blue-800 mb-3">
                  Code de confirmation de paiement
                </h3>
                <div className="bg-white rounded-lg border-2 border-blue-300 px-4 py-3 inline-block">
                  <p className="text-xl font-mono font-bold text-blue-900">
                    PI-{paymentIntentId}
                  </p>
                </div>
                <p className="text-sm text-blue-700 mt-3">
                  Veuillez conserver ce code pour vos archives
                </p>
              </div>
            </div>
          )}

          {/* WhatsApp Section */}
          <div className="bg-green-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.673.149-.197 0-.398.149-.596.448-.297.298-.596.597-.596.597-.298.298-.596.149-.697 0-.298.149-.647.298-.896.447-.347.198-.647.447-.896.646-.398.249-.696.497-.896.647-.298.149-.596.249-.896.149-.398 0-.697-.149-.896-.447-.199-.298-.347-.647-.447-.896-.149-.249 0-.497.149-.696.298-.199.149-.398.298-.596.447-.199.149-.347.298-.596.447-.199.149-.347.249-.596.398-.199.149-.347.249-.596.398-.199.149-.347.149-.596.298-.199.149-.347.149-.596.298z"/>
                  <path d="M12.034 20.546c-2.397 0-4.597-.696-6.462-1.894l-.447-.249-4.621 1.191.149-.447 1.191-4.621-.249-.447c-1.197-1.865-1.894-4.065-1.894-6.462 0-6.563 5.337-11.9 11.9-11.9s11.9 5.337 11.9 11.9c0 2.397-.696 4.597-1.894 6.462l-.249.447 1.191 4.621-.149.447-4.621-1.191-.249.447c1.197 1.865 1.894 4.065 1.894 6.462 0 6.563-5.337 11.9-11.9 11.9s-11.9-5.337-11.9-11.9z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-green-700">
                Vous pouvez aussi nous contacter directement sur WhatsApp 
                pour toute question :
              </h3>
            </div>
            
            <a
              href="https://wa.me/33602353569"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.673.149-.197 0-.398.149-.596.448-.297.298-.596.597-.596.597-.298.298-.596.149-.697 0-.298.149-.647.298-.896.447-.347.198-.647.447-.896.646-.398.249-.696.497-.896.647-.298.149-.596.249-.896.149-.398 0-.697-.149-.896-.447-.199-.298-.347-.647-.447-.896-.149-.249 0-.497.149-.696.298-.199.149-.398.298-.596.447-.199.149-.347.298-.596.447-.199.149-.347.249-.596.398-.199.149-.347.249-.596.398-.199.149-.347.149-.596.298-.199.149-.347.149-.596.298z"/>
                <path d="M12.034 20.546c-2.397 0-4.597-.696-6.462-1.894l-.447-.249-4.621 1.191.149-.447 1.191-4.621-.249-.447c-1.197-1.865-1.894-4.065-1.894-6.462 0-6.563 5.337-11.9 11.9-11.9s11.9 5.337 11.9 11.9c0 2.397-.696 4.597-1.894 6.462l-.249.447 1.191 4.621-.149.447-4.621-1.191-.249.447c1.197 1.865 1.894 4.065 1.894 6.462 0 6.563-5.337 11.9-11.9 11.9s-11.9-5.337-11.9-11.9z"/>
              </svg>
              Contacter sur WhatsApp
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/mon-compte')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              📋 Voir mes réservations
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              🏠 Retour à l'accueil
            </button>
          </div>

          {/* Additional decorative elements */}
          <div className="mt-8 flex justify-center gap-4 text-2xl">
            <span className="bounce" style={{ animationDelay: '0.2s' }}>🐾</span>
            <span className="bounce" style={{ animationDelay: '0.4s' }}>💚</span>
            <span className="bounce" style={{ animationDelay: '0.6s' }}>✅</span>
          </div>
        </div>
      </div>
    </div>
  );
}
