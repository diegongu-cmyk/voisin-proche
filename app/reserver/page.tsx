"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ServiceId =
  | "promenade"
  | "garde"
  | "accompagnement"
  | "courses"
  | "menage"
  | "espagnol"
  | "autre";

const slots = Array.from({ length: 11 }, (_, i) => `${8 + i}h00`);

const services: Array<{ id: ServiceId; icon: string; name: string; price: string }> = [
  { id: "promenade", icon: "🐕", name: "Promenade de chiens", price: "depuis 8€" },
  { id: "garde", icon: "🐾", name: "Garde d'animaux", price: "depuis 15€/jour" },
  { id: "accompagnement", icon: "🤝", name: "Accompagnement de personnes", price: "12€/h" },
  { id: "courses", icon: "🛒", name: "Courses et commissions", price: "8€" },
  { id: "menage", icon: "🧹", name: "Ménage maison/bureau", price: "depuis 25€" },
  { id: "espagnol", icon: "🇪🇸", name: "Cours d'espagnol", price: "depuis 15€/h" },
  { id: "autre", icon: "✨", name: "Autre service", price: "nous contacter" },
];

function BookingPageContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceId | null>(null);

  // Read URL parameter on component mount
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && Object.values(services).some(s => s.id === serviceParam as ServiceId)) {
      setService(serviceParam as ServiceId);
      setStep(2); // Skip to step 2
    }
  }, [searchParams]);

  const [user, setUser] = useState<any>(null);
  const [hasDiscount, setHasDiscount] = useState(false);

  // Check authentication and get user fidelity data
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
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

  const [date, setDate] = useState("");
  const [time, setTime] = useState("8h00");
  const [notes, setNotes] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [postalCode, setPostalCode] = useState("85200");

  const [dogName, setDogName] = useState("");
  const [walkDuration, setWalkDuration] = useState("30min");

  // Dog-specific fields
  const [dogBreed, setDogBreed] = useState("");
  const [dogSize, setDogSize] = useState("Petit - moins de 10kg");
  const [dogTemperament, setDogTemperament] = useState("Calme");
  const [dogSocialization, setDogSocialization] = useState("Oui");
  const [dogNotes, setDogNotes] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [animalType, setAnimalType] = useState("Chien");

  const [estimatedDuration, setEstimatedDuration] = useState("1h");
  const [meetingPlace, setMeetingPlace] = useState("");

  // Accompaniment type fields
  const [accompagnementTypes, setAccompagnementTypes] = useState<string[]>([]);
  const [accompagnementAutre, setAccompagnementAutre] = useState("");

  const [housingType, setHousingType] = useState("Studio");

  const [spanishLevel, setSpanishLevel] = useState("Débutant");
  const [spanishMode, setSpanishMode] = useState("Présentiel");

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [shoppingList, setShoppingList] = useState("");

  const estimate = useMemo(() => {
    if (!service) return "À confirmer";
    if (service === "promenade") {
      if (walkDuration === "45min") return "11€";
      if (walkDuration === "1h") return "14€";
      if (walkDuration === "2h") return "25€";
      if (walkDuration === "3h") return "35€";
      return "8€";
    }
    if (service === "garde") return "à partir de 15€/jour";
    if (service === "accompagnement") return "12€/h";
    if (service === "courses") return "8€";
    if (service === "menage") {
      if (housingType === "2 pièces") return "35€";
      if (housingType === "3+ pièces") return "45€";
      if (housingType === "Bureau") return "45€";
      return "25€";
    }
    if (service === "espagnol") return spanishLevel === "Enfant" ? "15€/h" : "18€/h";
    return "Nous contacter";
  }, [service, walkDuration, housingType, spanishLevel]);

  const currentService = services.find((s) => s.id === service);

  const calculateDiscountedPrice = (price: string) => {
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));
    return Math.round(numericPrice * 0.8);
  };

  const handleConfirmReservation = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert("Veuillez vous connecter pour réserver");
        return;
      }

      const precioNumerico = parseInt(estimate.replace(/[^0-9]/g, ''));
      const precioFinal = hasDiscount ? calculateDiscountedPrice(estimate) : precioNumerico;
      
      const reservationData = {
        user_id: user.id,
        service: currentService?.name || "",
        date: date || "",
        time: time || "",
        details: JSON.stringify({
          fullName,
          phone,
          email,
          fullAddress: fullAddress ? `${fullAddress}, ${postalCode}` : "",
          // Service-specific details
          ...(service === "promenade" && {
            dogName,
            dogBreed,
            dogSize,
            dogTemperament,
            dogSocialization,
            dogNotes,
            walkDuration
          }),
          ...(service === "garde" && {
            animalType,
            startDate,
            endDate
          }),
          ...(service === "accompagnement" && {
            accompagnementTypes,
            accompagnementAutre,
            estimatedDuration,
            meetingPlace
          }),
          ...(service === "menage" && {
            housingType
          }),
          ...(service === "espagnol" && {
            spanishLevel,
            spanishMode
          }),
          ...(service === "courses" && {
            deliveryAddress,
            shoppingList
          }),
          ...(service === "autre" && {
            notes
          })
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
      }
    };
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Heure (8h-18h)</label>
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

            <div className="mt-1 border-t-2 border-[#1D9E75]/30 pt-4 md:col-span-2">
              <h3 className="text-base font-bold text-[#085041]">Vos coordonnées</h3>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Prénom et nom</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Numéro de téléphone
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Adresse email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Code postal</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Adresse complète à Fontenay-le-Comte
              </label>
              <input
                type="text"
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>

            {service === "promenade" ? (
              <>
                <div className="md:col-span-2 mt-4 rounded-2xl border border-[#1D9E75]/30 bg-[#E1F5EE] p-5">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[#085041]">
                    <span className="text-2xl">🐕</span>
                    Informations sur votre chien
                  </h3>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Nom du chien <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Race <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Labrador, Golden Retriever..."
                    value={dogBreed}
                    onChange={(e) => setDogBreed(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Taille <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dogSize}
                    onChange={(e) => setDogSize(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  >
                    <option>Petit - moins de 10kg</option>
                    <option>Moyen - 10 à 25kg</option>
                    <option>Grand - plus de 25kg</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Tempérament <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dogTemperament}
                    onChange={(e) => setDogTemperament(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  >
                    <option>Calme</option>
                    <option>Joueur</option>
                    <option>Énergique</option>
                    <option>Craintif</option>
                    <option>Agressif avec autres chiens</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Entente avec autres chiens <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {["Oui", "Non", "Selon le chien"].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="dogSocialization"
                          value={option}
                          checked={dogSocialization === option}
                          onChange={(e) => setDogSocialization(e.target.value)}
                          className="text-[#1D9E75] focus:ring-[#1D9E75]"
                        />
                        <span className="text-sm text-slate-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Notes sur le chien
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Allergies, médicaments, habitudes particulières..."
                    value={dogNotes}
                    onChange={(e) => setDogNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Durée</label>
                  <div className="flex gap-2">
                    <select
                      value={walkDuration}
                      onChange={(e) => setWalkDuration(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                    >
                      <option>30min</option>
                      <option>45min</option>
                      <option>1h</option>
                      <option>2h</option>
                      <option>3h</option>
                    </select>
                    {service === "promenade" && (
                      <div className="flex items-center px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 min-w-[80px]">
                        <span className="font-semibold text-[#1D9E75]">{estimate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : null}

            {service === "garde" ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Type d'animal
                  </label>
                  <select
                    value={animalType}
                    onChange={(e) => setAnimalType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  >
                    <option>Chien</option>
                    <option>Chat</option>
                    <option>Autre</option>
                  </select>
                </div>
              </>
            ) : null}

            {service === "accompagnement" ? (
              <>
                <div className="md:col-span-2 mt-4 rounded-2xl border border-[#F59E0B] bg-[#FAEEDA] p-5">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[#085041]">
                    <span className="text-2xl">🤝</span>
                    Quel type d'accompagnement ?
                  </h3>
                </div>
                
                <div className="md:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { id: "promenade", label: "Promenade / Marche", icon: "🚶" },
                      { id: "compagnie", label: "Compagnie à domicile", icon: "🏠" },
                      { id: "marche", label: "Accompagnement au marché", icon: "🛒" },
                      { id: "medical", label: "Rendez-vous médical", icon: "🏥" },
                      { id: "administratif", label: "Rendez-vous administratif", icon: "📋" },
                      { id: "culturel", label: "Sortie culturelle / loisirs", icon: "🎭" },
                      { id: "transport", label: "Transport et déplacements", icon: "🚗" },
                      { id: "autre", label: "Autre", icon: "✨" },
                    ].map((option) => (
                      <label key={option.id} className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-200 p-3 hover:bg-white/50 transition-colors">
                        <input
                          type="checkbox"
                          value={option.id}
                          checked={accompagnementTypes.includes(option.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAccompagnementTypes([...accompagnementTypes, option.id]);
                            } else {
                              setAccompagnementTypes(accompagnementTypes.filter(id => id !== option.id));
                            }
                          }}
                          className="text-[#F59E0B] focus:ring-[#F59E0B]"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{option.icon}</span>
                          <span className="text-sm font-medium text-slate-700">{option.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {accompagnementTypes.includes("autre") && (
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Précisez le type d'accompagnement
                    </label>
                    <input
                      type="text"
                      value={accompagnementAutre}
                      onChange={(e) => setAccompagnementAutre(e.target.value)}
                      placeholder="Décrivez votre besoin..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>
                )}
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Durée estimée
                  </label>
                  <select
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  >
                    <option>1h</option>
                    <option>2h</option>
                    <option>3h+</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Lieu de rendez-vous
                  </label>
                  <input
                    type="text"
                    value={meetingPlace}
                    onChange={(e) => setMeetingPlace(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>
              </>
            ) : null}

            {service === "menage" ? (
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Type de logement
                </label>
                <select
                  value={housingType}
                  onChange={(e) => setHousingType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                >
                  <option>Studio</option>
                  <option>2 pièces</option>
                  <option>3+ pièces</option>
                  <option>Bureau</option>
                </select>
              </div>
            ) : null}

            {service === "espagnol" ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Niveau</label>
                  <select
                    value={spanishLevel}
                    onChange={(e) => setSpanishLevel(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  >
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                    <option>Enfant</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Modalité</label>
                  <select
                    value={spanishMode}
                    onChange={(e) => setSpanishMode(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  >
                    <option>Présentiel</option>
                    <option>En ligne</option>
                  </select>
                </div>
              </>
            ) : null}

            {service === "courses" ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Adresse de livraison
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Description des besoins
                  </label>
                  <input
                    type="text"
                    value={shoppingList}
                    onChange={(e) => setShoppingList(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>
              </>
            ) : null}

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
                  <span className="font-semibold">Nom complet:</span> {fullName || "Non renseigné"}
                </p>
                <p>
                  <span className="font-semibold">Téléphone:</span> {phone || "Non renseigné"}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {email || "Non renseigné"}
                </p>
                <p>
                  <span className="font-semibold">Adresse:</span>{" "}
                  {fullAddress ? `${fullAddress}, ${postalCode}` : "Non renseignée"}
                </p>
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
                <p>
                  <span className="font-semibold">Date et heure:</span>{" "}
                  {date || "Non renseignée"} à {time}
                </p>
                {service === "promenade" ? (
                  <p>
                    <span className="font-semibold">Durée / détails:</span> {walkDuration}
                  </p>
                ) : null}
                {service === "promenade" && (
                  <div className="mt-3 space-y-2">
                    <p className="font-semibold text-[#085041]">Informations sur le chien:</p>
                    <div className="ml-4 space-y-1 text-sm">
                      <p><span className="font-medium">Nom:</span> {dogName || "Non renseigné"}</p>
                      <p><span className="font-medium">Race:</span> {dogBreed || "Non renseignée"}</p>
                      <p><span className="font-medium">Taille:</span> {dogSize}</p>
                      <p><span className="font-medium">Tempérament:</span> {dogTemperament}</p>
                      <p><span className="font-medium">Entente avec autres chiens:</span> {dogSocialization}</p>
                      {dogNotes && <p><span className="font-medium">Notes:</span> {dogNotes}</p>}
                    </div>
                  </div>
                )}
                {service === "garde" ? (
                  <p>
                    <span className="font-semibold">Durée / détails:</span> du{" "}
                    {startDate || "Non renseignée"} au {endDate || "Non renseignée"},{" "}
                    animal: {animalType}
                  </p>
                ) : null}
                {service === "accompagnement" ? (
                  <div className="mt-3 space-y-2">
                    <p className="font-semibold text-[#085041]">Type d'accompagnement:</p>
                    <div className="ml-4">
                      {accompagnementTypes.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {accompagnementTypes.map((type) => {
                            const option = [
                              { id: "promenade", label: "Promenade / Marche", icon: "🚶" },
                              { id: "compagnie", label: "Compagnie à domicile", icon: "🏠" },
                              { id: "marche", label: "Accompagnement au marché", icon: "🛒" },
                              { id: "medical", label: "Rendez-vous médical", icon: "🏥" },
                              { id: "administratif", label: "Rendez-vous administratif", icon: "📋" },
                              { id: "culturel", label: "Sortie culturelle / loisirs", icon: "🎭" },
                              { id: "transport", label: "Transport et déplacements", icon: "🚗" },
                              { id: "autre", label: "Autre", icon: "✨" },
                            ].find(opt => opt.id === type);
                            return option ? (
                              <span key={type} className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B]/10 px-3 py-1 text-sm">
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                              </span>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">Non spécifié</p>
                      )}
                      {accompagnementTypes.includes("autre") && accompagnementAutre && (
                        <p className="mt-2 text-sm"><span className="font-medium">Précision:</span> {accompagnementAutre}</p>
                      )}
                    </div>
                  </div>
                ) : null}
                {service === "accompagnement" ? (
                  <p>
                    <span className="font-semibold">Durée / détails:</span> {estimatedDuration},
                    rendez-vous: {meetingPlace || "Non renseigné"}
                  </p>
                ) : null}
                {service === "menage" ? (
                  <p>
                    <span className="font-semibold">Durée / détails:</span> type de logement:{" "}
                    {housingType}
                  </p>
                ) : null}
                {service === "espagnol" ? (
                  <p>
                    <span className="font-semibold">Durée / détails:</span> niveau {spanishLevel},{" "}
                    modalité {spanishMode}
                  </p>
                ) : null}
                {service === "courses" ? (
                  <p>
                    <span className="font-semibold">Durée / détails:</span> livraison à{" "}
                    {deliveryAddress || "Non renseignée"}, besoins:{" "}
                    {shoppingList || "Non renseignés"}
                  </p>
                ) : null}
                {service === "autre" ? (
                  <p>
                    <span className="font-semibold">Durée / détails:</span> service personnalisé,
                    nous vous recontactons pour préciser la demande.
                  </p>
                ) : null}
                {notes ? (
                  <p>
                    <span className="font-semibold">Notes libres:</span> {notes}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-[#1D9E75]/10 p-4">
            <h3 className="text-base font-extrabold text-slate-900">Prix estimé</h3>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-extrabold text-[#1D9E75]">
                {hasDiscount ? (
                  <>
                    <span className="line-through text-gray-400">{estimate}</span>
                    <span className="ml-2 text-xl font-bold text-[#F59E0B]">{calculateDiscountedPrice(estimate)}</span>
                  </>
                ) : (
                  <span>{estimate}</span>
                )}
            
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
              className="rounded-lg bg-[#1D9E75] px-5 py-2 font-semibold text-white hover:bg-[#1a8a63] transition-colors"
            >
              Confirmer la réservation
            </button>
          </div>
        </div>
      )}
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
