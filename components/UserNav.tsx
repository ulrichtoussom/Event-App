'use client'

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link'
import { X, User, LayoutDashboard, PlusCircle, LogOut, Settings } from "lucide-react"

export default function UserNav({ user, role }: { user: any, role: string | null }) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const initial = user?.email?.charAt(0).toUpperCase() || 'U'

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setIsOpen(false)
        router.refresh()
    }

    return (
        <>
            {/* Bouton Initiale qui déclenche la modale */}
            <button 
                onClick={() => setIsOpen(true)} 
                className={`h-10 w-10 rounded-full flex items-center text-white justify-center font-bold shadow-md transition-all border-2 border-white shrink-0 ${
                    role === 'admin' ? 'bg-red-600' : 'bg-indigo-600'
                }`}
            >
                {initial}
            </button>

            {/* MODALE D'AUTHENTIFICATION / NAVIGATION */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Background Blur (L'effet que tu adores) */}
                    <div 
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Fenêtre de la Modale */}
                    <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                        
                        {/* Header de la Modale */}
                        <div className={`p-6 text-center ${role === 'admin' ? 'bg-red-50' : 'bg-indigo-50'}`}>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={20} />
                            </button>

                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white mb-3 shadow-lg ${
                                role === 'admin' ? 'bg-red-600' : 'bg-indigo-600'
                            }`}>
                                {initial}
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 truncate px-4">
                                {user?.email}
                            </h3>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                                role === 'admin' ? 'bg-red-200 text-red-700' : 'bg-indigo-200 text-indigo-700'
                            }`}>
                                {role === 'admin' ? 'Administrateur' : 'Membre CityHub'}
                            </span>
                        </div>

                        {/* Corps de la Modale (Liens) */}
                        <div className="p-4 space-y-2">
                            {role === 'admin' ? (
                                <>
                                    <Link 
                                        href="/admin/dashboard" 
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full p-4 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-all font-bold border border-transparent hover:border-red-100"
                                    >
                                        <LayoutDashboard size={20} /> Dashboard Modération
                                    </Link>
                                    <Link 
                                        href="#" 
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full p-4 text-gray-700 hover:bg-gray-50 rounded-2xl transition-all"
                                    >
                                        <Settings size={20} /> Paramètres Villes
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        href="/users/dashboard" 
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full p-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all font-bold border border-transparent hover:border-indigo-100"
                                    >
                                        <User size={20} /> Mes Événements
                                    </Link>
                                    <Link 
                                        href="/events/new" 
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full p-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all font-bold border border-transparent hover:border-indigo-100"
                                    >
                                        <PlusCircle size={20} /> Créer un événement
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Footer (Déconnexion) */}
                        <div className="p-4 bg-gray-50">
                            <button 
                                onClick={handleSignOut}
                                className="flex items-center justify-center gap-2 w-full p-4 text-red-600 font-black hover:bg-red-100 rounded-2xl transition-all border-2 border-dashed border-red-200"
                            >
                                <LogOut size={20} /> Se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}