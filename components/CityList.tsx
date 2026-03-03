/* 
'use client'

import {supabase}  from '@/lib/supabase'
import type {cities} from '@/type/type'
import NextImage from 'next/image'


export default async function CityList() {
    const {data:cities, error} = await supabase.from('cities').select('*')

    if(error) return <div> Erreur de Chargement </div>
    return (
        <main className="p-10">
        <h1 className="text-3xl font-bold mb-6">Explorez nos villes</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cities?.map((city:cities) => (
            <div key={city.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 w-full"> 
                <NextImage 
                    src={city.image_url || '/placeholder.jpg'} 
                    alt={city.name}
                    fill // Remplit le conteneur parent
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                </div>
                <div className="p-4">
                <h2 className="text-xl font-semibold">{city.name}</h2>
                <p className="text-gray-600 text-sm">{city.description}</p>
                </div>
            </div>
            ))}
        </div>
        </main>
    )
}

   
     */