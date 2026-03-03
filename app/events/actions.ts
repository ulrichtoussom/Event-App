
import { z } from 'zod'
import { createClient } from '@/lib/server'



 const EventSchema = z.object({
        title: z.string()
            .min(5, "Le titre doit contenir au moins 5 caractères")
            .max(100, "Le titre est trop long"),
        description: z.string()
            .min(10, "La description est trop courte"),
        category: z.enum(["comedy", "music", "food", "corporate", "lifestyle", "other"], {
            errorMap: () => ({ message: "Veuillez choisir une catégorie valide" }),
        }),
        date: z.string().refine((val) => new Date(val) > new Date(), {
            message: "La date doit être dans le futur",
        })
    })

export  async function PostNewEvent( formData : FormData) {

   const supabase = await createClient()
   const { data : { user }} = await supabase.auth.getUser()

    if (!user) throw new Error("Non autorisé")
    
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        date: formData.get('date'),
    }




}