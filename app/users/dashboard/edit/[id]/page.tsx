

import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import Link from 'next/link'
import EditEventForm from "@/components/EditEventForm";

export default async function EditEventPage( { params } : { params : Promise < { id : string}>}) {

    const{ id } = await params 
    const supabase = await createClient()
    // recupere l evenement specifique 

    const { data:event } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

    

    // 2. Affiche l'ID reçu pour vérifier s'il est complet
    console.log("ID recherché :", id)
    console.log(typeof event.event_date)

    if (!event) {
        console.log("Aucun événement trouvé pour cet ID.")
        return notFound() // On met return pour stopper l'exécution
    }

    // Création de l'action pour le formulaire (bind permet de passer l'ID)

    return (
        <div className="max-w-2xl mx-auto p-10">
                    {/* Bouton Retour */}
            <Link href="/users/dashboard" className="text-indigo-600 font-bold text-sm mb-6 inline-block hover:underline">
                ← Retour aux dasboard
            </Link>
            <h1 className="text-2xl font-bold mb-6">Modifier l&apos;événement</h1>
            
            <EditEventForm id={id}  initialData={event} />
        </div>
    )

}