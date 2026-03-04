'use server'

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

/**
 * Vérifie si l'utilisateur actuel est admin
 * Cette fonction est interne pour sécuriser toutes les actions ci-dessous
 */
async function checkAdmin(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Non authentifié");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        throw new Error("Accès refusé : privilèges insuffisants");
    }
    return user;
}

/**
 * Approuve un événement (passe le statut à 'validated')
 */
export async function approveEvent(id: string) {
    const supabase = await createClient();
    
    try {
        await checkAdmin(supabase);

        const { error } = await supabase
            .from("events")
            .update({ status: "validated" })
            .eq("id", id);

        if (error) throw error;

        // On rafraîchit les données du dashboard et de la page d'accueil
        revalidatePath("/admin/dashboard");
        revalidatePath("/");
        
        return { success: true };
    } catch (error: any) {
        console.error("Approve Error:", error.message);
        throw new Error(error.message);
    }
}

/**
 * Supprime un événement (Refus de la proposition)
 */
export async function deleteEvent(id: string) {
    const supabase = await createClient();

    try {
        await checkAdmin(supabase);

        // 1. Récupérer les infos de l'event pour supprimer l'image aussi
        const { data: event } = await supabase
            .from("events")
            .select("image_url")
            .eq("id", id)
            .single();

        // 2. Supprimer l'entrée en base de données
        const { error: dbError } = await supabase
            .from("events")
            .delete()
            .eq("id", id);

        if (dbError) throw dbError;

        // 3. Optionnel : Nettoyage du storage si l'image existe
        if (event?.image_url) {
            const fileName = event.image_url.split('/').pop();
            await supabase.storage
                .from('events-images')
                .remove([`events/${fileName}`]);
        }

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Delete Error:", error.message);
        throw new Error(error.message);
    }
}