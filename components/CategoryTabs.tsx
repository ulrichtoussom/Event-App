'use client';
import { useCity } from '@/context/CityContext';

const categories = ['All', 'comedy', 'music', 'food', 'corporate', 'lifestyle', 'other'];

export default function CategoryTabs() {
  const { selectedCategory, setCategory, selectedCity } = useCity();

  return (
    <div className="py-12 px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900">Upcoming Events</h2>
        <p className="text-gray-500 mt-2 font-medium">
          Discover amazing events happening in <span className="text-indigo-600 font-bold">{selectedCity?.name || 'your city'}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 border-b border-gray-100 pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}