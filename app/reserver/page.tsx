"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const slots = Array.from({ length: 11 }, (_, i) => `${8 + i}h00`);

const services = [
  { id: "promenade", icon: "🐕", name: "Promenade de chiens", price: "depuis 8€", description: "Nous promenons votre chien en toute sécurité dans les environs de Fontenay-le-Comte. Chaque promenade est accompagnée de jeux, caresses et un peu d'exercice pour le bonheur de votre compagnon. Des photos seront envoyées sur votre WhatsApp pendant la promenade. Disponible en 30 min, 45 min ou 1 heure. Depuis 8€." },
  { id: "garde", icon: "🐾", name: "Garde d'animaux", price: "depuis 15€/jour", description: "Nous gardons votre animal à votre domicile pendant votre absence. Votre compagnon ne remarquera même pas votre absence ! Nous aimons les animaux et savons à quel point ils sont importants dans nos familles. Le service comprend des visites régulières à votre domicile et l'envoi de photos quotidiennes sur votre WhatsApp pour vous rassurer. Depuis 15€/jour." },
  { id: "accompagnement", icon: "🤝", name: "Accompagnement de personnes", price: "depuis 12€/h", description: "Nous accompagnons vos proches pour leurs rendez-vous médicaux, courses ou sorties. Nous pouvons également être simplement une présence chaleureuse et bienveillante, en conversant sur des sujets agréables, des cultures différentes et la vie en général. Notre langue natale est l'espagnol, ce qui enrichit nos échanges, et si nécessaire nous utilisons des traducteurs en ligne pour faciliter la communication. Si la personne ne connaît pas ce type de technologies, nous serons ravis de lui apprendre à les utiliser. Disponible 7j/7. Depuis 12€/heure." },
  { id: "courses", icon: "🛒", name: "Courses et commissions", price: "8€", description: "Nous effectuons vos courses et commissions dans le lieu de votre choix, de la manière la plus rapide possible. Vous payez uniquement le service de courses et de récupération (8€), le montant des articles à acheter est à la charge du client. Rapide, fiable et sans complications." },
  { id: "menage", icon: "🧹", name: "Ménage maison/bureau", price: "depuis 25€", description: "Nous effectuons un nettoyage détaillé et professionnel de votre domicile ou bureau. Nous apportons les meilleurs produits pour garantir un résultat impeccable. Nous respectons et préservons la vie privée de nos clients à tout moment. Depuis 25€." },
  { id: "espagnol", icon: "🇪🇸", name: "Cours d'espagnol", price: "depuis 15€/h", description: "Nous proposons des cours particuliers d'espagnol pour tous les niveaux, des débutants aux avancés, aussi bien pour les enfants que pour les adultes. Notre langue natale est l'espagnol, ce qui garantit un enseignement authentique, naturel et chaleureux. Les cours s'adaptent entièrement au rythme et aux besoins de chaque élève. Disponibles à domicile ou en ligne selon votre préférence. Vous apprendrez non seulement la langue mais aussi la culture, les expressions du quotidien et la richesse du monde hispanophone. Depuis 15€/heure." },
  { id: "autre", icon: "✨", name: "Autres services", price: "nous contacter", description: "Vous avez un besoin spécifique ? Contactez-nous et nous ferons notre possible pour vous aider." },
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

  // Promenade specific states
  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [dogTemperament, setDogTemperament] = useState("");
  const [dogSocialization, setDogSocialization] = useState("");
  const [departureAddress, setDepartureAddress] = useState("");
  const [walkDuration, setWalkDuration] = useState("");
  const [isVaccinated, setIsVaccinated] = useState("");
  const [isSterilized, setIsSterilized] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);

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
          const userCount = fideliteData[0].count;
          const hasDiscountEligibility = userCount > 0 && userCount % 7 === 0;
          setHasDiscount(hasDiscountEligibility);
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

  const calculatePromenadePrice = (duration: string) => {
    if (duration === "30 minutes") return 8;
    if (duration === "45 minutes") return 10;
    if (duration === "1 heure") return 12;
    return 8; // Default price
  };

  const validatePromenadeForm = () => {
    const errors: string[] = [];
    
    if (!dogName.trim()) errors.push("Le nom du chien est obligatoire");
    if (!dogBreed.trim()) errors.push("La race du chien est obligatoire");
    if (!dogSize) errors.push("La taille du chien est obligatoire");
    if (!dogTemperament) errors.push("Le tempérament du chien est obligatoire");
    if (!dogSocialization) errors.push("L'entente avec autres chiens est obligatoire");
    if (!walkDuration) errors.push("La durée de la promenade est obligatoire");
    
    return errors;
  };

  const validateCommonForm = () => {
    const errors: string[] = [];
    
    if (!fullName.trim()) errors.push("Le prénom et nom sont obligatoires");
    if (!phone.trim()) errors.push("Le téléphone est obligatoire");
    if (!email.trim()) errors.push("L'email est obligatoire");
    if (!date.trim()) errors.push("La date est obligatoire");
    if (!time.trim()) errors.push("L'heure est obligatoire");
    if (!fullAddress.trim()) errors.push("L'adresse est obligatoire");
    
    return errors;
  };

  const handleConfirmReservation = async () => {
    try {
      setIsLoading(true);
      
      // Validate common form fields
      const commonErrors = validateCommonForm();
      if (commonErrors.length > 0) {
        setFormErrors(commonErrors);
        alert("Veuillez compléter tous les champs obligatoires:\n" + commonErrors.join("\n"));
        return;
      }
      
      // Validate promenade specific fields
      if (service === "promenade") {
        const promenadeErrors = validatePromenadeForm();
        if (promenadeErrors.length > 0) {
          setFormErrors(promenadeErrors);
          alert("Veuillez compléter tous les champs obligatoires:\n" + promenadeErrors.join("\n"));
          return;
        }
      }
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert("Veuillez vous connecter pour réserver");
        return;
      }

      let precioNumerico = 0;
      if (service === "promenade" && walkDuration) {
        precioNumerico = calculatePromenadePrice(walkDuration);
      } else {
        precioNumerico = parseInt(currentService?.price.replace(/[^0-9]/g, '') || '0');
      }
      const precioFinal = hasDiscount ? calculateDiscountedPrice(precioNumerico.toString()) : precioNumerico;
      
      // Build details object based on service type
      let detailsObject: any = {
        fullName,
        phone,
        email,
        fullAddress: fullAddress || "",
        notes: notes
      };
      
      if (service === "promenade") {
        detailsObject = {
          ...detailsObject,
          dogName,
          dogBreed,
          dogSize,
          dogTemperament,
          dogSocialization,
          walkDuration,
          notes
        };
      }
      
      const reservationData = {
        user_id: user.id,
        service: currentService?.name || "",
        date: date || "",
        heure: time || "",
        details: JSON.stringify(detailsObject),
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
        window.location.href = '/reservation-confirmee';
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

          {/* Service Description Box */}
          {service && currentService && (
            <div className="mt-6 animate-fadeIn">
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-800 mb-2">
                      {currentService.name}
                    </h3>
                    <p className="text-sm text-green-700 leading-relaxed">
                      {currentService.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {step === 2 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-[#085041]">Vos informations</h2>

          {currentService && (
            <div className="mt-3 mb-5 animate-fadeIn rounded-2xl border-2 border-green-300 border-t-4 border-green-500 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 p-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{currentService.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold text-green-800">{currentService.name}</h3>
                  <p className="text-base text-green-700 leading-relaxed mt-2">{currentService.description}</p>
                </div>
              </div>
            </div>
          )}
          {service === "promenade" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nom du chien *</label>
                <input type="text" required value={dogName} onChange={(e) => setDogName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Race *</label>
                <input type="text" required value={dogBreed} onChange={(e) => setDogBreed(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Taille *</label>
                <select required value={dogSize} onChange={(e) => setDogSize(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                  <option value="">Sélectionner</option>
                  <option>Petit - moins de 10kg</option>
                  <option>Moyen - 10 à 25kg</option>
                  <option>Grand - plus de 25kg</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Tempérament *</label>
                <select required value={dogTemperament} onChange={(e) => setDogTemperament(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                  <option value="">Sélectionner</option>
                  <option>Calme</option>
                  <option>Joueur</option>
                  <option>Nerveux</option>
                  <option>Agressif avec autres chiens</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Entente avec autres chiens *</label>
                <select required value={dogSocialization} onChange={(e) => setDogSocialization(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                  <option value="">Sélectionner</option>
                  <option>Oui, très sociable</option>
                  <option>Oui, mais supervisé</option>
                  <option>Non, préfère être seul</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Durée de la promenade *</label>
                <select required value={walkDuration} onChange={(e) => setWalkDuration(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                  <option value="">Sélectionner</option>
                  <option value="30 minutes">30 minutes - 8€</option>
                  <option value="45 minutes">45 minutes - 10€</option>
                  <option value="1 heure">1 heure - 12€</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Prénom et Nom *</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Téléphone WhatsApp *</label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Date souhaitée *</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Heure souhaitée *</label>
              <select required value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="">Choisir une heure</option>
                <option>8h00</option>
                <option>8h30</option>
                <option>9h00</option>
                <option>9h30</option>
                <option>10h00</option>
                <option>10h30</option>
                <option>11h00</option>
                <option>11h30</option>
                <option>12h00</option>
                <option>12h30</option>
                <option>13h00</option>
                <option>13h30</option>
                <option>14h00</option>
                <option>14h30</option>
                <option>15h00</option>
                <option>15h30</option>
                <option>16h00</option>
                <option>16h30</option>
                <option>17h00</option>
                <option>17h30</option>
                <option>18h00</option>
                <option>19h00</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Adresse à Fontenay-le-Comte *</label>
              <input type="text" required value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Notes libres</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700">Retour</button>
            <button type="button" onClick={() => setStep(3)} className="rounded-lg bg-[#1D9E75] px-5 py-2 font-semibold text-white">Continuer</button>
          </div>
        </div>
      )}

      {step === 3 && service ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">PASO 3 - Confirmation</h2>
          <p className="mt-1 text-sm text-slate-600">Vérifiez les informations avant validation.</p>

          <div className="mt-5 space-y-5 text-sm text-slate-700">
            <div className="mt-5 rounded-xl border border-slate-200 bg-[#1D9E75]/10 p-4">
              <h3 className="text-base font-extrabold text-slate-900">Prix estimé</h3>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-extrabold text-[#1D9E75]">
                  {hasDiscount ? (
                    <>
                      <span className="line-through text-gray-400">
                        {service === "promenade" && walkDuration ? 
                          `${calculatePromenadePrice(walkDuration)}€` : 
                          currentService?.price
                        }
                      </span>
                      <span className="ml-2 text-xl font-bold text-[#F59E0B]">
                        {calculateDiscountedPrice(
                          service === "promenade" && walkDuration ? 
                            calculatePromenadePrice(walkDuration).toString() : 
                            currentService?.price || '0'
                        )}
                      </span>
                    </>
                  ) : (
                    <span>
                      {service === "promenade" && walkDuration ? 
                        `${calculatePromenadePrice(walkDuration)}€` : 
                        currentService?.price
                      }
                    </span>
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

            {service === "promenade" && (
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-base font-extrabold text-slate-900">Informations du chien</h3>
                <div className="mt-2 space-y-1">
                  <p>
                    <span className="font-semibold">Nom du chien:</span> {dogName || "Non renseigné"}
                  </p>
                  <p>
                    <span className="font-semibold">Race:</span> {dogBreed || "Non renseignée"}
                  </p>
                  <p>
                    <span className="font-semibold">Taille:</span> {dogSize || "Non renseignée"}
                  </p>
                  <p>
                    <span className="font-semibold">Tempérament:</span> {dogTemperament || "Non renseigné"}
                  </p>
                  <p>
                    <span className="font-semibold">Entente avec autres chiens:</span> {dogSocialization || "Non renseigné"}
                  </p>
                  <p>
                    <span className="font-semibold">Durée de la promenade:</span> {walkDuration || "Non renseignée"}
                  </p>
                  <p>
                    <span className="font-semibold">Vacciné:</span> {isVaccinated || "Non renseigné"}
                  </p>
                  <p>
                    <span className="font-semibold">Stérilisé:</span> {isSterilized || "Non renseigné"}
                  </p>
                </div>
              </div>
            )}

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
