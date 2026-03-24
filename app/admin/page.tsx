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

  const updateServicePrice = (id: number, newPrice: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, price: newPrice } : service
    ));
  };

  // Función handleConfirmer - actualiza statut a 'confirme' y envía email
  const handleConfirmer = async (reservationId: string) => {
    console.log('Intentando confirmar:', reservationId);
    const { error, data } = await supabase
      .from('reservations')
      .update({ statut: 'confirme' })
      .eq('id', reservationId)
      .select();

    if (!error && data && data.length > 0) {
      // Obtener email directamente de Supabase
      const { data: reservationData } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', reservationId)
        .single();

      if (reservationData) {
        const details = typeof reservationData.details === 'string'
          ? JSON.parse(reservationData.details)
          : reservationData.details;

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
          });
        }
      }
      window.location.reload();
    } else {
      alert('Erreur lors de la confirmation');
    }
  };

  // Función handleAnnuler - actualiza statut a 'annule'
  const handleAnnuler = async (reservationId: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ statut: 'annule' })
      .eq('id', reservationId);
    if (!error) {
      window.location.reload();
    } else {
      alert('Erreur: ' + error.message);
    }
  };

  // Función handleTerminer - actualiza statut a 'termine' y actualiza tabla fidelite
  const handleTerminer = async (reservationId: string, userId: string, serviceName: string) => {
    console.log('Terminer - userId:', userId, 'service:', serviceName);
    
    // 1. Primero actualiza reservations
    const { error } = await supabase
      .from('reservations')
      .update({ statut: 'termine' })
      .eq('id', reservationId);

    // 2. Si no hay error, actualiza fidelite
    if (!error) {
      const { data: existing } = await supabase
        .from('fidelite')
        .select('*')
        .eq('user_id', userId)
        .eq('service', serviceName)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('fidelite')
          .update({ count: existing.count + 1 })
          .eq('user_id', userId)
          .eq('service', serviceName);
      } else {
        await supabase
          .from('fidelite')
          .insert({ user_id: userId, service: serviceName, count: 1 });
      }
      
      window.location.reload();
    } else {
      alert('Error: ' + error.message);
    }
  };

  // Función handleWhatsApp - abre WhatsApp con mensaje de confirmación
  const handleWhatsApp = (booking: any) => {
    const details = typeof booking.details === 'string' ? JSON.parse(booking.details) : booking.details;
    const phone = details?.phone?.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Bonjour ${details?.fullName}, votre réservation pour ${booking.service} le ${booking.date} à ${booking.heure} est confirmée ! À bientôt — Voisin Proche 🌿`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
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

      const revenue = reservations?.reduce((sum: number, r: any) => {
        return sum + (r.prix || 0);
      }, 0) || 0;

      setTodayStats({
        reservations: reservations?.length || 0,
        revenue: revenue,
        newClients: 0,
        unreadMessages: 0
      });

      setTodayBookings(reservations?.map((r: any) => {
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

      // Load all reservations
      const { data: allReservations, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading all reservations:', error);
        return;
      }

      setAllBookings(allReservations?.map((r: any) => {
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

      setRecentMessages(allMessages || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#1D9E75] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#085041] mb-2">Voisin Proche</h1>
            <p className="text-[#1D9E75]">Espace Administrateur</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                placeholder="Entrez le mot de passe"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-[#1D9E75] text-white py-3 rounded-lg font-medium hover:bg-[#085041] transition-colors"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#085041]">Voisin Proche Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{formatDate()}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Réservations aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.reservations}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.revenue}€</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nouveaux clients</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.newClients}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages non lus</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.unreadMessages}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

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
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        Aucune réservation aujourd'hui
                      </td>
                    </tr>
                  ) : (
                    todayBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.time}</td>
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
        <section className="mt-8">
          <h2 className="text-xl font-bold text-[#085041] mb-4">
            Toutes les réservations ({allBookings.length} au total)
          </h2>
          
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
                                  onClick={() => handleWhatsApp(booking)}
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
                                  onClick={() => handleWhatsApp(booking)}
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
                                onClick={() => handleWhatsApp(booking)}
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
        <section className="mt-8">
          <h2 className="text-xl font-bold text-[#085041] mb-4">Messages récents</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {recentMessages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucun message récent</p>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{message.name}</p>
                        <p className="text-sm text-gray-600">{message.email}</p>
                        <p className="text-gray-700 mt-1">{message.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
