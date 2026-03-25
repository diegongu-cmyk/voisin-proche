"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function MonComptePage() {
  console.log('Component mounting...')
  
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
  const [fidelityData, setFidelityData] = useState<any[] | null>(null);
  const [historiqueData, setHistoriqueData] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

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

  // Define all 6 main services that should be shown
  const allServices = [
    { name: "Promenade de chiens", emoji: "🐕" },
    { name: "Garde d'animaux", emoji: "🏠" },
    { name: "Accompagnement de personnes", emoji: "🤝" },
    { name: "Courses et commissions", emoji: "🛒" },
    { name: "Ménage maison/bureau", emoji: "🧹" },
    { name: "Cours d'espagnol", emoji: "📚" }
  ];

  // Service progress data from Supabase - now shows all 7 services
  console.log('Datos fidelite:', fidelityData)
  console.log('Fidelite data completo:', JSON.stringify(fidelityData))
  
  // Base services list
  const serviciosBase = [
    { name: 'Promenade de chiens', emoji: '🐕' },
    { name: 'Garde d\'animaux', emoji: '🏠' },
    { name: 'Accompagnement de personnes', emoji: '🤝' },
    { name: 'Courses et commissions', emoji: '🛒' },
    { name: 'Ménage maison/bureau', emoji: '🧹' },
    { name: 'Cours d\'espagnol', emoji: '📚' },
  ]

  // Combine base services with fidelity data
  const serviciosConProgreso = useMemo(() => serviciosBase.map(s => {
    const found = fidelityData?.find(f => f.service === s.name)
    return { ...s, count: found?.count || 0 }
  }), [fidelityData])

  useEffect(() => {
  console.log('useEffect running, mounted:', true)
  let mounted = true
  
  const loadData = async () => {
    try {
      console.log('Starting session check...')
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        window.location.href = '/login'
        return
      }
      
      const user = session.user
      if (mounted) setUser(user)
      
      const { data: fideliteData } = await supabase
        .from('fidelite')
        .select('*')
        .eq('user_id', user.id)
      
      if (mounted) setFidelityData(fideliteData || [])
      
      const { data: historique } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .eq('statut', 'termine')
        .order('date', { ascending: false })
      
      if (mounted) setHistoriqueData(historique || [])
      
      const { data: reservations } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (mounted) setUserReservations(reservations || [])
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      if (mounted) setLoading(false)
    }
  }
  
  loadData()
  
  return () => { mounted = false }
}, []) // array vacío - solo ejecutar una vez

  const handleSaveProfile = async () => {
    setIsEditing(false);
    // Update user data in Supabase
    const { error } = await supabase.auth.updateUser({
      data: {
        user_metadata: {
          first_name: editForm.firstName,
          last_name: editForm.lastName,
          phone: editForm.phone,
          address: editForm.address
        }
      }
    });

    if (!error) {
      // Update local profile state
      setProfile(prev => ({
        ...prev,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
        address: editForm.address
      }));
      
      // Close modal and show success message
      setShowEditModal(false);
      setSuccessMessage("Profil mis à jour ✅");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    
    console.log("Profile saved:", editForm);
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
      {/* Loading State */}
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-4xl">⏳</div>
            <p className="text-lg text-gray-600">Chargement...</p>
            <p className="text-sm text-gray-500 mt-2">Chargement state: {loading ? 'true' : 'false'}</p>
          </div>
        </div>
      ) : (
        <>
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
                
                {/* Edit Profile Button */}
                <div className="mt-4">
                  <Link
                    href="/profil"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-[#1D9E75] bg-white px-6 py-3 text-sm font-semibold text-[#1D9E75] transition-all hover:bg-[#1D9E75] hover:text-white min-w-[200px]"
                  >
                    ✏️ Modifier mon profil
                  </Link>
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

          {/* Show all 6 services with progress */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {serviciosConProgreso.map((service, index) => (
              <div
                key={index}
                className={`rounded-2xl border-2 p-5 transition-all ${
                  (service.count || 0) >= 7
                    ? "border-[#F59E0B] bg-gradient-to-br from-[#FFF9E6] to-[#FEF3C7]"
                    : "border-slate-200 bg-white"
                }`}
              >
                {/* Trophy for completed services */}
                {(service.count || 0) >= 7 && (
                  <div className="flex justify-center mb-4">
                    <span className="text-4xl">🏆</span>
                  </div>
                )}

                {/* Service Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{service.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#085041] text-lg">{service.name}</h3>
                  </div>
                </div>

                {/* Progress Circles */}
                <div className="flex justify-center gap-2 mb-4">
                  {Array.from({ length: 7 }, (_, i) => {
                    const currentProgress = (service.count || 0) % 7;
                    const hasDiscountEligibility = (service.count || 0) > 0 && (service.count || 0) % 7 === 0;
                    const isActive = i < currentProgress;
                    
                    return (
                      <div
                        key={i}
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? hasDiscountEligibility 
                              ? "bg-[#F59E0B] shadow-md"
                              : "bg-[#1D9E75] shadow-md"
                            : "bg-gray-200"
                        }`}
                      >
                        {isActive ? (
                          <span className="text-xs font-bold text-white">{i + 1}</span>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">{i + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Progress Text */}
                <div className="text-center">
                  {(service.count || 0) > 0 && (service.count || 0) % 7 === 0 ? (
                    <p className="text-sm font-bold text-[#F59E0B]">
                      🎁 -20% sur votre prochain service !
                    </p>
                  ) : (
                    <div>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">{(service.count || 0) % 7}/7</span> · Plus que {7 - ((service.count || 0) % 7)} pour votre réduction
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Total: {service.count || 0} services complétés
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
                          <span className="font-semibold">Demandé le:</span>{" "}
                          {new Date(reservation.created_at).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p>
                          <span className="font-semibold">Service effectué le:</span>{" "}
                          {new Date(reservation.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} à {reservation.heure}
                        </p>
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
        </>
      )}
    </div>
  );
}
