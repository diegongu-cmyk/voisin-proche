"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const slots = Array.from({ length: 11 }, (_, i) => `${8 + i}h00`);

const services = [
  { id: "promenade", icon: "🐕", name: "Promenade de chiens", price: "depuis 8€" },
  { id: "garde", icon: "🐾", name: "Garde d'animaux", price: "depuis 15€/jour" },
  { id: "accompagnement", icon: "🤝", name: "Accompagnement de personnes", price: "depuis 12€/h" },
  { id: "courses", icon: "🛒", name: "Courses et commissions", price: "8€" },
  { id: "menage", icon: "🧹", name: "Ménage maison/bureau", price: "depuis 25€" },
  { id: "espagnol", icon: "🇪🇸", name: "Cours d'espagnol", price: "depuis 15€/h" },
  { id: "autre", icon: "✨", name: "Autres services", price: "nous contacter" },
];

function BookingPageContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [service, setService] = useState(searchParams.get("service") || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("8h00");
  const [notes, setNotes] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user has 7+ services completed for discount
        const { data: fideliteData } = await supabase
          .from('fidelite')
          .select('*')
          .eq('user_id', session.user.id);

        if (fideliteData && fideliteData.length > 0) {
          const hasCompleted7Services = fideliteData.some(item => item.count >= 7);
          setHasDiscount(hasCompleted7Services);
        }
      }
    };

    checkSession();
  }, []);

  const currentService = services.find((s) => s.id === service);

  const calculateDiscountedPrice = (price: string) => {
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));
    return Math.round(numericPrice * 0.8);
  };

  const handleConfirmReservation = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert("Veuillez vous connecter pour réserver");
        return;
      }

      const precioNumerico = parseInt(currentService?.price.replace(/[^0-9]/g, '') || '0');
      const precioFinal = hasDiscount ? calculateDiscountedPrice(currentService?.price || '0') : precioNumerico;
      
      const reservationData = {
        user_id: user.id,
        service: currentService?.name || "",
        date: date || "",
        time: time || "",
        details: JSON.stringify({
          fullName,
          phone,
          email,
          fullAddress: fullAddress || "",
          notes: notes
        }),
        prix: precioFinal.toString(),
        notes: notes,
        statut: "en_attente"
      };

      // Save to Supabase
      const { error } = await supabase
        .from('reservations')
        .insert([reservationData]);

      if (error) {
        console.error('Reservation error:', error);
        alert("Erreur lors de la réservation: " + error.message);
      } else {
        alert("Réservation envoyée ! Nous vous confirmons dans les 2 heures.");
        setTimeout(() => {
          window.location.href = '/mon-compte';
        }, 3000);
      }
    } catch (err) {
      console.error('Exception:', err);
      alert("Une erreur est survenue lors de la réservation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl bg-[#FFFBF5] px-4 py-8 md:px-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Réserver un service</h1>
      <p className="mt-2 text-slate-600">
        Choisissez votre service puis complétez les détails en 3 étapes.
      </p>

      <div className="mt-6 grid gap-2 rounded-2xl bg-white p-3 md:grid-cols-3">
        {["1. Service", "2. Détails", "3. Confirmation"].map((label, idx) => {
          const current = idx + 1;
          const active = step >= current;
          return (
            <div
              key={label}
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                active ? "bg-[#1D9E75] text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>

      {step === 1 ? (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-slate-900">PASO 1 - Choisir un service</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((item) => {
              const selected = service === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setService(item.id);
                    setStep(2);
                  }}
                  className={`rounded-2xl border bg-white p-4 text-left transition ${
                    selected
                      ? "border-[#1D9E75] ring-2 ring-[#1D9E75]/30"
                      : "border-slate-200 hover:border-[#1D9E75]/60"
                  }`}
                >
                  <p className="text-2xl">{item.icon}</p>
                  <p className="mt-2 text-base font-bold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[#1D9E75]">{item.price}</p>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {step === 2 && service ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">PASO 2 - Détails de la réservation</h2>
          <p className="mt-1 text-sm text-slate-600">{currentService?.name}</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Prénom et Nom</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Téléphone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
              <p className="text-xs text-gray-500 mt-1">Ce numéro sera utilisé pour vous contacter sur WhatsApp</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Date souhaitée
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Heure souhaitée</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              >
                {slots.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Adresse à Fontenay-le-Comte
              </label>
              <input
                type="text"
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Notes libres</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-lg bg-[#1D9E75] px-4 py-2 font-semibold text-white"
            >
              Continuer
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 && service ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">PASO 3 - Confirmation</h2>
          <p className="mt-1 text-sm text-slate-600">Vérifiez les informations avant validation.</p>

          <div className="mt-5 space-y-5 text-sm text-slate-700">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">Vos coordonnées</h3>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="font-semibold">Prénom et Nom:</span> {fullName || "Non renseigné"}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {email || "Non renseigné"}
                </p>
                <p>
                  <span className="font-semibold">Téléphone:</span> {phone || "Non renseigné"}
                </p>
                <p>
                  <span className="font-semibold">Adresse:</span> {fullAddress || "Non renseignée"}
                </p>
                <p>
                  <span className="font-semibold">Date et heure:</span>{" "}
                  {date || "Non renseignée"} à {time}
                </p>
                {notes && (
                  <p>
                    <span className="font-semibold">Notes:</span> {notes}
                  </p>
                )}
              </div>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">Votre réservation</h3>
              <div className="mt-2 space-y-1">
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Service choisi:</span>
                  <span className="rounded-full bg-[#1D9E75]/10 px-2 py-0.5 text-[#085041]">
                    {currentService?.icon} {currentService?.name}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-[#1D9E75]/10 p-4">
            <h3 className="text-base font-extrabold text-slate-900">Prix estimé</h3>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-extrabold text-[#1D9E75]">
                {hasDiscount ? (
                  <>
                    <span className="line-through text-gray-400">{currentService?.price}</span>
                    <span className="ml-2 text-xl font-bold text-[#F59E0B]">{calculateDiscountedPrice(currentService?.price || '0')}</span>
                  </>
                ) : (
                  <span>{currentService?.price}</span>
                )}
              </p>
              {hasDiscount && (
                <span className="inline-flex animate-pulse rounded-full bg-[#F59E0B] px-3 py-1 text-sm font-bold text-white">
                  🎁 -20% fidélité appliqué !
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-700">
              Le prix final sera confirmé lors de notre prise de contact
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-[#1D9E75] bg-[#E1F5EE] p-4 text-[#085041]">
            <h3 className="text-base font-extrabold">Nous joindre</h3>
            <p className="mt-2 text-sm">
              Une fois confirmée, nous vous contacterons sous 2h au numéro indiqué.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700"
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={handleConfirmReservation}
              disabled={isLoading}
              className="rounded-lg bg-[#1D9E75] px-5 py-2 font-semibold text-white hover:bg-[#1a8a63] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Confirmation en cours..." : "Confirmer la réservation"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}