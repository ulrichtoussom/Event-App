

'use client';

import { useCity } from "@/context/CityContext";

export default function Hero() {
  const { searchQuery, setSearchQuery } = useCity();

  return (
    <section className="relative py-12 md:py-20 bg-gray-100 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
        
        {/* Titre : Réduit sur mobile (text-3xl) et s'agrandit sur PC (md:text-5xl) */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-gray-900 font-black mb-4 md:mb-6 tracking-tight leading-tight">
          Quoi de neuf dans <span className="text-indigo-600">ta ville ?</span>
        </h1>
        
        {/* Sous-titre (Optionnel mais recommandé pour le SEO et le look mobile) */}
        <p className="text-gray-500 text-sm md:text-lg max-w-lg mx-auto mb-8">
          Découvre les meilleurs événements, concerts et bons plans près de chez toi.
        </p>
        
        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mt-6 md:mt-10">
          <div className="relative group">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Festival, bar, club..."
              // Py-4 sur mobile pour gagner de la place, py-5 sur desktop
              // Rounded-2xl sur mobile pour un look plus moderne, 3xl sur desktop
              className="w-full py-4 md:py-5 px-6 md:px-8 rounded-2xl md:rounded-3xl text-gray-900 text-base md:text-lg shadow-xl md:shadow-2xl outline-none border border-gray-200 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
               🔍
            </div>
          </div>
        </div>
      </div>

      {/* Petit effet visuel pour le fond (optionnel) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent -z-10" />
    </section>
  );
}