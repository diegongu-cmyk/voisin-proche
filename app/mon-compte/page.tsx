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

      <div className="rounded-2xl border border-slate-200 bg-[#FFFBF5] p-6">
        <h2 className="mb-4 text-xl font-bold text-[#085041]">📋 Historique de mes services</h2>
        {historique.length === 0 ? (
          <p className="text-center text-slate-500">Aucun service terminé pour le moment</p>
        ) : (
          <div className="space-y-3">
            {historique.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#085041]">{r.service}</span>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">Terminé</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Demandé le: {new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-xs text-slate-500">Service effectué le: {r.date} à {r.heure}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-[#FFFBF5] p-6">
        <h2 className="mb-4 text-xl font-bold text-[#085041]">📅 Mes réservations récentes</h2>
        {reservations.length === 0 ? (
          <p className="text-center text-slate-500">Aucune réservation pour le moment</p>
        ) : (
          <div className="space-y-3">
            {reservations.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#085041]">{r.service}</span>
                  <p className="text-xs text-slate-500">{r.date} à {r.heure}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${r.statut === 'confirme' ? 'bg-green-100 text-green-700' : r.statut === 'annule' ? 'bg-red-100 text-red-700' : r.statut === 'termine' ? 'bg-slate-100 text-slate-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {r.statut === 'confirme' ? 'Confirmé' : r.statut === 'annule' ? 'Annulé' : r.statut === 'termine' ? 'Terminé' : 'En attente'}
                </span>
              </div>
            ))}
          </div>
        )}
        <Link href="/reserver" className="mt-4 block text-center rounded-lg border border-[#1D9E75] px-4 py-2 text-sm font-medium text-[#1D9E75] hover:bg-[#1D9E75] hover:text-white transition-colors">
          + Nouvelle réservation
        </Link>
      </div>
    </div>
  )
}