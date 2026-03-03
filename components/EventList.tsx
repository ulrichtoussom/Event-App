
'use client'

import { useCity } from "@/context/CityContext"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import NextImage from 'next/image'
import Link from 'next/link';
import EventCard from "./EventCard"

export default function EventList() {

    const {selectedCity, searchQuery,selectedCategory} = useCity()
    const [events , setEvents] = useState<any[]>([])
    const[loading, setLoading] = useState<boolean>(false)
    

    useEffect(()=>{
        const fetchEvents = async () =>{
            setEvents([])
            setLoading(true)
            console.log("Recherche pour la ville :", selectedCity?.name, "ID:", selectedCity?.id);
            let query = supabase.from('events').select('*').eq('status', 'approved')

            // Filtre par ville 
            if(selectedCity?.id){
                query = query.eq('city_id',selectedCity.id)
            }

            // Filtre par Titre

            if (searchQuery.length > 0) {
                query = query.ilike('title', `%${searchQuery}%`); 
                // .ilike permet une recherche insensible à la casse
            }

            // Filtre par Categorie

            if (selectedCategory !== 'All') {
                query = query.eq('category', selectedCategory);
            }

            const {data , error} = await query 
            if(!error) setEvents(data)

            setLoading(false)
        }
       // On ajoute un petit délai (debounce) pour ne pas harceler Supabase à chaque lettre tapée
        const timer = setTimeout(() => fetchEvents(), 300);
        return () => clearTimeout(timer);
    },[selectedCity, searchQuery,selectedCategory])

    // if (loading) return <div className="p-10 text-center">Chargement des événements...</div>;

    return(
        <div className="p-8">

            <h2 className="text-2xl font-bold mb-6">
                {selectedCity ? `Évenements a ${selectedCity.name}` : 'Tous les Evenements'}
            </h2>
            {events.length === 0 ? (
                <div className="text-center py-20">
                   <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"      /* Corrigé */
                    strokeLinecap="round"   /* Corrigé */
                    strokeLinejoin="round"  /* Corrigé */
                    className="lucide lucide-calendar w-16 h-16 text-slate-300 mx-auto mb-4"
                    >
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                    </svg>
                    
                    <p className="text-gray-500">Aucun événement trouvé pour cette ville.</p>
                </div>
                ):(
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                       <EventCard  key={event.id}  evt = {event} />
                        
                    ))}
                </div>
            )}

        </div>)

}