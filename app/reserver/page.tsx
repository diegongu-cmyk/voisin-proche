"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

function BookingPageContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [service, setService] = useState(searchParams.get("service") || "");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [notes, setNotes] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="rounded-3xl bg-[#FFFBF5] px-4 py-8 md:px-8">
      <h1 className="text-2xl font-extrabold text-[#085041]">Réserver un service</h1>
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