"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Demande d'information");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          nom: `${firstName} ${lastName}`,
          email,
          telephone: phone,
          sujet: subject,
          message,
          lu: false
        }]);

      if (error) {
        alert("Erreur lors de l'envoi du message: " + error.message);
      } else {
        alert("Message envoyé ! Nous vous répondons dans les 2 heures.");
        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setSubject("Demande d'information");
        setMessage("");
      }
    } catch (err) {
      alert("Une erreur est survenue lors de l'envoi du message");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Header */}
      <header className="rounded-3xl bg-[#1D9E75] px-6 py-10 text-white md:px-10 md:py-12">
        <h1 className="text-4xl font-extrabold md:text-5xl">Contactez-nous</h1>
        <p className="mt-3 text-white/90">
          Nous vous répondons dans les 2 heures
        </p>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#085041]">Informations</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D9E75]">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502.817l-2.462 2.462a1 1 0 01-.817.502l-4.493-1.498a1 1 0 00-.684.948L8 9.28a1 1 0 00-1 1.72V19a2 2 0 002 2h10a2 2 0 002-2V9.28a1 1 0 00-1-.72z" />
                    <path d="M2 8a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#085041]">Téléphone</p>
                  <p className="text-slate-700">+33 6 02 35 35 69</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D9E75]">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#085041]">Email</p>
                  <p className="text-slate-700">voisinprochecontact@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D9E75]">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2s7 2 7 7c0 5.5-7 10-7 10-7-2-7-7-7z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#085041]">Adresse</p>
                  <p className="text-slate-700">Fontenay-le-Comte, Vendée (85)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D9E75]">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#085041]">Horaires</p>
                  <p className="text-slate-700">Disponible 7j/7 de 8h à 20h</p>
                </div>
              </div>

              <a
                href="https://wa.me/33602353569"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.008-.371-.01-.57-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#085041] mb-6">Formulaire de contact</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Prénom</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Nom</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Téléphone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sujet</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  >
                    <option>Demande d'information</option>
                    <option>Réservation</option>
                    <option>Réclamation</option>
                    <option>Partenariat</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#1D9E75] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Envoyer le message
                </button>
              </form>

              <p className="mt-4 text-xs text-slate-500 text-center">
                Vos données sont confidentielles et ne seront jamais partagées
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
