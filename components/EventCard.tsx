
import Link from 'next/link'

import NextImage from 'next/image'
import { useState } from 'react'
import type {Events} from '@/type/type'

export default function EventCard({ evt } : {evt:Events} ) {

    const [imgSrc, setImgSrc] = useState(evt.image_url)

    return(
        <Link  href={`/events/${evt.id}`} key={evt.id}>
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-40 w-full">
                    <NextImage 
                        src={ imgSrc || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'}
                        alt = {evt.title || 'Evénement'}
                        fill
                        onError={() => setImgSrc('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4')} // Image de secours
                        className="object-cover"
                    />
                </div>

                <div className="p-4">
                    <span className="text-xs font-bold text-indigo-600 uppercase">{evt.category}</span>
                    <h3 className="text-lg font-bold line-clamp-1">{evt.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{evt.description}</p>
                </div>
            </div>
        </Link>
    )
}