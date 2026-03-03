

'use client';

import { useCity } from "@/context/CityContext";


export default function Hero() {
  const { searchQuery, setSearchQuery ,selectedCity, setCity } = useCity()
  

  return (
    <section className="relative py-20 bg-gray-100 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
        <h1 className="text-5xl text-gray-900 font-black mb-6 tracking-tight">
          Quoi de neuf dans <span className="text-indigo-300">ta ville ?</span>
        </h1>
        
        <div className="max-w-2xl mx-auto mt-10">
          <div className="relative group">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher un festival, un bar, un club..."
              className="w-full py-5 px-8 rounded-3xl text-gray-900 text-lg shadow-2xl outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
            />
            <div className="absolute right-4 top-4 text-indigo-200">
               {/* Icone de loupe si tu en as une */}
               🔍
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}