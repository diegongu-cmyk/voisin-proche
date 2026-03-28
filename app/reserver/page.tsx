"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const services = [
  { id: "promenade", icon: "🐕", name: "Promenade de chiens", price: "depuis 8€", description: "Nous promenons votre chien en toute sécurité dans les environs de Fontenay-le-Comte. Chaque promenade est accompagnée de jeux, caresses et un peu d'exercice pour le bonheur de votre compagnon. Des photos seront envoyées sur votre WhatsApp pendant la promenade. Disponible en 30 min, 45 min ou 1 heure. Depuis 8€." },
  { id: "garde", icon: "🐾", name: "Garde d'animaux", price: "depuis 15€/jour", description: "Nous gardons votre animal à votre domicile pendant votre absence. Votre compagnon ne remarquera même pas votre absence ! Nous aimons les animaux et savons à quel point ils sont importants dans nos familles. Le service comprend des visites régulières à votre domicile et l'envoi de photos quotidiennes sur votre WhatsApp pour vous rassurer. Depuis 15€/jour." },
  { id: "accompagnement", icon: "🤝", name: "Accompagnement de personnes", price: "depuis 12€/h", description: "Nous accompagnons vos proches pour leurs rendez-vous médicaux, courses ou sorties. Nous pouvons également être simplement une présence chaleureuse et bienveillante, en conversant sur des sujets agréables, des cultures différentes et la vie en général. Notre langue natale est l'espagnol, ce qui enrichit nos échanges, et si nécessaire nous utilisons des traducteurs en ligne pour faciliter la communication. Si la personne ne connaît pas ce type de technologies, nous serons ravis de lui apprendre à les utiliser. Disponible 7j/7. Depuis 12€/heure." },
  { id: "courses", icon: "🛒", name: "Courses et commissions", price: "8€", description: "Nous effectuons vos courses et commissions dans le lieu de votre choix, de la manière la plus rapide possible. Vous payez uniquement le service de courses et de récupération (8€), le montant des articles à acheter est à la charge du client. Rapide, fiable et sans complications." },
  { id: "menage", icon: "🧹", name: "Ménage maison/bureau", price: "depuis 25€", description: "Nous effectuons un nettoyage détaillé et professionnel de votre domicile ou bureau. Nous respectons et préservons la vie privée de nos clients à tout moment. Depuis 25€." },
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

  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [dogTemperament, setDogTemperament] = useState("");
  const [dogSocialization, setDogSocialization] = useState("");
  const [walkDuration, setWalkDuration] = useState("");
  const [isVaccinated, setIsVaccinated] = useState("");
  const [isSterilized, setIsSterilized] = useState("");
  
  // Garde d'animaux specific states
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [guardDays, setGuardDays] = useState("");
  const [animalName, setAnimalName] = useState("");
  const [animalTemperament, setAnimalTemperament] = useState("");
  
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: fideliteData } = await supabase
          .from('fidelite')
          .select('*')
          .eq('user_id', session.user.id);
        if (fideliteData && fideliteData.length > 0) {
          const userCount = fideliteData[0].count;
          setHasDiscount(userCount > 0 && userCount % 7 === 0);
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
    return 8;
  };

  const getPriceInCents = () => {
    if (service === "promenade" && walkDuration) {
      return calculatePromenadePrice(walkDuration) * 100;
    }
    const priceMap: { [key: string]: number } = {
      'garde': 1500 * (parseInt(guardDays) || 1),
      'accompagnement': 1200,
      'courses': 800,
      'menage': 2500,
      'espagnol': 1500,
      'autre': 1000,
    };
    return priceMap[service] || 1000;
  };

  const validateGardeForm = () => {
    const errors: string[] = [];
    if (!animalName.trim()) errors.push("Le nom de l'animal est obligatoire");
    if (!petType) errors.push("Le type d'animal est obligatoire");
    if (petType === "Chien" && !petBreed.trim()) errors.push("La race du chien est obligatoire");
    if (!petAge) errors.push("L'âge de l'animal est obligatoire");
    if (!animalTemperament) errors.push("Le tempérament de l'animal est obligatoire");
    if (!guardDays.trim()) errors.push("Le nombre de jours de garde est obligatoire");
    return errors;
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

      const commonErrors = validateCommonForm();
      if (commonErrors.length > 0) {
        setFormErrors(commonErrors);
        alert("Veuillez compléter tous les champs obligatoires:\n" + commonErrors.join("\n"));
        return;
      }

      if (service === "promenade") {
        const promenadeErrors = validatePromenadeForm();
        if (promenadeErrors.length > 0) {
          setFormErrors(promenadeErrors);
          alert("Veuillez compléter tous les champs obligatoires:\n" + promenadeErrors.join("\n"));
          return;
        }
      }
      
      if (service === "garde") {
        const gardeErrors = validateGardeForm();
        if (gardeErrors.length > 0) {
          setFormErrors(gardeErrors);
          alert("Veuillez compléter tous les champs obligatoires:\n" + gardeErrors.join("\n"));
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      await new Promise(resolve => setTimeout(resolve, 500));
      const { data: { session: session2 } } = await supabase.auth.getSession();
      const user = session2?.user || session?.user;
      if (!user) {
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

      let detailsObject: any = { fullName, phone, email, fullAddress, notes };
      if (service === "promenade") {
        detailsObject = { ...detailsObject, dogName, dogBreed, dogSize, dogTemperament, dogSocialization, walkDuration };
      }
      if (service === "garde") {
        detailsObject = { ...detailsObject, animalName, petType, petBreed, petAge, animalTemperament, guardDays };
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

      const { error } = await supabase.from('reservations').insert([reservationData]);

      if (error) {
        console.error('Reservation error:', error);
        alert("Erreur lors de la réservation: " + error.message);
        return;
      }

      // Send admin notification email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'diegongu@gmail.com',
          subject: `🔔 Nouvelle réservation — ${currentService?.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #1D9E75; border-radius: 12px;">
              <h1 style="color: #1D9E75; text-align: center;">🔔 Nouvelle Réservation</h1>
              <h2 style="color: #085041;">${currentService?.icon} ${currentService?.name}</h2>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h3 style="color: #085041; margin-top: 0;">📋 Détails du service</h3>
                <p><strong>Service:</strong> ${currentService?.name}</p>
                <p><strong>Date souhaitée:</strong> ${date}</p>
                <p><strong>Heure souhaitée:</strong> ${time}</p>
                <p><strong>Prix estimé:</strong> ${precioFinal}€</p>
              </div>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h3 style="color: #085041; margin-top: 0;">👤 Coordonnées du client</h3>
                <p><strong>Nom:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Téléphone / WhatsApp:</strong> ${phone}</p>
                <p><strong>Adresse:</strong> ${fullAddress}</p>
              </div>
              ${service === 'promenade' ? `
              <div style="background: #fef9f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h3 style="color: #085041; margin-top: 0;">🐕 Informations du chien</h3>
                <p><strong>Nom:</strong> ${dogName}</p>
                <p><strong>Race:</strong> ${dogBreed}</p>
                <p><strong>Taille:</strong> ${dogSize}</p>
                <p><strong>Tempérament:</strong> ${dogTemperament}</p>
                <p><strong>Entente avec autres chiens:</strong> ${dogSocialization}</p>
                <p><strong>Durée de la promenade:</strong> ${walkDuration}</p>
              </div>` : ''}
              ${notes ? `<div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h3 style="color: #085041; margin-top: 0;">📝 Notes du client</h3>
                <p>${notes}</p>
              </div>` : ''}
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://voisin-proche.vercel.app/admin" style="background: #1D9E75; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                  Voir dans le panel admin
                </a>
              </div>
            </div>
          `
        })
      });

      // Redirect to Stripe
      if (service !== "autre") {
        const stripeResponse = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: getPriceInCents(),
            serviceName: currentService?.name || 'Service',
            reservationId: ''
          })
        });

        const stripeData = await stripeResponse.json();
        if (stripeData.url) {
          window.location.href = stripeData.url;
          return;
        }
      }

      window.location.href = '/reservation-confirmee';

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
      <p className="mt-2 text-slate-600">Choisissez votre service puis complétez les détails en 3 étapes.</p>

      <div className="mt-6 grid gap-2 rounded-2xl bg-white p-3 md:grid-cols-3">
        {["1. Service", "2. Détails", "3. Confirmation"].map((label, idx) => {
          const current = idx + 1;
          const active = step >= current;
          return (
            <div key={label} className={`rounded-xl px-4 py-3 text-sm font-semibold ${active ? "bg-[#1D9E75] text-white" : "bg-slate-100 text-slate-500"}`}>
              {label}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-slate-900">Choisir un service</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((item) => {
              const selected = service === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setService(item.id); setStep(2); }}
                  className={`rounded-2xl border bg-white p-4 text-left transition ${selected ? "border-[#1D9E75] ring-2 ring-[#1D9E75]/30" : "border-slate-200 hover:border-[#1D9E75]/60"}`}
                >
                  <p className="text-2xl">{item.icon}</p>
                  <p className="mt-2 text-base font-bold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[#1D9E75]">{item.price}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-[#085041]">Vos informations</h2>

          {currentService && (
            <div className="mt-3 mb-5 rounded-2xl border-2 border-green-300 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 p-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{currentService.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold text-green-800">{currentService.name}</h3>
                  <p className="text-base text-green-700 leading-relaxed mt-2">{currentService.description}</p>
                </div>
              </div>
            </div>
          )}

          {service === "garde" && (
            <div className="space-y-6">
              {/* Section Animal */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-green-800 mb-4">🐾 Informations sur votre animal</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Nom de l'animal *</label>
                    <input type="text" required value={animalName} onChange={(e) => setAnimalName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Type d'animal *</label>
                    <select required value={petType} onChange={(e) => setPetType(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                      <option value="">Sélectionner</option>
                      <option>Chien</option>
                      <option>Chat</option>
                      <option>Oiseau</option>
                      <option>Lapin</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  {petType === "Chien" && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Race *</label>
                      <input type="text" required value={petBreed} onChange={(e) => setPetBreed(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                    </div>
                  )}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Âge de l'animal *</label>
                    <select required value={petAge} onChange={(e) => setPetAge(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                      <option value="">Sélectionner</option>
                      <option>Moins de 1 an</option>
                      <option>1 à 3 ans</option>
                      <option>3 à 7 ans</option>
                      <option>Plus de 7 ans</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Tempérament *</label>
                    <select required value={animalTemperament} onChange={(e) => setAnimalTemperament(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                      <option value="">Sélectionner</option>
                      <option>Calme</option>
                      <option>Joueur</option>
                      <option>Nerveux</option>
                      <option>Craintif</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Nombre de jours de garde *</label>
                    <input type="number" required value={guardDays} onChange={(e) => setGuardDays(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" min="1" />
                  </div>
                </div>
              </div>

              {/* Section Client */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-slate-800 mb-4">👤 Vos coordonnées</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Prénom et Nom *</label>
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Téléphone / WhatsApp *</label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Adresse complète *</label>
                    <input type="text" required value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Date souhaitée *</label>
                    <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Heure souhaitée *</label>
                    <select required value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                      <option value="">Choisir une heure</option>
                      <option>8h00</option><option>8h30</option><option>9h00</option>
                      <option>9h30</option><option>10h00</option><option>10h30</option>
                      <option>11h00</option><option>11h30</option><option>12h00</option>
                      <option>12h30</option><option>13h00</option><option>13h30</option>
                      <option>14h00</option><option>14h30</option><option>15h00</option>
                      <option>15h30</option><option>16h00</option><option>16h30</option>
                      <option>17h00</option><option>17h30</option><option>18h00</option>
                      <option>19h00</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Notes libres</label>
                    <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {service === "promenade" && (
            <div className="grid gap-4 md:grid-cols-2 mb-4">
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
                <option>8h00</option><option>8h30</option><option>9h00</option>
                <option>9h30</option><option>10h00</option><option>10h30</option>
                <option>11h00</option><option>11h30</option><option>12h00</option>
                <option>12h30</option><option>13h00</option><option>13h30</option>
                <option>14h00</option><option>14h30</option><option>15h00</option>
                <option>15h30</option><option>16h00</option><option>16h30</option>
                <option>17h00</option><option>17h30</option><option>18h00</option>
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

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={() => setStep(1)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700">Retour</button>
            <button type="button" onClick={() => setStep(3)} className="rounded-lg bg-[#1D9E75] px-5 py-2 font-semibold text-white">Continuer</button>
          </div>
        </div>
      )}

      {step === 3 && service && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">Confirmation</h2>
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
                          service === "garde" && guardDays ? 
                            `${15 * (parseInt(guardDays) || 1)}€` : 
                          currentService?.price}
                      </span>
                      <span className="ml-2 text-xl font-bold text-[#F59E0B]">
                        {service === "promenade" && walkDuration ? 
                          `${calculateDiscountedPrice(calculatePromenadePrice(walkDuration).toString())}€` : 
                          service === "garde" && guardDays ? 
                            `${calculateDiscountedPrice((15 * (parseInt(guardDays) || 1)).toString())}€` : 
                          `${calculateDiscountedPrice(currentService?.price || '0')}€`}
                      </span>
                    </>
                  ) : (
                    <span>
                      {service === "promenade" && walkDuration ? 
                        `${calculatePromenadePrice(walkDuration)}€` : 
                        service === "garde" && guardDays ? 
                          `${15 * (parseInt(guardDays) || 1)}€` : 
                        currentService?.price}
                    </span>
                  )}
                </p>
                {hasDiscount && (
                  <span className="inline-flex animate-pulse rounded-full bg-[#F59E0B] px-3 py-1 text-sm font-bold text-white">
                    🎁 -20% fidélité appliqué !
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-700">Le prix final sera confirmé lors de notre prise de contact</p>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">Vos coordonnées</h3>
              <div className="mt-2 space-y-1">
                <p><span className="font-semibold">Prénom et Nom:</span> {fullName || "Non renseigné"}</p>
                <p><span className="font-semibold">Email:</span> {email || "Non renseigné"}</p>
                <p><span className="font-semibold">Téléphone:</span> {phone || "Non renseigné"}</p>
                <p><span className="font-semibold">Adresse:</span> {fullAddress || "Non renseignée"}</p>
                <p><span className="font-semibold">Date et heure:</span> {date || "Non renseignée"} à {time}</p>
                {notes && <p><span className="font-semibold">Notes:</span> {notes}</p>}
              </div>
            </div>

            {service === "promenade" && (
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-base font-extrabold text-slate-900">Informations du chien</h3>
                <div className="mt-2 space-y-1">
                  <p><span className="font-semibold">Nom du chien:</span> {dogName || "Non renseigné"}</p>
                  <p><span className="font-semibold">Race:</span> {dogBreed || "Non renseignée"}</p>
                  <p><span className="font-semibold">Taille:</span> {dogSize || "Non renseignée"}</p>
                  <p><span className="font-semibold">Tempérament:</span> {dogTemperament || "Non renseigné"}</p>
                  <p><span className="font-semibold">Entente avec autres chiens:</span> {dogSocialization || "Non renseigné"}</p>
                  <p><span className="font-semibold">Durée de la promenade:</span> {walkDuration || "Non renseignée"}</p>
                  <p><span className="font-semibold">Vacciné:</span> {isVaccinated || "Non renseigné"}</p>
                  <p><span className="font-semibold">Stérilisé:</span> {isSterilized || "Non renseigné"}</p>
                </div>
              </div>
            )}

            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">Votre réservation</h3>
              <div className="mt-2">
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
            <h3 className="text-base font-extrabold">💳 Paiement sécurisé</h3>
            <p className="mt-2 text-sm">
              Après confirmation, vous serez redirigé vers notre page de paiement sécurisé Stripe.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setStep(2)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700">
              Modifier
            </button>
            <button
              type="button"
              onClick={handleConfirmReservation}
              disabled={isLoading}
              className="rounded-lg bg-[#1D9E75] px-5 py-2 font-semibold text-white hover:bg-[#1a8a63] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Redirection vers le paiement..." : "Confirmer et payer"}
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
