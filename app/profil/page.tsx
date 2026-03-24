"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProfilPage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check authentication and load user data
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!session || error) {
        window.location.href = '/login';
        return;
      }
      
      setUser(session.user);
      
      // Load user profile data from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!profileError && profileData) {
        setProfile({
          firstName: profileData.first_name || "",
          lastName: profileData.last_name || "",
          email: session.user?.email || "",
          phone: profileData.phone || "",
          address: profileData.address || ""
        });
      } else {
        // If no profile exists, use user metadata
        setProfile({
          firstName: session.user?.user_metadata?.first_name || "",
          lastName: session.user?.user_metadata?.last_name || "",
          email: session.user?.email || "",
          phone: session.user?.user_metadata?.phone || "",
          address: session.user?.user_metadata?.address || ""
        });
      }

      setIsLoading(false);
    };

    checkSession();
  }, []);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      // Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const fullName = `${profile.firstName} ${profile.lastName}`;
        
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            prenom: fullName.split(' ')[0],
            nom: fullName.split(' ').slice(1).join(' '),
            telephone: profile.phone,
            adresse: profile.address,
          });

        if (!error) {
          alert('Profil mis à jour ✅');
          window.location.href = '/mon-compte';
        } else {
          alert('Erreur: ' + error.message);
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[#1D9E75]">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Header */}
      <header className="rounded-3xl bg-[#1D9E75] px-6 py-8 text-white md:px-10">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold md:text-3xl">Mon profil</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
        {/* Profile Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-800 text-center">
              {successMessage}
            </div>
          )}

          <form className="space-y-6">
            {/* Prénom et Nom */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Prénom et Nom</label>
              <input
                type="text"
                value={`${profile.firstName} ${profile.lastName}`}
                onChange={(e) => {
                  const names = e.target.value.split(' ');
                  setProfile(prev => ({
                    ...prev,
                    firstName: names[0] || "",
                    lastName: names.slice(1).join(' ') || ""
                  }));
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                placeholder="Jean Dupont"
              />
            </div>

            {/* Email (Disabled) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50 text-slate-500 cursor-not-allowed"
                placeholder="email@example.com"
              />
              <p className="mt-1 text-xs text-slate-500">L'email ne peut pas être modifié</p>
            </div>

            {/* Téléphone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Téléphone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                placeholder="06 12 34 56 78"
              />
            </div>

            {/* Adresse */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Adresse</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                placeholder="123 Rue de la République, 85200 Fontenay-le-Comte"
              />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-[#1D9E75] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1a8a63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sauvegarde..." : "Sauvegarder les modifications"}
            </button>
            <Link
              href="/mon-compte"
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-center"
            >
              Retour
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
