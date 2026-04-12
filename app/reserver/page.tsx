"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const services = [
  { id: "promenade", icon: "🐕", name: "Promenade de chiens", price: "depuis 8€", description: "Nous promenons votre chien en toute sécurité dans les environs de Fontenay-le-Comte. Chaque promenade est accompagnée de jeux, caresses et un peu d'exercice pour le bonheur de votre compagnon. Des photos seront envoyées sur votre WhatsApp pendant la promenade. Disponible en 30 min, 45 min ou 1 heure. Depuis 8€." },
  { id: "garde", icon: "🐾", name: "Garde d'animaux", price: "dès 15€/jour", description: "Nous gardons votre animal à votre domicile pendant votre absence. Votre compagnon ne remarquera même pas votre absence ! Nous aimons les animaux et savons à quel point ils sont importants dans nos familles. Le service comprend des visites régulières à votre domicile et l'envoi de photos quotidiennes sur votre WhatsApp pour vous rassurer. Dès 15€/jour." },
  { id: "accompagnement", icon: "🤝", name: "Accompagnement de personnes", price: "depuis 12€/h", description: "Nous accompagnons vos proches pour leurs rendez-vous médicaux, courses ou sorties. Nous pouvons également être simplement une présence chaleureuse et bienveillante, en conversant sur des sujets agréables, des cultures différentes et la vie en général. Notre langue natale est l'espagnol, ce qui enrichit nos échanges, et si nécessaire nous utilisons des traducteurs en ligne pour faciliter la communication. Si la personne ne connaît pas ce type de technologies, nous serons ravis de lui apprendre à les utiliser. Disponible 7j/7. Depuis 12€/heure." },
  { id: "courses", icon: "🛒", name: "Courses et commissions", price: "8€", description: "Nous effectuons vos courses et commissions dans le lieu de votre choix, de la manière la plus rapide possible. Le tarif de 8€ est valable pour une seule enseigne ou magasin. Si vous souhaitez des courses dans plusieurs magasins, le tarif sera ajusté en conséquence. Le montant des articles à acheter reste à la charge du client. Rapide, fiable et sans complications." },
  { id: "menage", icon: "🧹", name: "Ménage maison/bureau", price: "depuis 22€", description: "Nous effectuons un nettoyage détaillé et professionnel de votre domicile ou bureau. Nous respectons et préservons la vie privée de nos clients à tout moment. Depuis 22€." },
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
  const [fullAddress, setFullAddress] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [currentReservationId, setCurrentReservationId] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Promenade states
  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [dogTemperament, setDogTemperament] = useState("");
  const [dogSocialization, setDogSocialization] = useState("");
  const [walkDuration, setWalkDuration] = useState("");
  const [isVaccinated, setIsVaccinated] = useState("");
  const [isSterilized, setIsSterilized] = useState("");

  // Garde states
  const [animalName, setAnimalName] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [animalBreed, setAnimalBreed] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [animalTemperament, setAnimalTemperament] = useState("");
  const [gardeNbJours, setGardeNbJours] = useState("");

  // Menage states
  const [menageType, setMenageType] = useState("");
  const [menageSize, setMenageSize] = useState("");

  // Espagnol states
  const [espagnolLieu, setEspagnolLieu] = useState("");
  const [espagnolNiveau, setEspagnolNiveau] = useState("");

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const serviceNameMap: Record<string, string> = {
    "promenade": "Promenade de chiens",
    "garde": "Garde d'animaux",
    "accompagnement": "Accompagnement de personnes",
    "courses": "Courses et commissions",
    "menage": "Ménage maison/bureau",
    "espagnol": "Cours d'espagnol"
  };

  useEffect(() => {
    // Check localStorage first for faster authentication
    const savedToken = localStorage.getItem('sb-bcfxjnqtxakdcsnqhbis-auth-token');
    if (typeof window !== 'undefined' && savedToken) {
      try {
        const parsed = JSON.parse(savedToken);
        if (parsed?.user) {
          setUser(parsed.user);
        }
      } catch(e) {}
      setIsAuthLoading(false);
    }
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: fideliteData } = await supabase
          .from('fidelite')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('service', serviceNameMap[service || '']);
        if (fideliteData && fideliteData.length > 0) {
          const userCount = fideliteData[0].count;
          setHasDiscount(userCount > 0 && userCount % 7 === 0);
        }
      }
      setIsAuthLoading(false);
    };
    checkSession();
  }, [service]);

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

  const calculateMenagePrice = (size: string) => {
    if (size === "Petit") return 22;
    if (size === "Moyen") return 33;
    if (size === "Grand") return 55;
    return 22;
  };

  const getPriceInCents = () => {
    let price = 0;
    if (service === "promenade" && walkDuration) {
      price = calculatePromenadePrice(walkDuration) * 100;
    } else if (service === "garde" && gardeNbJours) {
      price = 15 * (parseInt(gardeNbJours) || 1) * 100;
    } else if (service === "menage" && menageSize) {
      price = calculateMenagePrice(menageSize) * 100;
    } else {
      const priceMap: { [key: string]: number } = {
        'accompagnement': 1200,
        'courses': 800,
        'espagnol': 1500,
        'autre': 1000,
      };
      price = priceMap[service] || 1000;
    }
    if (hasDiscount) { price = Math.round(price * 0.8); }
    return price;
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

  const validateGardeForm = () => {
    const errors: string[] = [];
    if (!animalName.trim()) errors.push("Le nom de l'animal est obligatoire");
    if (!animalType) errors.push("Le type d'animal est obligatoire");
    if (animalType === "Chien" && !animalBreed.trim()) errors.push("La race du chien est obligatoire");
    if (!animalAge) errors.push("L'âge de l'animal est obligatoire");
    if (!animalTemperament) errors.push("Le tempérament est obligatoire");
    if (!gardeNbJours) errors.push("Le nombre de jours est obligatoire");
    return errors;
  };

  const validateMenageForm = () => {
    const errors: string[] = [];
    if (!menageType) errors.push("Le type d'espace est obligatoire");
    if (!menageSize) errors.push("La taille de l'espace est obligatoire");
    return errors;
  };

  const validateEspagnolForm = () => {
    const errors: string[] = [];
    if (!espagnolLieu) errors.push("Le lieu du cours est obligatoire");
    if (!espagnolNiveau) errors.push("Le niveau d'espagnol est obligatoire");
    return errors;
  };

  const validateCommonForm = () => {
    const errors: string[] = [];
    if (!fullName.trim()) errors.push("Le prénom et nom sont obligatoires");
    if (!phone.trim()) errors.push("Le téléphone est obligatoire");
    if (!date.trim()) errors.push("La date est obligatoire");
    if (!time.trim()) errors.push("L'heure est obligatoire");
    if (!fullAddress.trim()) errors.push("L'adresse est obligatoire");
    if (service !== "espagnol" && !paymentMethod) errors.push("La méthode de paiement est obligatoire");
    return errors;
  };

  const handleConfirmReservation = async () => {
    try {
      setIsLoading(true);

      console.log("Service:", service);
      console.log("PaymentMethod:", paymentMethod);
      console.log("EspagnolLieu:", espagnolLieu);
      console.log("EspagnolNiveau:", espagnolNiveau);

      const commonErrors = validateCommonForm();
      if (commonErrors.length > 0) {
        setFormErrors(commonErrors);
        alert("Veuillez compléter tous les champs obligatoires:\n" + commonErrors.join("\n"));
        return;
      }

      if (service === "promenade") {
        const errors = validatePromenadeForm();
        if (errors.length > 0) {
          alert("Veuillez compléter tous les champs obligatoires:\n" + errors.join("\n"));
          return;
        }
      }

      if (service === "garde") {
        const errors = validateGardeForm();
        if (errors.length > 0) {
          alert("Veuillez compléter tous les champs obligatoires:\n" + errors.join("\n"));
          return;
        }
      }

      if (service === "menage") {
        const errors = validateMenageForm();
        if (errors.length > 0) {
          alert("Veuillez compléter tous les champs obligatoires:\n" + errors.join("\n"));
          return;
        }
      }

      if (service === "espagnol") {
        if (espagnolLieu || espagnolNiveau) {
          const errors = validateEspagnolForm();
          if (errors.length > 0) {
            alert("Veuillez compléter tous les champs obligatoires:\n" + errors.join("\n"));
            return;
          }
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      const { data: { session: session2 } } = await supabase.auth.getSession();
      const user = session2?.user || session?.user;
      if (!user) {
        alert("Veuillez vous connecter pour réserver");
        return;
      }

      let precioNumerico = 0;
      if (service === "promenade" && walkDuration) {
        precioNumerico = calculatePromenadePrice(walkDuration);
      } else if (service === "garde" && gardeNbJours) {
        precioNumerico = 15 * (parseInt(gardeNbJours) || 1);
      } else if (service === "menage" && menageSize) {
        precioNumerico = calculateMenagePrice(menageSize);
      } else {
        precioNumerico = parseInt(currentService?.price.replace(/[^0-9]/g, '') || '0');
      }
      const precioFinal = hasDiscount ? Math.round(precioNumerico * 0.8) : precioNumerico;

      let detailsObject: any = { fullName, phone, email: user.email, fullAddress, notes, paymentMethod };

      if (service === "promenade") {
        detailsObject = { ...detailsObject, dogName, dogBreed, dogSize, dogTemperament, dogSocialization, walkDuration };
      }
      if (service === "garde") {
        detailsObject = { ...detailsObject, animalName, animalType, animalBreed, animalAge, animalTemperament, gardeNbJours };
      }
      if (service === "menage") {
        detailsObject = { ...detailsObject, menageType, menageSize };
      }
      if (service === "espagnol") {
        detailsObject = { ...detailsObject, espagnolLieu, espagnolNiveau };
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

      const { data: insertedData, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select('id')
        .single();

      if (error) {
        console.error('Reservation error:', error);
        alert("Erreur lors de la réservation: " + error.message);
        return;
      }

      const reservationId = insertedData?.id || '';
      setCurrentReservationId(reservationId);

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'diegongu@gmail.com',
          subject: `Nouvelle réservation - ${currentService?.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #1D9E75; border-radius: 12px;">
              <h1 style="color: #1D9E75; text-align: center;">Nouvelle Réservation</h1>
              <h2 style="color: #085041;">${currentService?.name}</h2>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h3 style="color: #085041; margin-top: 0;">Détails du service</h3>
                <p><strong>Service:</strong> ${currentService?.name}</p>
                <p><strong>Date souhaitée:</strong> ${date}</p>
                <p><strong>Heure souhaitée:</strong> ${time}</p>
                <p><strong>Prix estimé:</strong> ${precioFinal}€</p>
                <p><strong>Méthode de paiement:</strong> ${paymentMethod}</p>
                <p><strong>ID Réservation:</strong> ${reservationId}</p>
              </div>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h3 style="color: #085041; margin-top: 0;">Coordonnées du client</h3>
                <p><strong>Nom:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Téléphone / WhatsApp:</strong> ${phone}</p>
                <p><strong>Adresse:</strong> ${fullAddress}</p>
              </div>
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://voisin-proche.vercel.app/admin" style="background: #1D9E75; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                  Voir dans le panel admin
                </a>
              </div>
            </div>
          `
        })
      });

      if (paymentMethod === "carte" && service !== "autre") {
        const stripeResponse = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: getPriceInCents(),
            serviceName: currentService?.name || 'Service',
            reservationId: reservationId
          })
        });
        const stripeData = await stripeResponse.json();
        if (stripeData.url) {
          window.location.href = stripeData.url;
          return;
        }
      }

      if (paymentMethod === "virement") {
        setShowBankModal(true);
        return;
      }

      if (paymentMethod !== "carte" && paymentMethod !== "virement") {
        setShowModal(true);
      }

    } catch (err) {
      console.error('Exception:', err);
      alert("Une erreur est survenue lors de la réservation");
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayPrice = () => {
    if (service === "promenade" && walkDuration) {
      const base = calculatePromenadePrice(walkDuration);
      return hasDiscount ? `${Math.round(base * 0.8)}€` : `${base}€`;
    }
    if (service === "garde" && gardeNbJours) {
      const base = 15 * (parseInt(gardeNbJours) || 1);
      return hasDiscount ? `${Math.round(base * 0.8)}€` : `${base}€`;
    }
    if (service === "menage" && menageSize) {
      const base = calculateMenagePrice(menageSize);
      return hasDiscount ? `${Math.round(base * 0.8)}€` : `${base}€`;
    }
    return currentService?.price || '';
  };

  if (isAuthLoading) {
    return (
      <section className="rounded-3xl bg-[#FFFBF5] px-4 py-20 md:px-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D9E75]"></div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="rounded-3xl bg-[#FFFBF5] px-4 py-20 md:px-8">
        <div className="flex items-center justify-center">
          <div className="max-w-md w-full mx-4 rounded-2xl bg-[#085041] p-8 shadow-2xl text-white text-center">
            <div className="mb-6 text-6xl">🔐</div>
            <h2 className="mb-4 text-2xl font-bold">Connectez-vous pour réserver</h2>
            <p className="mb-8 opacity-90">Pour effectuer une réservation, vous devez être connecté à votre compte. C'est rapide et gratuit !</p>
            <div className="space-y-3">
              <a href="/login" className="block w-full rounded-xl bg-white text-[#1D9E75] px-6 py-3 font-semibold hover:bg-gray-50 transition-colors">Se connecter</a>
              <a href="/register" className="block w-full rounded-xl border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white/10 transition-colors">Créer un compte</a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-[#FFFBF5] px-4 py-8 md:px-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Réserver un service</h1>
      <p className="mt-2 text-slate-600">Choisissez votre service puis complétez les détails en 3 étapes.</p>

      <div className="mt-6 grid gap-2 rounded-2xl bg-white p-3 md:grid-cols-3">
        {["1. Service", "2. Détails", "3. Confirmation"].map((label, idx) => {
          const current = idx + 1;
          const active = step >= current;
          return (
            <div
              key={label}
              className={active ? "rounded-xl px-4 py-3 text-sm font-semibold bg-[#1D9E75] text-white" : "rounded-xl px-4 py-3 text-sm font-semibold bg-slate-100 text-slate-500"}
            >
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
                  className={selected ? "rounded-2xl border bg-white p-4 text-left transition border-[#1D9E75] ring-2 ring-[#1D9E75]/30" : "rounded-2xl border bg-white p-4 text-left transition border-slate-200 hover:border-[#1D9E75]/60"}
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

          {currentService && (
            <div className="mb-5 rounded-2xl border-2 border-green-300 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 p-6">
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
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
              <h3 className="text-lg font-bold text-green-800 mb-4">🐕 Informations sur votre chien</h3>
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
            </div>
          )}

          {service === "garde" && (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
              <h3 className="text-lg font-bold text-green-800 mb-4">🐾 Informations sur votre animal</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Nom de l'animal *</label>
                  <input type="text" required value={animalName} onChange={(e) => setAnimalName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Type d'animal *</label>
                  <select required value={animalType} onChange={(e) => setAnimalType(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Sélectionner</option>
                    <option>Chien</option>
                    <option>Chat</option>
                    <option>Oiseau</option>
                    <option>Lapin</option>
                    <option>Autre</option>
                  </select>
                </div>
                {animalType === "Chien" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Race *</label>
                    <input type="text" required value={animalBreed} onChange={(e) => setAnimalBreed(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Âge de l'animal *</label>
                  <select required value={animalAge} onChange={(e) => setAnimalAge(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
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
                  <input type="number" min="1" required value={gardeNbJours} onChange={(e) => setGardeNbJours(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
              </div>
              {gardeNbJours && (
                <p className="mt-3 text-sm font-semibold text-green-700">
                  Prix estimé: {hasDiscount ? Math.round(15 * (parseInt(gardeNbJours) || 1) * 0.8) : 15 * (parseInt(gardeNbJours) || 1)}€ ({gardeNbJours} jour(s) à 15€/jour{hasDiscount ? " avec -20% fidélité" : ""})
                </p>
              )}
            </div>
          )}

          {service === "menage" && (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
              <h3 className="text-lg font-bold text-green-800 mb-4">🧹 Informations sur le ménage</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Type d'espace *</label>
                  <select required value={menageType} onChange={(e) => {
                    setMenageType(e.target.value);
                    if (["Studio / Appartement 1 pièce", "Bureau petit"].includes(e.target.value)) {
                      setMenageSize("Petit");
                    } else if (["Appartement 2 pièces", "Appartement 3 pièces ou plus", "Maison petite (1-2 chambres)", "Bureau moyen"].includes(e.target.value)) {
                      setMenageSize("Moyen");
                    } else if (["Maison moyenne (3 chambres)", "Maison grande (4 chambres ou plus)", "Bureau grand"].includes(e.target.value)) {
                      setMenageSize("Grand");
                    }
                  }} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Sélectionner</option>
                    <option>Studio / Appartement 1 pièce</option>
                    <option>Appartement 2 pièces</option>
                    <option>Appartement 3 pièces ou plus</option>
                    <option>Maison petite (1-2 chambres)</option>
                    <option>Maison moyenne (3 chambres)</option>
                    <option>Maison grande (4 chambres ou plus)</option>
                    <option>Bureau petit</option>
                    <option>Bureau moyen</option>
                    <option>Bureau grand</option>
                  </select>
                </div>
              </div>
              {menageSize && (
                <p className="mt-3 text-sm font-semibold text-green-700">
                  {menageSize === "Petit" && `Prix estimé: ${hasDiscount ? Math.round(22 * 0.8) : 22}€ (2h minimum à 11€/h)`}
                  {menageSize === "Moyen" && `Prix estimé: ${hasDiscount ? Math.round(33 * 0.8) : 33}€ (3h minimum à 11€/h)`}
                  {menageSize === "Grand" && `Prix estimé: ${hasDiscount ? Math.round(55 * 0.8) : 55}€ (5h minimum à 11€/h)`}
                </p>
              )}
            </div>
          )}

          {service === "espagnol" && (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
              <h3 className="text-lg font-bold text-green-800 mb-4">🇪🇸 Informations sur le cours</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Lieu du cours *</label>
                  <select required value={espagnolLieu} onChange={(e) => setEspagnolLieu(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Sélectionner</option>
                    <option>À domicile (chez vous)</option>
                    <option>En extérieur — Parc</option>
                    <option>En extérieur — Promenade / Marche</option>
                    <option>En ligne (visioconférence)</option>
                    <option>À définir ensemble</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Niveau d'espagnol *</label>
                  <select required value={espagnolNiveau} onChange={(e) => setEspagnolNiveau(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Sélectionner</option>
                    <option>Débutant (aucune connaissance)</option>
                    <option>Élémentaire (quelques bases)</option>
                    <option>Intermédiaire (conversations simples)</option>
                    <option>Avancé (bonne maîtrise)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">👤 Vos coordonnées</h3>
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Date souhaitée *</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 pr-12 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 hover:border-slate-400"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
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

              {service === "garde" && (
                <div className="md:col-span-2">
                  <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Information tarif:</strong> Le tarif minimum
                      est de 15€/jour. Le prix final sera établi selon la durée,
                      le type d'animal et vos besoins spécifiques. Nous vous
                      contacterons via WhatsApp après réception de votre demande.
                    </p>
                  </div>
                </div>
              )}

              {service !== "garde" && (
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Méthode de paiement préférée *</label>
                  <select required value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Sélectionner</option>
                    <option value="carte">Paiement en ligne (Stripe)</option>
                    <option value="especes">Espèces (cash)</option>
                    <option value="virement">Virement bancaire</option>
                  </select>
                </div>
              )}
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
            <div className="rounded-xl border border-slate-200 bg-[#1D9E75]/10 p-4">
              <h3 className="text-base font-extrabold text-slate-900">
                {service === "garde" ? "Tarif" : "Prix estimé"}
              </h3>
              {service === "garde" ? (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Tarif:</strong> Dès 15€/jour —
                    Prix final confirmé par WhatsApp
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-extrabold text-[#1D9E75]">
                    {hasDiscount ? (
                      <>
                        <span className="line-through text-gray-400 text-lg">{
                          service === "promenade" && walkDuration ? `${calculatePromenadePrice(walkDuration)}€` :
                          service === "menage" && menageSize ? `${calculateMenagePrice(menageSize)}€` :
                          currentService?.price
                        }</span>
                        <span className="ml-2 text-xl font-bold text-[#F59E0B]">{getDisplayPrice()}</span>
                      </>
                    ) : (
                      <span>{getDisplayPrice()}</span>
                    )}
                  </p>
                  {hasDiscount && (
                    <span className="inline-flex animate-pulse rounded-full bg-[#F59E0B] px-3 py-1 text-sm font-bold text-white">
                      -20% fidélité appliqué !
                    </span>
                  )}
                </div>
              )}
              <p className="mt-1 text-sm text-slate-700">Le prix final sera confirmé lors de notre prise de contact</p>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">Vos coordonnées</h3>
              <div className="mt-2 space-y-1">
                <p><span className="font-semibold">Prénom et Nom:</span> {fullName || "Non renseigné"}</p>
                <p><span className="font-semibold">Email:</span> {user?.email || "Non renseigné"}</p>
                <p><span className="font-semibold">Téléphone:</span> {phone || "Non renseigné"}</p>
                <p><span className="font-semibold">Adresse:</span> {fullAddress || "Non renseignée"}</p>
                <p><span className="font-semibold">Date et heure:</span> {date || "Non renseignée"} à {time}</p>
                <p><span className="font-semibold">Méthode de paiement:</span> {
                  service === "garde" ? "Prix à confirmer par WhatsApp" :
                  paymentMethod === "carte" ? "Paiement en ligne (Stripe)" :
                  paymentMethod === "especes" ? "Espèces (cash)" :
                  paymentMethod === "virement" ? "Virement bancaire" : "Non renseignée"
                }</p>
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
                </div>
              </div>
            )}

            {service === "garde" && (
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-base font-extrabold text-slate-900">Informations de l'animal</h3>
                <div className="mt-2 space-y-1">
                  <p><span className="font-semibold">Nom:</span> {animalName || "Non renseigné"}</p>
                  <p><span className="font-semibold">Type:</span> {animalType || "Non renseigné"}</p>
                  {animalType === "Chien" && <p><span className="font-semibold">Race:</span> {animalBreed || "Non renseignée"}</p>}
                  <p><span className="font-semibold">Âge:</span> {animalAge || "Non renseigné"}</p>
                  <p><span className="font-semibold">Tempérament:</span> {animalTemperament || "Non renseigné"}</p>
                  <p><span className="font-semibold">Nombre de jours:</span> {gardeNbJours || "Non renseigné"}</p>
                </div>
              </div>
            )}

            {service === "espagnol" && (
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-base font-extrabold text-slate-900">Informations sur le cours</h3>
                <div className="mt-2 space-y-1">
                  <p><span className="font-semibold">Lieu du cours:</span> {espagnolLieu || "Non renseigné"}</p>
                  <p><span className="font-semibold">Niveau d'espagnol:</span> {espagnolNiveau || "Non renseigné"}</p>
                </div>
              </div>
            )}

            {service === "menage" && (
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-base font-extrabold text-slate-900">Informations du ménage</h3>
                <div className="mt-2 space-y-1">
                  <p><span className="font-semibold">Type d'espace:</span> {menageType || "Non renseigné"}</p>
                  <p><span className="font-semibold">Taille:</span> {menageSize || "Non renseignée"}</p>
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
            <h3 className="text-base font-extrabold">
              {service === "garde" ? "Confirmation de réservation" :
               paymentMethod === "carte" ? "Paiement sécurisé" : "Confirmation de réservation"}
            </h3>
            <p className="mt-2 text-sm">
              {service === "garde"
                ? "Votre réservation sera confirmée dans les 15 prochaines minutes via WhatsApp."
                : paymentMethod === "carte"
                ? "Après confirmation, vous serez redirigé vers notre page de paiement sécurisé Stripe."
                : "Votre réservation sera confirmée dans les 15 prochaines minutes."}
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> Votre réservation est soumise
              à confirmation de notre part. Après envoi de votre demande,
              nous vous contacterons via WhatsApp dans les plus brefs délais
              pour finaliser les détails et confirmer le service.
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
              {isLoading ? "Confirmation en cours..." : paymentMethod === "carte" ? "Confirmer et payer" : "Confirmer la réservation"}
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative z-50 mx-4 max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="mb-4 text-6xl">✅</div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Demande reçue !</h3>
              <p className="mb-6 text-gray-600">
                Votre demande de réservation a bien été reçue.
                Nous vous contacterons via WhatsApp dans les prochaines
                minutes pour finaliser les détails et établir le prix définitif.
                Merci de votre confiance !
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/33602353569"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  Nous contacter maintenant sur WhatsApp
                </a>
                <a
                  href="/mon-compte"
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Voir mes réservations
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative z-50 mx-4 max-w-lg w-full rounded-2xl bg-white p-8 shadow-2xl">
            <div className="text-center">
              <div className="mb-6 text-6xl">🏦</div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Virement Bancaire</h3>
              <p className="mb-6 text-gray-600">
                Veuillez effectuer un virement vers le compte ci-dessous
                en indiquant bien la référence dans le motif.
              </p>
              <div className="mb-6 rounded-xl bg-green-50 border-2 border-green-200 p-6">
                <h4 className="mb-4 text-lg font-semibold text-green-800">Coordonnées bancaires</h4>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">IBAN:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm bg-white px-3 py-1 rounded border border-green-300">
                        FR76 1470 6001 4174 0175 5308 241
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('FR76 1470 6001 4174 0175 5308 241');
                          alert('IBAN copié dans le presse-papiers !');
                        }}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="Copier l'IBAN"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8v8z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">BIC:</span>
                    <span className="font-mono text-sm">AGRIFRPP847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Titulaire:</span>
                    <span className="text-sm">Diego Leonardo Gutierrez Suarez</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Référence:</span>
                    <span className="font-mono text-sm bg-yellow-100 px-3 py-1 rounded border border-yellow-300">
                      VP-{currentReservationId ? currentReservationId.substring(0, 8) : 'En attente'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Une fois votre virement effectué, nous confirmerons votre réservation dans les plus brefs délais. Merci de bien indiquer la référence ci-dessus dans le motif du virement.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowBankModal(false)}
                  className="rounded-xl bg-[#1D9E75] px-6 py-3 font-semibold text-white hover:bg-[#1a8a63] transition-colors"
                >
                  J'ai compris
                </button>
                <a
                  href="/mon-compte"
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Voir mes réservations
                </a>
              </div>
            </div>
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