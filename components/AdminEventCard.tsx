'use client'

import { approveEvent, deleteEvent } from "@/app/admin/actions";
import { toast } from "sonner";
import { Check, X, Calendar, User, MapPin } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import path from "node:path";

export default function AdminEventCard({ event }: { event: any }) {

    const [loading, setLoading] = useState(false)
  
    const handleApprove = async () => {
        setLoading(true)
        try {
        await approveEvent(event.id);
        toast.success("Événement publié avec succès !");
        } catch (e) {
        toast.error("Erreur lors de la validation");
        }finally{
            setLoading(false)
        }
    };

    const handleReject = async () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette proposition ?")) {
            setLoading(true)
            try {
                await deleteEvent(event.id);
                toast.error("Proposition supprimée.");
            } catch (e) {
                toast.error("Erreur lors de la suppression");
            }finally{
                setLoading(false)
            }
        }
    };

    

    return (
       <div className="group relative bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-6 hover:shadow-xl transition-all duration-300">

            <Link href={`/events/${event.id}`} className=" absolute inset-0 z-10 rounded-3xl" />

            {/* 3. Image (on ajoute relative z-10 pour ne pas bloquer le clic si besoin, 
                mais ici le lien est au-dessus donc l'image est juste décorative) */}
            <div className="w-40 h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 relative z-10 pointer-events-none">
                <img src={event.image_url} alt="" className="w-full h-full object-cover" />
            </div>

            {/* 4. Infos de l'event */}

            <div className="flex-1 flex flex-col justify-between py-1 relative z-10 pointer-events-none">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                            {event.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                            Reçu le {new Intl.DateTimeFormat('fr-FR').format(new Date(event.created_at))}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2">{event.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 italic">{event.description}</p>
                </div>
                {/* 5. ZONE DES BOUTONS : Très important, on met 'relative z-20'  pour qu'ils soient AU-DESSUS du lien invisible */}
                <div className="flex gap-3 mt-4 relative z-20">
                    <button 
                        onClick={(e) => {
                            e.preventDefault(); // Empêche le lien de s'activer
                            e.stopPropagation(); // Arrête la propagation vers le parent
                            handleApprove();
                        }}
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-white rounded-xl text-sm font-bold transition-all ${
                            loading ? 'bg-green-300' : 'bg-green-500 hover:scale-105 shadow-lg shadow-green-100'
                        }`}
                    >
                        {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Check className="w-4 h-4" />}
                        {loading ? '...' : 'Approuver'}
                    </button>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleReject();
                        }}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all hover:scale-105"
                    >
                        <X className="w-4 h-4" />
                    </button>

                </div>
            </div> 
       </div>
    );
}