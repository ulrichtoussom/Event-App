'use client';
import { useCity } from '@/context/CityContext';

const categories = ['All', 'comedy', 'music', 'food', 'corporate', 'lifestyle', 'other'];

export default function CategoryTabs() {
  const { selectedCategory, setCategory, selectedCity } = useCity();

  return (
    <div className="py-8 md:py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 italic uppercase">Upcoming Events</h2>
        <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">
          Discover amazing events happening in <span className="text-indigo-600 font-bold">{selectedCity?.name || 'your city'}</span>
        </p>
      </div>

      {/* Conteneur de scroll horizontal */}
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide snap-x no-scrollbar select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all snap-start shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {/* On met la première lettre en majuscule pour le look */}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Petit dégradé à droite pour indiquer qu'il y a du contenu après (Mobile uniquement) */}
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
      </div>
      
      {/* Ligne de séparation sous le scroll */}
      <div className="border-b border-gray-100 mt-2" />
    </div>
  );
}