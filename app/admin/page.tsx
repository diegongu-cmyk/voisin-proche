"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [services, setServices] = useState([
    { id: 1, name: "Promenade de chiens", price: "11€", active: true },
    { id: 2, name: "Garde d'animaux", price: "25€/jour", active: true },
    { id: 3, name: "Cours d'espagnol", price: "30€/heure", active: true },
    { id: 4, name: "Ménage", price: "20€/heure", active: true },
    { id: 5, name: "Bricolage", price: "35€/heure", active: false },
    { id: 6, name: "Jardinage", price: "25€/heure", active: false },
    { id: 7, name: "Cours d'informatique", price: "30€/heure", active: true }
  ]);

  // Sample data for demonstration - will be loaded from Supabase
  const [todayStats, setTodayStats] = useState({
    reservations: 0,
    revenue: 0,
    newClients: 0,
    unreadMessages: 0
  });

  const [todayBookings, setTodayBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const admin = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(admin);
    
    // Load admin data when authenticated
    if (admin) {
      loadAdminData();
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin2025") {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      setError("");
      // Load admin data after successful login
      loadAdminData();
    } else {
      setError("Mot de passe incorrect");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    setPassword("");
  };

  const toggleService = (id: number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, active: !service.active } : service
    ));
  };

  };

  const handleConfirmer = async (reservationId: string) => {
  console.log('Intentando confirmar:', reservationId)
  const { error, data } = await supabase
    .from('reservations')
    .update({ statut: 'confirme' })
    .eq('id', reservationId)
    .select()

  if (!error && data && data.length > 0) {
    // Obtener email directamente de Supabase
    const { data: reservationData } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()

    if (reservationData) {
      const details = typeof reservationData.details === 'string'
        ? JSON.parse(reservationData.details)
        : reservationData.details

      if (details?.email) {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: details.email,
            subject: 'Votre réservation est confirmée — Voisin Proche',
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1D9E75;">Voisin Proche</h1>
              <h2 style="color: #085041;">Votre réservation est confirmée ! ✅</h2>
              <p>Bonjour ${details.fullName || 'cher client'},</p>
              <p>Nous avons le plaisir de confirmer votre réservation :</p>
              <div style="background: #E1F5EE; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Service :</strong> ${reservationData.service}</p>
                <p><strong>Date :</strong> ${reservationData.date}</p>
                <p><strong>Heure :</strong> ${reservationData.heure}</p>
              </div>
              <p>Nous vous contacterons bientôt pour les derniers détails.</p>
              <p>Pour toute question : voisinprochecontact@gmail.com</p>
              <p style="color: #1D9E75;"><strong>L'équipe Voisin Proche</strong></p>
            </div>`
          })
        })
      }
    }
    window.location.reload()
  } else {
    alert('Erreur lors de la confirmation')
  }
}

  const handleAnnuler = async (reservationId: string) => {
  const { error } = await supabase
    .from('reservations')
    .update({ statut: 'annule' })
    .eq('id', reservationId)
  if (!error) {
    window.location.reload()
  } else {
    alert('Erreur: ' + error.message)
  }
}
  

    const { data: reservation } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()
  
    const details = typeof reservation?.details === 'string'
      ? JSON.parse(reservation.details)
      : reservation?.details

  const handleWhatsApp = (booking: any) => {
    const details = typeof booking.details === 'string' ? JSON.parse(booking.details) : booking.details;
    const phone = details?.phone?.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Bonjour ${details?.fullName}, votre réservation pour ${booking.service} le ${booking.date} à ${booking.heure} est confirmée ! À bientôt — Voisin Proche 🌿`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }

const handleTerminer = async (reservationId: string, userId: string, serviceName: string) => {
  console.log('Terminer - userId:', userId, 'service:', serviceName)
  
  // 1. Primero actualiza reservations
  const { error } = await supabase
    .from('reservations')
    .update({ statut: 'termine' })
    .eq('id', reservationId)

  // 2. Si no hay error, actualiza fidelite
  if (!error) {
    const { data: existing } = await supabase
      .from('fidelite')
      .select('*')
      .eq('user_id', userId)
      .eq('service', serviceName)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('fidelite')
        .update({ count: existing.count + 1 })
        .eq('user_id', userId)
        .eq('service', serviceName)
    } else {
      await supabase
        .from('fidelite')
        .insert({ user_id: userId, service: serviceName, count: 1 })
    }
    
    // 3. Luego window.location.reload()
    window.location.reload()
  } else {
    alert('Error: ' + error.message)
  }
}

  const loadAdminData = async () => {
    try {
      // Load today's reservations
      const today = new Date().toISOString().split('T')[0];
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .eq('date', today)
        .order('heure', { ascending: true });

      if (reservationsError) {
        console.error('Error loading reservations:', reservationsError);
        return;
      }

      // Calculate stats from real data
      const revenue = reservations?.reduce((sum: number, r: any) => {
        return sum + (r.prix || 0);
      }, 0) || 0;

      console.log('IDs de hoy:', reservations?.map(r => r.id))

      setTodayStats({
        reservations: reservations?.length || 0,
        revenue: revenue,
        newClients: 0, // TODO: Calculate from users who signed up today
        unreadMessages: 0 // Will be updated below
      });

      setTodayBookings(reservations?.map((r: any) => {
        console.log('Reservación mapeada:', { id: r.id, type: typeof r.id, fullData: r });
        return {
          id: r.id,
          user_id: r.user_id,
          service: r.service,
          time: r.heure,
          client: r.details?.fullName || 'Client',
          phone: r.details?.phone || '',
          details: r.details?.dogName ? `${r.details.dogName} - ${r.details.walkDuration || '30min'}` : 'Service personnalisé',
          notes: r.notes || '',
          status: r.statut === 'en_attente' ? 'En attente' : 
                  r.statut === 'confirme' ? 'Confirmé' : 
                  r.statut === 'annule' ? 'Annulé' : 'Terminé'
        };
      }) || []);

      // Load unread messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('lu', false);

      if (messagesError) {
        console.error('Error loading messages:', messagesError);
        return;
      }

      setUnreadMessages(messages || []);
      setTodayStats(prev => ({ ...prev, unreadMessages: messages?.length || 0 }));

      // Load all reservations
      const { data: allReservations, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Reservations:', allReservations, 'Error:', error);
      console.log('IDs cargados:', allReservations?.map(r => r.id))

      if (error) {
        console.error('Error loading all reservations:', error);
        return;
      }

      setAllBookings(allReservations?.map((r: any) => {
        console.log('Reservación completa mapeada:', { id: r.id, type: typeof r.id, fullData: r });
        return {
          id: r.id,
          user_id: r.user_id,
          service: r.service,
          time: r.heure,
          date: r.date,
          client: r.details?.fullName || 'Client',
          phone: r.details?.phone || '',
          details: r.details?.dogName ? `${r.details.dogName} - ${r.details.walkDuration || '30min'}` : 'Service personnalisé',
          notes: r.notes || '',
          status: r.statut === 'en_attente' ? 'En attente' : 
                  r.statut === 'confirme' ? 'Confirmé' : 
                  r.statut === 'annule' ? 'Annulé' : 'Terminé'
        };
      }) || []);

      // Load recent messages
      const { data: allMessages, error: allMessagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (allMessagesError) {
        console.error('Error loading all messages:', allMessagesError);
        return;
      }

      const formattedMessages = allMessages?.map((msg: any) => ({
        id: msg.id,
        name: msg.nom,
        subject: msg.sujet,
        date: new Date(msg.created_at).toLocaleDateString('fr-FR'),
        message: msg.message,
        unread: !msg.lu
      })) || [];

      setRecentMessages(formattedMessages);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmé":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Annulé":
        return "bg-red-100 text-red-800";
      case "Terminé":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

    if (!phone) return '#';
    
    // Formatear el número (eliminar espacios, +, etc.)
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    
    // Mensaje predefinido
    const message = `Bonjour ${clientName}, c'est Voisin Proche concernant votre réservation pour le service "${service}". Comment pouvons-nous vous aider ?`;
    
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('fr-FR', options);
  };

  // Admin Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-4">
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
            <h1 className="text-2xl font-bold text-[#085041]">Accès administrateur</h1>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                placeholder="Entrez le mot de passe"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1D9E75] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#1a8a63] transition-colors"
            >
              Accéder
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Header */}
      <header className="bg-[#085041] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Panel Admin — Voisin Proche</h1>
            <p className="text-sm opacity-90">{formatDate()}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Section 1 - Statistiques du jour */}
        <section>
          <h2 className="text-xl font-bold text-[#085041] mb-4">Statistiques du jour</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{todayStats.reservations}</p>
                  <p className="text-sm text-blue-700">Réservations aujourd'hui</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900">{todayStats.revenue}€</p>
                  <p className="text-sm text-green-700">Revenus du jour</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-900">{todayStats.newClients}</p>
                  <p className="text-sm text-yellow-700">Nouveaux clients</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-900">{todayStats.unreadMessages}</p>
                  <p className="text-sm text-orange-700">Messages non lus</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Réservations du jour */}
        <section>
          <h2 className="text-xl font-bold text-[#085041] mb-4">Réservations du jour</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Heure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Détails</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {todayBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                        Aucune réservation aujourd'hui
                      </td>
                    </tr>
                  ) : (
                    todayBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{booking.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{booking.service}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{booking.details}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={booking.notes}>
                          {booking.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            {booking.status === "En attente" && (
                              <>
                                <button 
                                  onClick={() => handleConfirmer(booking.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  Confirmer
                                </button>
                                <button 
                                  onClick={() => handleAnnuler(booking.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  Annuler
                                </button>
                              </>
                            )}
                            {booking.status === "Confirmé" && (
                              <button 
                                onClick={() => handleTerminer(booking.id, booking.user_id, booking.service)}
                                className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Terminer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3 - Toutes les réservations */}
        <section>
          <h2 className="text-xl font-bold text-[#085041] mb-4">
            Toutes les réservations ({allBookings.length} au total)
          </h2>
          
          {/* Botón de prueba */}
          <button 
            onClick={async () => {
              const firstId = allBookings[0]?.id
              if (!firstId) { alert('No hay reservas'); return; }
              alert('Intentando confirmar: ' + firstId)
              const { data, error } = await supabase
                .from('reservations')
                .update({ statut: 'confirme' })
                .eq('id', firstId)
                .select()
              alert('Resultado: ' + JSON.stringify({ data, error }))
              if (!error) {
                setAllBookings(prev => prev.map(r => r.id === firstId ? {...r, statut: 'confirme'} : r))
              }
            }}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            TEST: Confirmer première réservation
          </button>
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Heure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Détails</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {allBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                        Aucune réservation pour le moment
                      </td>
                    </tr>
                  ) : (
                    allBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{booking.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{booking.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{booking.service}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{booking.details}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={booking.notes}>
                          {booking.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            {booking.status === "En attente" && (
                              <>
                                <button 
                                  onClick={() => handleConfirmer(booking.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  Confirmer
                                </button>
                                <button 
                                  onClick={() => handleAnnuler(booking.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  Annuler
                                </button>
                                <button 
                                  onClick={() => {
                                    const details = typeof booking.details === 'string' ? JSON.parse(booking.details) : booking.details;
                                    const phone = details?.phone?.replace(/[^0-9]/g, '');
                                    const message = encodeURIComponent(`Bonjour ${details?.fullName}, votre réservation pour ${booking.service} le ${booking.date} à ${booking.heure} est confirmée ! À bientôt — Voisin Proche 🌿`);
                                    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                                  }}
                                  className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                                >
                                  <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.855L.057 23.273a.75.75 0 00.92.92l5.418-1.466A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.188-1.433l-.372-.22-3.862 1.046 1.046-3.862-.22-.372A9.944 9.44 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                  </svg>
                                </button>
                              </>
                            )}
                            {booking.status === "Confirmé" && (
                              <>
                                <button 
                                  onClick={() => handleTerminer(booking.id, booking.user_id, booking.service)}
                                  className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  Terminer
                                </button>
                                <button 
                                  onClick={() => {
                                    const details = typeof booking.details === 'string' ? JSON.parse(booking.details) : booking.details;
                                    const phone = details?.phone?.replace(/[^0-9]/g, '');
                                    const message = encodeURIComponent(`Bonjour ${details?.fullName}, votre réservation pour ${booking.service} le ${booking.date} à ${booking.heure} est confirmée ! À bientôt — Voisin Proche 🌿`);
                                    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                                  }}
                                  className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                                >
                                  <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.855L.057 23.273a.75.75 0 00.92.92l5.418-1.466A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.188-1.433l-.372-.22-3.862 1.046 1.046-3.862-.22-.372A9.944 9.44 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                  </svg>
                                </button>
                              </>
                            )}
                            {booking.status === "Terminé" && (
                              <button 
                                onClick={() => {
                                  const details = typeof booking.details === 'string' ? JSON.parse(booking.details) : booking.details;
                                  const phone = details?.phone?.replace(/[^0-9]/g, '');
                                  const message = encodeURIComponent(`Bonjour ${details?.fullName}, votre réservation pour ${booking.service} le ${booking.date} à ${booking.heure} est confirmée ! À bientôt — Voisin Proche 🌿`);
                                  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                              >
                                <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.855L.057 23.273a.75.75 0 00.92.92l5.418-1.466A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.188-1.433l-.372-.22-3.862 1.046 1.046-3.862-.22-.372A9.944 9.44 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4 - Messages récents */}
        <section>
          <h2 className="text-xl font-bold text-[#085041] mb-4">Messages récents</h2>
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#085041]">{message.name}</h3>
                    <p className="text-sm text-slate-600">{message.subject}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{message.date}</span>
                    {message.unread && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Non lu
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-4 line-clamp-2">{message.message}</p>
                <button 
                  onClick={() => window.location.href = `mailto:${message.name.toLowerCase().replace(' ', '.')}@example.com`}
                  className="bg-[#1D9E75] hover:bg-[#1a8a63] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Répondre
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 - Gestion des services */}
        <section>
          <h2 className="text-xl font-bold text-[#085041] mb-4">Gestion des services</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleService(service.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        service.active ? 'bg-[#1D9E75]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          service.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`font-medium ${service.active ? 'text-slate-900' : 'text-slate-500'}`}>
                      {service.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={service.price}
                      onChange={(e) => updateServicePrice(service.id, e.target.value)}
                      className="w-24 px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                    />
                    <span className={`text-sm font-medium ${service.active ? 'text-green-600' : 'text-gray-500'}`}>
                      {service.active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
