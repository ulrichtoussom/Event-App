'use client'

import { useState } from "react";

interface ImageUploadProps {
  onFileSelected: (file: File) => void;
  hasError : boolean
}


export default function ImageUpload({ onFileSelected , hasError}: ImageUploadProps){

    const [preview, setPreview] = useState<string | null>(null);  

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        // Création d'une URL locale temporaire pour l'aperçu (browser-only)
        setPreview(URL.createObjectURL(file));
        // On transmet le fichier brut au composant parent (le formulaire)
        onFileSelected(file);
        }
    };

  

   return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Image de l'événement</label>
            {/* Permettre de cliquer sur toute la div pour ajouter le fichier */}
            <div 
                onClick={() => document.getElementById('fileInput')?.click()}
                className={`relative h-48 w-full border-2 border-dashed rounded-2xl cursor-pointer transition overflow-hidden flex items-center justify-center ${
                hasError
                    ? 'border-red-500 bg-red-50 ring-1 ring-red-200' // Style d'erreur
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100' // Style normal
                }`}
            >
                {preview ? (
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                ) : 
                (
                    <div className="text-center">
                        <span className={`text-3xl ${hasError ? 'grayscale-0' : ''}`}>🖼️</span>
                        <p className={`text-sm mt-2 ${hasError ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        {hasError ? 'Une photo est requise !' : 'Cliquez pour choisir une photo'}
                        </p>
                    </div>
                )}
            </div>
            <input 
                id="fileInput"
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*" 
            />
        </div>
    );



    


}