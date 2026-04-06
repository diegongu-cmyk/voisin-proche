"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Un email de réinitialisation a été envoyé à votre adresse email.");
        setEmail("");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#1D9E75"/>
              <circle cx="14" cy="15" r="4" fill="white" opacity="0.8"/>
              <path d="M8 26C8 22.5 10.7 20 14 20C17.3 20 20 22.5 20 26V28H8V26Z" fill="white" opacity="0.8"/>
              <circle cx="26" cy="13" r="5" fill="white"/>
              <path d="M19 26C19 22 22 19 26 19C30 19 33 22 33 26V28H19V26Z" fill="white"/>
              <path d="M17 24C18.5 22.5 21 22 23 23" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <circle cx="12" cy="8" r="4" fill="#F59E0B"/>
              <circle cx="12" cy="7" r="1.8" fill="white"/>
              <path d="M10 9.5C10 9.5 12 13 12 13C12 13 14 9.5 14 9.5" fill="#F59E0B"/>
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-[#085041]">Voisin</span>
              <span className="text-xl font-light text-[#1D9E75]">Proche</span>
            </div>
          </div>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-[#085041] mb-2 text-center">Mot de passe oublié ?</h1>
          <p className="text-sm text-slate-600 text-center mb-6">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                placeholder="vous@email.com"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1D9E75] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#1a8a63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </button>
            
            {/* Success Message */}
            {success && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm text-center">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6 pt-6 border-t border-slate-200">
            <span className="text-sm text-slate-600">
              <Link href="/login" className="text-[#1D9E75] font-medium hover:underline">
                ← Retour à la connexion
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
