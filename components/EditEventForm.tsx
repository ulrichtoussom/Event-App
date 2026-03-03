
"use client"

import { updateEvent } from "@/app/users/dashboard/actions";
import { toast } from "sonner";
import ImagePreview from "./ImagePreview";
import { SubmitButton } from "./SubmitButton";
import { useRouter } from "next/navigation"
import { useState } from "react";

type FormError = {
    [key : string]  : string[]
}

export default function EditEventForm ({ id, initialData } : { id : string, initialData: any} ) {

    const today = new Date().toISOString().split('T')[0]
    const parseDate = initialData.event_date.split('T').shift()
    const router = useRouter()

    const [errors, setErrors] = useState < FormError >({})



    const handleSubmit = async ( formData : FormData) => {
        setErrors({})

        try {

            // On appelle l'action serveur avec l'ID et les données
            const result = await updateEvent(id, formData)

            if(result?.errors){
                // si le serveur renvoie des erreurs de validations 
                setErrors(result.errors)
                toast.error("Veuillez Corriger les erreurs")
            }else if(result?.success) {

                toast.success("Événement mis à jour !")

                setTimeout(() => {
                    router.push('/users/dashboard')
                }, 1500)
            }  
            
        } catch (error:any) {
            // Si l'erreur est une redirection, on ne fait rien, 
            // Next.js va gérer la redirection tout seul.
            if (error.message === 'NEXT_REDIRECT' || error.digest?.includes('NEXT_REDIRECT')) {
                return; 
            }

            console.log('EditEventForm Error:', error.message)
            toast.error(error.message)
        }
    }

    return (
        <form action={handleSubmit}>
            {/* Affichage de l'image actuelle */}
            {initialData.image_url && (
                <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Image actuelle :</p>
                    <img src={initialData.image_url} alt="Event" className="w-40 h-40 object-cover rounded-lg border" />
                    <input type="hidden" name="current_image_url" value={initialData.image_url} />
                </div>
            )}

            <div>
                <label className="block text-sm font-bold mb-2">Changer la photo</label>
                                
            </div>
            <div className="mb-4">
                <ImagePreview currentImageUrl = {initialData.image_url} />
                    
            </div>

            <div>
                <label className="block text-sm font-medium">Titre</label>
                <input 
                    required
                    name="title"
                    defaultValue={initialData.title} 
                    className={`w-full p-2 border rounded-lg outline-none transition ${
                        errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
                    }`}
                />

                {errors.title && (
                    <p className="text-red-500 text-xs mt-1 font-medium italic">
                        {errors.title[0]}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea 
                    required
                    name="description"
                    defaultValue={initialData.description}
                    className={`w-full p-2 border rounded-lg outline-none transition ${
                        errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
                    }`}
                />
                {errors.description && (
                    <p className="text-red-500 text-xs mt-1 font-medium italic">
                        {errors.description[0]}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-bold mb-2">Catégorie</label>
                <select 
                    className={`w-full p-2 border rounded-lg outline-none transition ${
                        errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
                    }`}
                    name="category"
                    defaultValue={initialData.category}
                >
                    <option value="comedy">comedy</option>
                    <option value="music">music</option>
                    <option value="food">food</option>
                    <option value="corporate">corporate</option>
                    <option value="lifestyle">lifestyle</option>
                    <option value="other">other</option>


                </select>

                {errors.category && (
                    <p className="text-red-500 text-xs mt-1 font-medium italic">
                        {errors.category[0]}
                    </p>
                )}
            </div>
            <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                Date de l&apos;événement
                </label>
                <input 
                    type="date" 
                    name="date"
                    required 
                    min={today} // Sécurité côté client
                    defaultValue={parseDate} 
                    className={`w-full p-2 border rounded-lg outline-none transition ${
                        errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
                    }`}
                />
                {errors.date && (
                    <p className="text-red-500 text-xs mt-1 font-medium italic">
                        {errors.date[0]}
                    </p>
                )}

                <p className="text-xs text-gray-400 mt-1">Les dates passées ne sont pas autorisées.</p>
            </div>
            
            <SubmitButton text="Sauvegarder Vos Modifications" />

                


        </form>
    )
}