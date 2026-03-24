"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function MonComptePage() {
  // Profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });
  
  const totalServices = 7;
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userReservations, setUserReservations] = useState<any[]>([]);
  const [fidelityData, setFidelityData] = useState<any[]>([]);
  const [historiqueData, setHistoriqueData] = useState<any[]>([]);

  const getServiceEmoji = (serviceName: string) => {
    const emojiMap: { [key: string]: string } = {
      "Promenade de chiens": "🐕",
      "Garde d'animaux": "🏠",
      "Accompagnement de personnes": "🤝",
      "Courses et commissions": "🛒",
      "Ménage maison/bureau": "🧹",
      "Cours d'espagnol": "📚",
      "Autres services": "⭐"
    };
    return emojiMap[serviceName] || "⭐";
  };

  // Define all 7 services that should always be shown
  const allServices = [
    { name: "Promenade de chiens", emoji: "🐕" },
    { name: "Garde d'animaux", emoji: "🏠" },
    { name: "Accompagnement de personnes", emoji: "🤝" },
    { name: "Courses et commissions", emoji: "🛒" },
    { name: "Ménage maison/bureau", emoji: "🧹" },
    { name: "Cours d'espagnol", emoji: "📚" },
    { name: "Autres services", emoji: "⭐" }
  ];

  // Service progress data from Supabase - now shows all 7 services
  console.log('Datos fidelite:', fidelityData)
  
  // Create service progress for all 7 services
  const serviceProgress = allServices.map(service => {
    const fidelityItem = fidelityData.find(item => item.service_name === service.name);
    const count = fidelityItem ? fidelityItem.count : 0;
    
    return {
      name: service.name,
      service: service.name,
      emoji: service.emoji,
      completed: count,
      count: count,
      total: 7,
      hasDiscount: count >= 7
    };
  });

  useEffect(() => {
    // Check authentication and load user data
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!session || error) {
        window.location.href = '/login';
        return;
      }
      
      setUser(session.user);
      setProfile(prev => ({
        ...prev,
        email: session.user?.email || "",
        firstName: session.user?.user_metadata?.first_name || "",
        lastName: session.user?.user_metadata?.last_name || ""
      }));

      // Load user's reservations
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!reservationsError && reservations) {
        setUserReservations(reservations.slice(0, 3)); // Show only 3 most recent
      }

      // Load fidelity data
      const { data: fidelity, error: fidelityError } = await supabase
        .from('fidelite')
        .select('*')
        .eq('user_id', session.user.id);

      if (!fidelityError && fidelity && fidelity.length > 0) {
        setFidelityData(fidelity);
      } else {
        // If no fidelity data, set empty array - we'll show all services at 0/7 in serviceProgress
        setFidelityData([]);
      }

      // Load historique data (services terminés)
      const { data: historique, error: historiqueError } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('statut', 'termine')
        .order('date', { ascending: false });

      console.log('Historique data:', historique)
      console.log('Historique error:', historiqueError)
      console.log('User ID:', session.user.id)

      if (!historiqueError && historique) {
        setHistoriqueData(historique);
      } else {
        setHistoriqueData([]);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          window.location.href = '/login';
        } else {
          setUser(session.user);
          setProfile(prev => ({
            ...prev,
            email: session.user?.email || "",
            firstName: session.user?.user_metadata?.first_name || "",
            lastName: session.user?.user_metadata?.last_name || ""
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Update user data in Supabase
    supabase.auth.updateUser({
      data: {
        user_metadata: {
          first_name: profile.firstName,
          last_name: profile.lastName
        }
      }
    });
    console.log("Profile saved:", profile);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Recent reservations from Supabase
  const recentReservations = userReservations.map(reservation => ({
    id: reservation.id,
    service: reservation.service,
    date: new Date(reservation.date).toLocaleDateString('fr-FR'),
    status: reservation.statut === 'en_attente' ? 'En attente' : 
            reservation.statut === 'confirme' ? 'Confirmé' : 
            reservation.statut === 'annule' ? 'Annulé' : 'Terminé',
    details: reservation.details?.fullName ? `${reservation.details.dogName || ''} - ${reservation.details.walkDuration || '30min'}` : 'Service personnalisé',
    prix: reservation.prix || 0
  }));

  // Pets (simulated data)
  const pets = [
    {
      id: 1,
      name: "Max",
      breed: "Golden Retriever",
      size: "Grand - plus de 25kg"
    },
    {
      id: 2,
      name: "Luna",
      breed: "Chat européen",
      size: "Petit - moins de 10kg"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmé":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Terminé":
        return "bg-gray-100 text-gray-800";
      case "Annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Header */}
      <header className="rounded-3xl bg-[#1D9E75] px-6 py-8 text-white md:px-10">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
            {initials || "U"}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-extrabold md:text-3xl">
              {profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : "Mon compte"}
            </h1>
            <p className="text-white/90">{profile.email}</p>
            <div className="mt-2 inline-flex rounded-full bg-[#1D9E75]/20 px-3 py-1 text-sm font-semibold text-white">
              Membre Voisin Proche
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 space-y-8">
        {/* SECTION 1 - Ma carte de fidélité par service */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F59E0B]">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#085041]">Ma carte de fidélité</h2>
          </div>

          {(fidelityData.length === 0 || fidelityData.every(item => item.count === 0 || item.completed === 0)) ? (
            // Show all 7 services at 0/7 for new users
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {serviceProgress.map((service, index) => (
                <div
                  key={index}
                  className="rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all"
                >
                  {/* Service Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{service.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#085041] text-lg">{service.name}</h3>
                    </div>
                  </div>

                  {/* Progress Circles */}
                  <div className="flex justify-center gap-2 mb-4">
                    {Array.from({ length: service.total }, (_, i) => (
                      <div
                        key={i}
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                          i < service.completed
                            ? "bg-[#1D9E75] shadow-md"
                            : "bg-gray-200"
                        }`}
                      >
                        {i < service.completed ? (
                          <span className="text-xs font-bold text-white">{i + 1}</span>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">{i + 1}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Progress Text */}
                  <div className="text-center">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">{service.count} services</span> · Plus que {Math.max(0, 7 - service.count)} pour votre réduction -20%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show only used services
            <div className="grid gap-4 md:grid-cols-2">
              {serviceProgress.map((service, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border-2 p-5 transition-all ${
                    service.hasDiscount 
                      ? 'border-[#F59E0B] bg-[#FFFBF5] shadow-lg' 
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {/* Service Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{service.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#085041] text-lg">{service.name}</h3>
                      {service.hasDiscount && (
                        <span className="inline-flex animate-pulse rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-yellow-900">
                          −20% disponible !
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3 style={{fontSize: '15px', fontWeight: '600', color: '#085041', marginBottom: '12px'}}>
                    {service.service}
                  </h3>

                  {/* Progress Circles */}
                  <div className="flex justify-center gap-2 mb-4">
                    {Array.from({ length: service.total }, (_, i) => (
                      <div
                        key={i}
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                          i < service.completed
                            ? "bg-[#1D9E75] shadow-md"
                            : "bg-gray-200"
                        }`}
                      >
                        {i < service.completed ? (
                          <span className="text-xs font-bold text-white">{i + 1}</span>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">{i + 1}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Progress Text */}
                  <div className="text-center">
                    {service.hasDiscount ? (
                      <p className="font-bold text-[#085041] animate-pulse">
                        Votre 8ème {service.name.toLowerCase()} sera à -20% ! 🎁
                      </p>
                    ) : (
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">{service.count} services</span> · Plus que ${Math.max(0, 7 - service.count)} pour votre réduction -20%
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2 - Historique de mes services */}
        <section className="rounded-2xl border border-slate-200 bg-[#FFFBF5] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D9E75]">
              <span className="text-xl">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-[#085041]">Historique de mes services</h2>
          </div>

          {historiqueData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-500">Aucun service terminé pour le moment</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {historiqueData.map((reservation, index) => (
                <div key={index} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getServiceEmoji(reservation.service)}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#085041] text-lg mb-1">{reservation.service}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          {new Date(reservation.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p>Heure: {reservation.heure}</p>
                        {reservation.prix && (
                          <p>Prix: {reservation.prix}€</p>
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Terminé
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 3 - Mon profil */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#085041]">Mon profil</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-medium text-[#1D9E75] hover:text-[#1a8a63]"
              >
                Modifier
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Prénom</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                disabled={!isEditing}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75] disabled:bg-slate-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nom</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                disabled={!isEditing}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75] disabled:bg-slate-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                disabled={!isEditing}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75] disabled:bg-slate-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Téléphone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                disabled={!isEditing}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75] disabled:bg-slate-50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSaveProfile}
                className="flex-1 rounded-lg bg-[#1D9E75] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a8a63]"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Annuler
              </button>
            </div>
          )}
        </section>

        {/* Logout Button */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
