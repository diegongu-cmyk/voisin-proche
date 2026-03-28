"use client"
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  'https://bcfxjnqtxakdcsnqhbis.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZnhqbnF0eGFrZGNzbnFoYmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMTQ4NTYsImV4cCI6MjA4OTY5MDg1Nn0.eH5lemH7U1mp5y8AHw7rSv3H8spy_Ami_M1knpguXbk'
)

export default function MonCompte() {
  const [user, setUser] = useState<any>(null)
  const [fideliteData, setFideliteData] = useState<any[]>([])
  const [historique, setHistorique] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceFilter, setServiceFilter] = useState('tous')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = '/login'
        return
      }
      const user = session.user
      setUser(user)
      Promise.all([
        supabase.from('fidelite').select('*').eq('user_id', user.id),
        supabase.from('reservations').select('*').eq('user_id', user.id).eq('statut', 'termine').order('date', { ascending: false }),
        supabase.from('reservations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3)
      ]).then(([fidelite, hist, res]) => {
        setFideliteData(fidelite.data || [])
        setHistorique(hist.data || [])
        setReservations(res.data || [])
        setLoading(false)
      })
    })
  }, [])

  const serviciosBase = [
    { name: 'Promenade de chiens', emoji: '🐕' },
    { name: 'Garde d\'animaux', emoji: '🏠' },
    { name: 'Accompagnement de personnes', emoji: '🤝' },
    { name: 'Courses et commissions', emoji: '🛒' },
    { name: 'Ménage maison/bureau', emoji: '🧹' },
    { name: 'Cours d\'espagnol', emoji: '📚' },
  ]

  const serviciosConProgreso = useMemo(() => serviciosBase.map(s => {
    const found = fideliteData.find(f => f.service === s.name)
    return { ...s, count: found?.count || 0 }
  }), [fideliteData])

  const filteredHistorique = useMemo(() => {
    if (serviceFilter === 'tous') return historique
    return historique.filter(r => r.service === serviceFilter)
  }, [historique, serviceFilter])

  const getStatusBadge = (statut: string) => {
    const statusConfig = {
      'en_attente': 'bg-yellow-100 text-yellow-700',
      'confirme': 'bg-blue-100 text-blue-700',
      'termine': 'bg-green-100 text-green-700',
      'annule': 'bg-red-100 text-red-700'
    }
    return statusConfig[statut as keyof typeof statusConfig] || 'bg-gray-100 text-gray-700'
  }

  const getStatusText = (statut: string) => {
    const statusText = {
      'en_attente': 'En attente',
      'confirme': 'Confirmé',
      'termine': 'Terminé',
      'annule': 'Annulé'
    }
    return statusText[statut as keyof typeof statusText] || statut
  }

  if (loading) return <div className="p-8 text-center text-[#085041]">Chargement...</div>

  return (
    <div className="space-y-6 py-6">
      <div className="rounded-2xl bg-[#085041] p-6 text-white">
        <h1 className="text-2xl font-bold">Mon compte</h1>
        <p className="opacity-80">{user?.email}</p>
        <Link href="/profil" className="mt-3 inline-block rounded-lg border border-white px-4 py-2 text-sm font-medium hover:bg-white hover:text-[#085041] transition-colors">
          ✏️ Modifier mon profil
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-[#FFFBF5] p-6">
        <h2 className="mb-4 text-xl font-bold text-[#085041]">⭐ Ma carte de fidélité</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {serviciosConProgreso.map((service) => {
            const cycleCount = service.count % 7
            const isComplete = service.count > 0 && service.count % 7 === 0
            const circlesGreen = isComplete ? 7 : cycleCount
            return (
              <div key={service.name} className={`rounded-xl border p-4 ${isComplete ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100' : 'border-slate-200 bg-white'}`}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl">{service.emoji}</span>
                  <span className="font-semibold text-[#085041]">{service.name}</span>
                </div>
                {isComplete && <div className="mb-2 text-2xl text-center">🏆</div>}
                <div className="flex gap-1 justify-center mb-2">
                  {[0,1,2,3,4,5,6].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < circlesGreen ? (isComplete ? 'bg-yellow-400 text-white' : 'bg-[#1D9E75] text-white') : 'bg-slate-100 text-slate-400'}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-slate-500">
                  {isComplete ? '🎁 -20% sur votre prochain service !' : `${cycleCount}/7 · Plus que ${7 - cycleCount} pour votre réduction`}
                </p>
                {service.count > 0 && <p className="text-center text-xs text-slate-400 mt-1">Total: {service.count} services</p>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historique de mes services */}
        <div className="shadow-md rounded-2xl bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#085041]">📋 Historique de mes services</h2>
            <select 
              value={serviceFilter} 
              onChange={(e) => setServiceFilter(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            >
              <option value="tous">Tous les services</option>
              {serviciosBase.map(service => (
                <option key={service.name} value={service.name}>{service.name}</option>
              ))}
            </select>
          </div>
          
          {filteredHistorique.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">Aucun service pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 font-semibold text-[#085041]">Service</th>
                    <th className="text-left py-2 font-semibold text-[#085041]">Date</th>
                    <th className="text-left py-2 font-semibold text-[#085041]">État</th>
                    <th className="text-right py-2 font-semibold text-[#085041]">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistorique.slice(0, 5).map((r) => (
                    <tr key={r.id} className="border-b border-slate-100">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span>{serviciosBase.find(s => s.name === r.service)?.emoji}</span>
                          <span className="font-medium text-slate-900">{r.service}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600">{new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(r.statut)}`}>
                          {getStatusText(r.statut)}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-[#1D9E75]">{r.prix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredHistorique.length > 5 && (
                <p className="text-center text-xs text-slate-500 mt-3">
                  Affichage des 5 premiers services sur {filteredHistorique.length} au total
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mes réservations récentes */}
        <div className="shadow-md rounded-2xl bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#085041]">📅 Mes réservations récentes</h2>
            {reservations.length > 3 && (
              <Link href="/reservations" className="text-sm font-medium text-[#1D9E75] hover:underline">
                Voir tout
              </Link>
            )}
          </div>
          
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">Aucune réservation pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.slice(0, 3).map((r) => (
                <div key={r.id} className="border-l-4 border-green-500 rounded-r-lg bg-slate-50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{serviciosBase.find(s => s.name === r.service)?.emoji}</span>
                        <span className="font-semibold text-[#085041]">{r.service}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        <p>{r.date} à {r.heure}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(r.statut)}`}>
                        {getStatusText(r.statut)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link href="/reserver" className="inline-flex items-center rounded-lg bg-[#1D9E75] px-4 py-2 text-sm font-medium text-white hover:bg-[#085041] transition-colors">
              + Nouvelle réservation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}