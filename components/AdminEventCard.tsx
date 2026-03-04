'use client'

import { approveEvent, deleteEvent } from "@/app/admin/actions";
import { toast } from "sonner";
import { Check, X, Calendar, User, MapPin } from "lucide-react";

export default function AdminEventCard({ event }: { event: any }) {
  
  const handleApprove = async () => {
    try {
      await approveEvent(event.id);
      toast.success("Événement publié avec succès !");
    } catch (e) {
      toast.error("Erreur lors de la validation");
    }
  };

  const handleReject = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette proposition ?")) {
      try {
        await deleteEvent(event.id);
        toast.error("Proposition supprimée.");
      } catch (e) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-6 hover:shadow-xl transition-all duration-300">
      {/* Image de l'event */}
      <div className="w-40 h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
        <img src={event.image_url} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Infos de l'event */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
              {event.category}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              Reçu le {new Date(event.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2">{event.title}</h3>
          
          <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(event.event_date).toLocaleDateString()}</div>
            <div className="flex items-center gap-1"><User className="w-3 h-3" /> {event.profiles?.email.split('@')[0]}</div>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2 italic">{event.description}</p>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 mt-4">
          <button 
            onClick={handleApprove}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-100"
          >
            <Check className="w-4 h-4" /> Approuver
          </button>
          <button 
            onClick={handleReject}
            className="px-4 py-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl text-sm font-bold transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}