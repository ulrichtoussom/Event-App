'use client'
import NextImage from 'next/image'
import { useState } from 'react'

export default function ImagePreview({ currentImageUrl }: { currentImageUrl?: string }) {
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // C'est ici que l'astuce opère !
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
            
            // Nettoyage de la mémoire quand le composant est détruit
            return () => URL.revokeObjectURL(objectUrl)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <input 
                type="file" 
                name="image" 
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            {preview && (
                <>
                    <p className="text-sm font-medium mb-2">Image changé :</p>
                    <div className="relative w-40 h-40">

                        <NextImage
                            src={preview} 
                            alt="Aperçu" 
                            fill
                            className="w-full h-full object-cover rounded-xl border-2 border-indigo-100 shadow-md"
                        />
                    </div>
                </>
                
            )}
            
            
        </div>
    )
}