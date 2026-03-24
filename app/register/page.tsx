"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://voisin-proche.vercel.app/mon-compte'
      }
    });
    
    if (error) {
      setError(error.message);
    }
  };

  const handleFacebookLogin = () => {
    // Facebook OAuth will be implemented later
    console.log("Facebook login");
  };
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Vérifiez votre email pour confirmer votre compte !");
        setFullName("");
        setEmail("");
        setPassword("");
        setAcceptTerms(false);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
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

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-[#085041] mb-6 text-center">Créer un compte</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prénom et Nom
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                placeholder="Jean Dupont"
                required
              />
            </div>

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
                placeholder="votre@email.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                placeholder="•••••••"
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-[#1D9E75] border-slate-300 rounded focus:ring-[#1D9E75]"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                En créant un compte, vous acceptez nos conditions générales
              </label>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25-.07a9.91 9.91 0 00-6.13-3.36 9.91 9.91 0 00-6.13 3.36c-.13.72-.2 1.47-.2 2.25 0a9.91 9.91 0 006.13 3.36 9.91 9.91 0 006.13-3.36c.13-.72.2-1.47.2-2.25zM12 23c-2.74 0-5.38-.79-7.68-2.25l-2.54-2.54c-.39-.39-.39-1.02 0-1.41l2.54-2.54c2.3-2.3 4.94-2.25 7.68 2.25 2.74 0 5.38.79 7.68 2.25l2.54 2.54c.39.39.39 1.02 0 1.41l-2.54 2.54c-2.3 2.3-4.94 2.25-7.68-2.25z"/>
                </svg>
                Continuer avec Google
              </button>
              
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 9.86v2.933h-2.951c0 1.008.617 1.846 1.45 2.528h2.951c1.008 0 1.846-.617 1.45-1.45v-2.933c0-5.99-4.388-10.954-9.86H12z"/>
                </svg>
                Continuer avec Facebook
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1D9E75] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#1a8a63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-slate-200">
            <span className="text-sm text-slate-600">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-[#1D9E75] font-medium hover:underline">
                Se connecter
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
