"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was previously closed in this session
    const bannerClosed = sessionStorage.getItem('topBannerClosed');
    if (!bannerClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Save to sessionStorage to remember for this session
    sessionStorage.setItem('topBannerClosed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative w-full bg-[#F59E0B] h-11 flex items-center justify-center">
      {/* Desktop text */}
      <div className="hidden md:flex items-center gap-2 text-sm font-bold text-[#085041]">
        <span>⭐</span>
        <span>Programme de fidélité</span>
        <span>·</span>
        <span>7 services = -20% sur le suivant</span>
        <span>·</span>
        <Link 
          href="/register" 
          className="underline hover:no-underline transition-all"
        >
          Inscrivez-vous gratuitement !
        </Link>
      </div>
      
      {/* Mobile text */}
      <div className="md:hidden flex items-center gap-2 text-sm font-bold text-[#085041]">
        <span>⭐</span>
        <span>7 services = -20%</span>
        <span>·</span>
        <Link 
          href="/register" 
          className="underline hover:no-underline transition-all"
        >
          S'inscrire
        </Link>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Fermer le banner"
      >
        <svg className="h-4 w-4 text-[#085041]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
