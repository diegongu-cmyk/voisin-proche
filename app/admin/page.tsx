"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';

interface Reservation {
  id: string;
  user_id: string;
  service: string;
  date: string;
  heure: string;
  details: any;
  notes: string;
  statut: string;
  prix?: number;
  created_at?: string;
  updated_at?: string;
}

interface ServiceDetails {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  dogName?: string;
  dogBreed?: string;
  walkDuration?: string;
  spanishLevel?: string;
  houseSize?: string;
  gardenSize?: string;
  computerIssue?: string;
  cleaningType?: string;
  handymanService?: string;
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [todayStats, setTodayStats] = useState({
    reservations: 0,
    revenue: 0,
    newClients: 0,
    newSignups: 0,
    unreadMessages: 0
  });
  const [stripeRevenue, setStripeRevenue] = useState({ 
    todayRevenue: 0, 
    monthRevenue: 0,
    carteRevenue: 0,
    virementRevenue: 0,
    especesRevenue: 0
  });

  const [todayBookings, setTodayBookings] = useState<Reservation[]>([]);
  const [allBookings, setAllBookings] = useState<Reservation[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReservations, setSelectedReservations] = useState<string[]>([]);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) navbar.style.display = 'none';
    return () => {
      if (navbar) navbar.style.display = '';
    };
  }, []);

  useEffect(() => {
    const admin = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(admin);
    
    if (admin) {
      loadAdminData();
      fetch('/api/stripe-revenue')
        .then(r => r.json())
        .then(data => setStripeRevenue(data))
        .catch(error => console.error('Error fetching Stripe revenue:', error));
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

  const openDetailsModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedReservation(null);
  };

  const getServiceIcon = (serviceName: string) => {
    const icons: { [key: string]: string } = {
      "Promenade de chiens": "🐕",
      "Garde d'animaux": "🏠",
      "Cours d'espagnol": "📚",
      "Ménage": "🧹",
      "Bricolage": "🔧",
      "Jardinage": "🌱",
      "Cours d'informatique": "💻"
    };
    return icons[serviceName] || "📋";
  };

  const getServicePrice = (serviceName: string) => {
    const prices: { [key: string]: number } = {
      "Promenade de chiens": 11,
      "Garde d'animaux": 25,
      "Cours d'espagnol": 30,
      "Ménage": 20,
      "Bricolage": 35,
      "Jardinage": 25,
      "Cours d'informatique": 30
    };
    return prices[serviceName] || 0;
  };

  const handleConfirmer = async (reservationId: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ statut: 'confirme' })
      .eq('id', reservationId);
    
    if (!error) {
      window.location.reload();
    } else {
      alert('Erreur lors de la confirmation');
    }
  };

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

  const handleTerminer = async (reservationId: string, userId: string, serviceName: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ statut: 'termine' })
      .eq('id', reservationId);

    if (!error) {
      const { data: existing } = await supabase
        .from('fidelite')
        .select('*')
        .eq('user_id', userId)
        .eq('service', serviceName)
        .maybeSingle();

      const newCount = (existing?.count || 0) + 1;
      const remaining = Math.max(0, 7 - newCount);

      if (existing) {
        await supabase
          .from('fidelite')
          .update({ count: newCount })
          .eq('user_id', userId)
          .eq('service', serviceName);
      } else {
        await supabase
          .from('fidelite')
          .insert({ user_id: userId, service: serviceName, count: 1 });
      }

      // Obtener datos de la reserva para el email
      const { data: reservationData } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', reservationId)
        .single();

      // Obtener email del cliente
      const details = typeof reservationData?.details === 'string'
        ? JSON.parse(reservationData.details)
        : reservationData?.details;

      if (details?.email) {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: details.email,
            subject: `Votre service est terminé — ${newCount}/7 vers votre réduction ! 🌿`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #1D9E75;">Voisin Proche</h1>
                <h2 style="color: #085041;">Service terminé ! ✅</h2>
                <p>Bonjour ${details.fullName || 'cher client'},</p>
                <p>Votre service <strong>${serviceName}</strong> est maintenant terminé.</p>
                <div style="background: #E1F5EE; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #085041; margin: 0 0 10px 0;">🌟 Votre carte de fidélité</h3>
                  <p><strong>${serviceName} :</strong> ${newCount}/7 services complétés</p>
                  ${newCount >= 7 
                    ? '<p style="color: #F59E0B; font-weight: bold;">🎁 Félicitations ! Votre prochain service bénéficie de -20% !</p>'
                    : `<p>Plus que <strong>${remaining} service(s)</strong> pour obtenir votre réduction de -20% !</p>` 
                  }
                </div>
                <a href="https://voisin-proche.vercel.app/reserver" style="background: #1D9E75; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
                  Réserver un nouveau service
                </a>
                <p style="color: #1D9E75;"><strong>L'équipe Voisin Proche</strong></p>
              </div>
            `
          })
        });
      }
      
      window.location.reload();
    } else {
      alert('Error: ' + error.message);
    }
  };

  const handleWhatsApp = (reservation: Reservation) => {
    const details = typeof reservation.details === 'string' ? JSON.parse(reservation.details) : reservation.details;
    const phone = details?.phone?.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Bonjour ${details?.fullName}, votre réservation pour ${reservation.service} le ${reservation.date} à ${reservation.heure} est confirmée ! À bientôt — Voisin Proche 🌿`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const visibleIds = allBookings
        .filter(booking => {
          if (statusFilter === 'all') return true;
          return booking.statut === statusFilter;
        })
        .map(booking => booking.id);
      setSelectedReservations(visibleIds);
    } else {
      setSelectedReservations([]);
    }
  };

  const handleSelectReservation = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedReservations(prev => [...prev, id]);
    } else {
      setSelectedReservations(prev => prev.filter(resId => resId !== id));
    }
  };

  const handleMassConfirm = async () => {
    try {
      for (const id of selectedReservations) {
        await supabase.from('reservations').update({ statut: 'confirme' }).eq('id', id);
      }
      alert(`${selectedReservations.length} réservation(s) confirmée(s) avec succès!`);
      setSelectedReservations([]);
      loadAdminData();
    } catch (error) {
      alert('Erreur lors de la confirmation massive');
    }
  };

  const handleMassCancel = async () => {
    try {
      for (const id of selectedReservations) {
        await supabase.from('reservations').update({ statut: 'annule' }).eq('id', id);
      }
      alert(`${selectedReservations.length} réservation(s) annulée(s) avec succès!`);
      setSelectedReservations([]);
      loadAdminData();
    } catch (error) {
      alert('Erreur lors de l\'annulation massive');
    }
  };

  const handleMassDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReservations.length} réservations ?`)) {
      return;
    }
    
    try {
      for (const id of selectedReservations) {
        await supabase.from('reservations').delete().eq('id', id);
      }
      alert(`${selectedReservations.length} réservation(s) supprimée(s) avec succès!`);
      setSelectedReservations([]);
      loadAdminData();
    } catch (error) {
      alert('Erreur lors de la suppression massive');
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
      const now = new Date(); 
      const today = now.toISOString().split('T')[0]; 
      console.log('TODAY DATE:', today);
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .eq('date', today)
        .order('heure', { ascending: true });

      if (reservationsError) {
        console.error('Error loading reservations:', reservationsError);
        return;
      }

      // Contar reservas creadas hoy y calcular ingresos de hoy
      const { data: todayCreatedReservations, error: todayCreatedError } = await supabase
        .from('reservations')
        .select('*')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`);
      
      console.log('TODAY RESERVATIONS DATA:', todayCreatedReservations, todayCreatedError);

      const todayRevenue = todayCreatedReservations?.reduce((sum: number, r: any) => {
        return sum + (parseFloat(r.prix) || getServicePrice(r.service));
      }, 0) || 0;

      // Separar ingresos por método de pago
      const carteRevenue = todayCreatedReservations?.reduce((sum: number, r: any) => {
        const details = typeof r.details === 'string' ? JSON.parse(r.details) : r.details;
        return details?.metodoPago === 'carte' ? sum + (parseFloat(r.prix) || getServicePrice(r.service)) : sum;
      }, 0) || 0;

      const virementRevenue = todayCreatedReservations?.reduce((sum: number, r: any) => {
        const details = typeof r.details === 'string' ? JSON.parse(r.details) : r.details;
        return details?.metodoPago === 'virement' ? sum + (parseFloat(r.prix) || getServicePrice(r.service)) : sum;
      }, 0) || 0;

      const especesRevenue = todayCreatedReservations?.reduce((sum: number, r: any) => {
        const details = typeof r.details === 'string' ? JSON.parse(r.details) : r.details;
        return details?.metodoPago === 'especes' ? sum + (parseFloat(r.prix) || getServicePrice(r.service)) : sum;
      }, 0) || 0;

      // Actualizar stripeRevenue con todos los métodos
      setStripeRevenue({
        todayRevenue: todayRevenue,
        monthRevenue: 0,
        carteRevenue: carteRevenue,
        virementRevenue: virementRevenue,
        especesRevenue: especesRevenue
      });

      console.log('TODAY REVENUE:', todayRevenue);
      console.log('PRIX VALUES:', todayCreatedReservations?.map((r: any) => r.prix));

      // Contar nuevos clientes de hoy
      const newClientsData = await fetch('/api/new-clients')
        .then(r => r.json())
        .catch(() => ({ count: 0 }));
      const todayNewClientsCount = newClientsData.count || 0;

      // Contar nuevos clientes que hicieron su primera reserva hoy
      // Obtener todos los user_id que tienen reservas hoy
      const { data: todayReservations, error: todayReservationsError } = await supabase
        .from('reservations')
        .select('user_id, created_at')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`);

      // Obtener todos los user_id que tuvieron reservas anteriores a hoy
      const { data: previousReservations, error: previousReservationsError } = await supabase
        .from('reservations')
        .select('user_id')
        .lt('created_at', `${today}T00:00:00.000Z`);

      // Filtrar solo los user_id que no tienen reservas anteriores
      const previousUserIds = previousReservations?.map(r => r.user_id) || [];
      const todayUserIds = todayReservations?.map(r => r.user_id) || [];
      const uniqueTodayUserIds = [...new Set(todayUserIds)];
      const newUserIds = uniqueTodayUserIds.filter(userId => !previousUserIds.includes(userId));

      // Obtener detalles de los nuevos clientes (opcional, para el conteo solo necesitamos el array)
      const todayNewClientsWithFirstReservation = newUserIds.length || 0;

      setTodayStats({
        reservations: todayCreatedReservations?.length || 0,
        revenue: todayRevenue,
        newClients: todayNewClientsWithFirstReservation,
        newSignups: todayNewClientsCount,
        unreadMessages: 0
      });

      setTodayBookings(reservations || []);

      const { data: allReservations, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading all reservations:', error);
        return;
      }

      setAllBookings(allReservations || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const formatServiceDetails = (serviceName: string, details: ServiceDetails) => {
    switch (serviceName) {
      case "Promenade de chiens":
        return `🐕 ${details.dogName || 'Non spécifié'} - ${details.dogBreed || 'Race non spécifiée'} (${details.walkDuration || '30min'})`;
      case "Garde d'animaux":
        return `🏠 Garde: ${details.dogName || 'Non spécifié'} - ${details.dogBreed || 'Race non spécifiée'}`;
      case "Cours d'espagnol":
        return `📚 Niveau: ${details.spanishLevel || 'Débutant'}`;
      case "Ménage":
        return `🧹 Type: ${details.cleaningType || 'Ménage général'} - Surface: ${details.houseSize || 'Non spécifiée'}`;
      case "Bricolage":
        return `🔧 Service: ${details.handymanService || 'Travaux divers'}`;
      case "Jardinage":
        return `🌱 Surface: ${details.gardenSize || 'Non spécifiée'}`;
      case "Cours d'informatique":
        return `💻 Problème: ${details.computerIssue || 'Support général'}`;
      default:
        return "Service personnalisé";
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] to-[#E8F5E9] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#085041] mb-2">Voisin Proche</h1>
            <p className="text-[#1D9E75]">Espace Administrateur</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="voisinprochecontact@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                placeholder="voisinprochecontact@gmail.com"
              />
            </div>
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
    <div className="min-h-screen bg-[#FFFBF5]">
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
    {/* Stats Cards - Fila 1 */}
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

        {/* Section 1 - Réservations du jour */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#085041] mb-4">Réservations du jour</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date / Heure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {todayBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Aucune réservation aujourd'hui
                      </td>
                    </tr>
                  ) : (
                    todayBookings.map((booking) => {
                      const details = typeof booking.details === 'string' ? JSON.parse(booking.details) : booking.details;
                      return (
                        <tr 
                          key={booking.id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => openDetailsModal(booking)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>
                              <div className="font-medium text-gray-900">{booking.date}</div>
                              <div className="text-gray-600">{booking.heure}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <span className="mr-2">{getServiceIcon(booking.service)}</span>
                              <span className="text-gray-900">{booking.service}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {details?.fullName || 'Non spécifié'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {details?.email || 'Non spécifié'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.statut === 'en_attente' ? 'En attente' : booking.statut === 'confirme' ? 'Confirmé' : booking.statut === 'annule' ? 'Annulé' : 'Terminé')}`}>
                              {booking.statut === 'en_attente' ? 'En attente' : booking.statut === 'confirme' ? 'Confirmé' : booking.statut === 'annule' ? 'Annulé' : 'Terminé'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDetailsModal(booking);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Voir détails
                              </button>
                              {booking.statut === 'en_attente' && (
                                <>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirmer(booking.id);
                                    }}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                  >
                                    Confirmer
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAnnuler(booking.id);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                  >
                                    Annuler
                                  </button>
                                </>
                              )}
                              {booking.statut === 'confirme' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTerminer(booking.id, booking.user_id, booking.service);
                                  }}
                                  className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  Terminer
                                </button>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWhatsApp(booking);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                                style={{ backgroundColor: '#25D366' }}
                              >
                                <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.855L.057 23.273a.75.75 0 00.92.92l5.418-1.466A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.188-1.433l-.372-.22-3.862 1.046 1.046-3.862-.22-.372A9.944 9.44 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 2 - Toutes les réservations */}
        <section>
          <h2 className="text-xl font-bold text-[#085041] mb-4">Toutes les réservations ({allBookings.length} au total)</h2>
          
          {/* Filtres par état */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({allBookings.length})
            </button>
            <button
              onClick={() => setStatusFilter('en_attente')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'en_attente' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              En attente ({allBookings.filter(b => b.statut === 'en_attente').length})
            </button>
            <button
              onClick={() => setStatusFilter('confirme')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'confirme' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Confirmé ({allBookings.filter(b => b.statut === 'confirme').length})
            </button>
            <button
              onClick={() => setStatusFilter('termine')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'termine' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Terminé ({allBookings.filter(b => b.statut === 'termine').length})
            </button>
            <button
              onClick={() => setStatusFilter('annule')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'annule' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Annulé ({allBookings.filter(b => b.statut === 'annule').length})
            </button>
          </div>
          
          {/* Barre d'actions massives */}
          {selectedReservations.length > 0 && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <span className="font-medium text-green-800">
                  {selectedReservations.length} réservation(s) sélectionnée(s)
                </span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleMassConfirm}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    ✅ Confirmer tout
                  </button>
                  <button
                    onClick={handleMassCancel}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    ❌ Annuler tout
                  </button>
                  <button
                    onClick={handleMassDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    🗑️ Supprimer tout
                  </button>
                  <button
                    onClick={() => setSelectedReservations([])}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    Désélectionner
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedReservations.length > 0 && selectedReservations.length === allBookings.filter(booking => {
                          if (statusFilter === 'all') return true;
                          return booking.statut === statusFilter;
                        }).length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date demande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        Aucune réservation pour le moment
                      </td>
                    </tr>
                  ) : (
                    allBookings
                      .filter(booking => {
                        if (statusFilter === 'all') return true;
                        return booking.statut === statusFilter;
                      })
                      .map((booking) => {
                        const details = typeof booking.details === 'string' ? JSON.parse(booking.details) : booking.details;
                        return (
                          <tr 
                            key={booking.id} 
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => openDetailsModal(booking)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <input
                                type="checkbox"
                                checked={selectedReservations.includes(booking.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleSelectReservation(booking.id, e.target.checked);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="text-gray-900">
                                {booking.created_at ? (() => {
                                  const d = new Date(booking.created_at);
                                  d.setHours(d.getHours() + 2);
                                  return d.toLocaleDateString('fr-FR', { 
                                    day: 'numeric', 
                                    month: 'short'
                                  }) + ' à ' + d.toLocaleTimeString('fr-FR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  });
                                })() : 'Non spécifiée'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="text-gray-900">
                                {booking.date ? (() => {
                                  const d = new Date(booking.date + 'T00:00:00');
                                  return d.toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  });
                                })() : 'Non spécifiée'}
                              </div>
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <span className="mr-2">{getServiceIcon(booking.service)}</span>
                              <span className="text-gray-900">{booking.service}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {details?.fullName || 'Non spécifié'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {details?.email || 'Non spécifié'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.statut === 'en_attente' ? 'En attente' : booking.statut === 'confirme' ? 'Confirmé' : booking.statut === 'annule' ? 'Annulé' : 'Terminé')}`}>
                              {booking.statut === 'en_attente' ? 'En attente' : booking.statut === 'confirme' ? 'Confirmé' : booking.statut === 'annule' ? 'Annulé' : 'Terminé'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDetailsModal(booking);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Voir détails
                              </button>
                              {booking.statut === 'en_attente' && (
                                <>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirmer(booking.id);
                                    }}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                  >
                                    Confirmer
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAnnuler(booking.id);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                  >
                                    Annuler
                                  </button>
                                </>
                              )}
                              {booking.statut === 'confirme' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTerminer(booking.id, booking.user_id, booking.service);
                                  }}
                                  className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  Terminer
                                </button>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWhatsApp(booking);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                                style={{ backgroundColor: '#25D366' }}
                              >
                                <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.855L.057 23.273a.75.75 0 00.92.92l5.418-1.466A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.188-1.433l-.372-.22-3.862 1.046 1.046-3.862-.22-.372A9.944 9.44 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Détails */}
      {showDetailsModal && selectedReservation && (
        <>
          {/* Fondo oscuro semitransparente */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeDetailsModal}
          ></div>
          
          {/* Panel deslizante desde la derecha */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              {/* Header del modal */}
              <div className="bg-[#085041] text-white p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="mr-2">{getServiceIcon(selectedReservation.service)}</span>
                    {selectedReservation.service}
                  </h3>
                  <p className="text-sm opacity-90 mt-1">
                    {selectedReservation.date} à {selectedReservation.heure}
                  </p>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="flex-1 overflow-y-auto p-6">
                {(() => {
                  const details = typeof selectedReservation.details === 'string' ? JSON.parse(selectedReservation.details) : selectedReservation.details;
                  return (
                    <div className="space-y-6">
                      {/* Información básica */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Informations du service</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Date du service:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedReservation.date ? new Date(selectedReservation.date + 'T00:00:00').toLocaleDateString('fr-FR', {
                              timeZone: 'Europe/Paris',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            }) : 'Non renseignée'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Date de demande:</span>
                            <span className="text-sm font-medium text-gray-900">
  {selectedReservation.created_at ? 
    (() => { const d = new Date(selectedReservation.created_at); d.setHours(d.getHours() + 2); return d.toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }); })()
  : 'Non spécifiée'}
</span>
                          </div>
                          {selectedReservation.statut === 'termine' && selectedReservation.updated_at && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Date de fin:</span>
                              <span className="text-sm font-medium text-gray-900">{new Date(selectedReservation.updated_at).toLocaleString('fr-FR', { 
                                timeZone: 'Europe/Paris', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Información del cliente */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Informations du client</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Nom complet:</span>
                            <span className="text-sm font-medium text-gray-900">{details?.fullName || 'Non spécifié'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Email:</span>
                            <span className="text-sm font-medium text-gray-900">{details?.email || 'Non spécifié'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Téléphone:</span>
                            <span className="text-sm font-medium text-gray-900">{details?.phone || 'Non spécifié'}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Adresse:</span>
                            <p className="text-sm font-medium text-gray-900 mt-1">{details?.address || 'Non spécifiée'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Detalles específicos del servicio */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Détails du service</h4>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700">
                            {formatServiceDetails(selectedReservation.service, details)}
                          </div>
                          <div className="flex justify-between mt-3">
                            <span className="text-sm text-gray-600">Prix estimé:</span>
                            <span className="text-sm font-semibold text-gray-900">{selectedReservation.prix}€</span>
                          </div>
                        </div>
                      </div>

                      {/* Notas adicionales */}
                      {selectedReservation.notes && (
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Notes additionnelles</h4>
                          <p className="text-sm text-gray-700">{selectedReservation.notes}</p>
                        </div>
                      )}

                      {/* Botones de acción */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        {selectedReservation.statut === 'en_attente' && (
                          <>
                            <button
                              onClick={() => {
                                handleConfirmer(selectedReservation.id);
                                closeDetailsModal();
                              }}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => {
                                handleAnnuler(selectedReservation.id);
                                closeDetailsModal();
                              }}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Annuler
                            </button>
                          </>
                        )}
                        {selectedReservation.statut === 'confirme' && (
                          <button
                            onClick={() => {
                              handleTerminer(selectedReservation.id, selectedReservation.user_id, selectedReservation.service);
                                closeDetailsModal();
                              }}
                              className="flex-1 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Terminer
                            </button>
                        )}
                        <button
                          onClick={() => handleWhatsApp(selectedReservation)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          style={{ backgroundColor: '#25D366' }}
                        >
                          <div className="flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="white" width="16" height="16" className="mr-2">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.855L.057 23.273a.75.75 0 00.92.92l5.418-1.466A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.188-1.433l-.372-.22-3.862 1.046 1.046-3.862-.22-.372A9.944 9.44 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                            WhatsApp
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


