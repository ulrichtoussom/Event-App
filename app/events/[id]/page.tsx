import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link'

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Récupérer l'événement spécifique depuis Supabases

  const { id } = await  params
  const dateOptions = {
    year: 'numeric',
    month : 'long',
    day : 'numeric'
  }
  const { data: event, error } = await supabase
    .from('events')
    .select('*, cities(name)') // On récupère aussi le nom de la ville associée
    .eq('id', id)
    .single();

  // 2. Gérer si l'événement n'existe pas
  if (error || !event) {
    console.log("Erreur ou Event non trouvé :", error);
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      {/* Bouton Retour */}
      <Link href="/" className="text-indigo-600 font-bold text-sm mb-6 inline-block hover:underline">
        ← Retour aux événements
      </Link>

      {/* Hero Image */}
      <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-xl mb-8">
        <Image 
          src={event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'} 
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Contenu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {event.category}
          </span>
          <h1 className="text-4xl font-black text-gray-900 mt-4 mb-6">{event.title}</h1>
          <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Sidebar Infos */}
        {/* Sidebar Infos - Version améliorée */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit sticky top-6">
          <h3 className="font-bold text-xl text-gray-900 mb-6">Détails</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase">Localisation</p>
                <p className="font-bold text-gray-700">{event.cities?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase">Date de l'événement</p>
                <p className="font-bold text-gray-700">
                  
                  {
                    new Intl.DateTimeFormat('fr-FR', dateOptions).format(new Date(event.event_date))
                  }
                </p>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl mt-4 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 flex justify-center items-center gap-2">
              Réserver ma place
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}