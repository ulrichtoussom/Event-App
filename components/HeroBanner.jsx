'use client';
import { useCity } from '@/context/CityContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Hero() {
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
    <section className="relative py-24 bg-indigo-600 text-white overflow-hidden">
      {/* Background Decor */}
      <div className=" absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full "></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Vibre au rythme <br /> 
            <span className="text-indigo-200">de ta ville.</span>
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto">
            Découvre les meilleurs événements et partage tes propres pépites avec la communauté.
          </p>
        </div>

        {/* LA BARRE STYLEE */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-2 shadow-2xl flex flex-col md:flex-row items-center gap-2">
          
          {/* SECTION VILLE */}
          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-r border-gray-100">
            <span className="text-indigo-600 text-xl">📍</span>
            <div className="flex flex-col flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Localisation</label>
              <select 
                value={selectedCity?.id || ''}
                onChange={(e) => {
                  const chosen = cities.find(c => c.id === e.target.value);
                  if (chosen) setCity(chosen);
                }}
                className="bg-transparent text-gray-900 font-bold outline-none cursor-pointer appearance-none"
              >
                <option value="">Où vas-tu ?</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION RECHERCHE */}
          <div className="flex-[1.5] flex items-center gap-3 px-6 py-3 w-full">
            <span className="text-gray-400 text-xl">🔍</span>
            <div className="flex flex-col flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recherche</label>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Concert, expo, foot..."
                className="bg-transparent text-gray-900 font-bold outline-none placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* BOUTON GO */}
          <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg shadow-indigo-200 uppercase text-sm tracking-widest">
            Explorer
          </button>
        </div>
      </div>
    </section>
  );
}