
'use server'

import {  createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

import { z } from 'zod'

// Définition du schéma
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

export async function deleteEvent(eventId: string) {


    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Non autorisé")

    // On ajoute 'count' pour savoir combien de lignes ont été impactées
    const { error, count } = await supabase
        .from('events')
        .delete({ count: 'exact' }) // Ajoute ceci
        .eq('id', eventId)
        .eq('user_id', user.id)


    if (error) throw new Error(error.message)
    
    // Si count est 0, c'est que la condition .eq() n'a trouvé aucun match
    if (count === 0) {
        console.warn("Attention : Aucune ligne n'a été supprimée. L'ID ou l'User_id est incorrect.")
    }

    revalidatePath('/users/dashboard')
}



export async function updateEvent(eventId:string, formData:FormData){

    const supabase = await createClient()

    const { data : { user }} = await supabase.auth.getUser()
    if(!user) throw new Error('Non Autorisé')


    const validatedFields = EventSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        date: formData.get('date'),
    })

    // 2. Si la validation échoue, on renvoie les erreurs
    if (!validatedFields.success) {
        //const errors = validatedFields.error.flatten().fieldErrors
        //throw new Error(Object.values(errors).flat().join(", "))
        return {
            errors : validatedFields.error.flatten().fieldErrors ,
            message : 'Formulaire Invalide'
        }

    }

    // 1. Securite 

    const imageFile = formData.get('image') as File
    let imageUrl = formData.get('current_image_url') as string
    
    // 1. Si une nouvelle image est sélectionnée

    if(imageFile && imageFile.size > 0) {

        if (imageFile.size > 2 * 1024 * 1024) {
            throw new Error("L'image est trop lourde (max 2Mo)")
        }

            // Vérifier le type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(imageFile.type)) {
            throw new Error("Format d'image non supporté (JPG, PNG, WebP uniquement)")
        }

        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}-${crypto.randomUUID()}.${fileExt}`
        const filePath = `events/${fileName}`

        // upload vers le Storage 
        const { error: uploadError } = await supabase.storage.from('events-images').upload(filePath,imageFile)
        if (uploadError) throw new Error("Erreur upload image " + uploadError.message)
        // Récupérer l'URL publique
        const { data } = supabase.storage.from('event-images').getPublicUrl(filePath)
        imageUrl = data.publicUrl
    }

    
    // Extration des donnes du formulaire 

    // 3. Si on arrive ici, les données sont propres (validatedFields.data)
    const { title, description, category, date } = validatedFields.data
    
    const updateData = {
        title ,
        description,
        category,
        event_date : date,
        image_url: imageUrl // On met à jour l'URL ici
    }

    // INSERTION DES DONNES DANS LA BD 
    const { data:updateEvent, error } =  await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)
        .eq('user_id',user.id)
        .select()
    
    if(error) throw new Error( error.message)
    

     // 1. On efface le cache pour que le Dashboard affiche les nouvelles infos
    revalidatePath('/users/dashboard')
    
    return { success: true } // On retourne un objet simple
    // 2. On renvoie l'utilisateur vers le Dashboard
    //redirect('/users/dashboard')


}