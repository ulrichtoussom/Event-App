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
       <div className="group relative bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 md:gap-6 hover:shadow-xl transition-all duration-300">
            
            {/* Lien invisible pour voir le détail */}
            <Link href={`/events/${event.id}`} className="absolute inset-0 z-10 rounded-[2rem]" />

            {/* Image : Carré fixe sur Desktop, Bannière sur Mobile */}
            <div className="w-full sm:w-32 md:w-40 h-48 sm:h-32 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 relative z-10 pointer-events-none">
                <img src={event.image_url} alt="" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Infos de l'event */}
            <div className="flex-1 flex flex-col justify-between py-1 relative z-10">
                <div className="pointer-events-none">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black uppercase px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
                            {event.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                           {new Intl.DateTimeFormat('fr-FR').format(new Date(event.created_at))}
                        </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-1 mb-1">{event.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 italic mb-4">{event.description}</p>
                </div>

                {/* ZONE DES BOUTONS : z-20 pour être cliquable */}
                <div className="flex gap-2 md:gap-3 mt-auto relative z-20">
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleApprove();
                        }}
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs md:text-sm font-bold text-white transition-all ${
                            loading ? 'bg-green-300' : 'bg-green-500 active:scale-95 shadow-lg shadow-green-100'
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
                        className="px-5 py-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all active:scale-95 border border-transparent hover:border-red-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div> 
       </div>
    )
       
}