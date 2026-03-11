'use client';
import { useCity } from '@/context/CityContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Search, Sparkles } from 'lucide-react'; // Pour des icônes plus pro

export default function HeroBanner() {
  const { selectedCity, setCity, searchQuery, setSearchQuery } = useCity();
  const [cities, setCities] = useState([]);

  useEffect(() => {
    async function fetchCities() {
      const { data } = await supabase.from('cities').select('*');
      if (data) setCities(data);
    }
    fetchCities();
  }, []);

  return (
    <section className="relative py-12 md:py-24 bg-indigo-600 text-white overflow-hidden">
      {/* Background Decor - Ajusté pour mobile */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 md:-mt-20 md:-mr-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          {/* Badge mobile optionnel pour le style */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-4 border border-indigo-400/20">
            <Sparkles size={12} /> L'agenda de ta ville
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter leading-[1.1]">
            Vibre au rythme <br /> 
            <span className="text-indigo-200">de ta ville.</span>
          </h1>
          <p className="text-indigo-100 text-base md:text-xl max-w-2xl mx-auto opacity-90">
            Découvre les meilleurs événements et partage tes propres pépites.
          </p>
        </div>

        {/* LA BARRE DE RECHERCHE RESPONSIVE */}
        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] md:rounded-3xl p-2 shadow-2xl flex flex-col md:flex-row items-center gap-1 md:gap-2 border border-white/20">
          
          {/* SECTION VILLE */}
          <div className="flex-1 flex items-center gap-3 px-5 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100">
            <MapPin className="text-indigo-600 w-5 h-5 shrink-0" />
            <div className="flex flex-col flex-1 text-left">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Localisation</label>
              <select 
                value={selectedCity?.id || ''}
                onChange={(e) => {
                  const chosen = cities.find(c => c.id === e.target.value);
                  if (chosen) setCity(chosen);
                }}
                className="bg-transparent text-gray-900 font-bold outline-none cursor-pointer appearance-none text-sm md:text-base"
              >
                <option value="">Où vas-tu ?</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION RECHERCHE */}
          <div className="flex-[1.5] flex items-center gap-3 px-5 py-3 w-full">
            <Search className="text-gray-400 w-5 h-5 shrink-0" />
            <div className="flex flex-col flex-1 text-left">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Recherche</label>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Concert, expo, foot..."
                className="bg-transparent text-gray-900 font-bold outline-none placeholder:text-gray-300 text-sm md:text-base w-full"
              />
            </div>
          </div>

          {/* BOUTON GO */}
          <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-8 py-4 md:py-5 rounded-2xl md:rounded-2xl font-black transition-all shadow-lg shadow-indigo-100 uppercase text-xs md:text-sm tracking-widest shrink-0">
            Explorer
          </button>
        </div>
      </div>
    </section>
  );
}