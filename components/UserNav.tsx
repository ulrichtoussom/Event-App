
'use client'

import { supabase } from "@/lib/supabase";
import { init } from "next/dist/compiled/webpack/webpack";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link'



export default function UserNav({ user, role }:{ user:any, role:string | null }) {

    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    // on retoupe l initial de l email 

    const initial = user?.name?.charAt(0).toUpperCase() || 'U'

    // fonction de deconnection 

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setIsOpen(false)
        router.refresh()
    }

    return(
        <div className="relative ">
            {/* Notre boutton initiale  */}
            <button onClick={() => setIsOpen(!isOpen)}  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all border-2 border-white ${
                    role === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {initial}
            </button>

            {/* Menu deroulant  */}
            {isOpen &&
                <>
                    {/* Overlay pour fermer en cliquant n'importe où */}
                    <div className="absolute  right-0 top-10 inset-0 z-15 " onClick={() => setIsOpen(false)}>
                        <div className=" absolute right-0 mt-3 w-56   bg-white rounded-2xl shadow-xl  py-2 z-20">
                           
                            {/* Section Header du menu */}
                            <div className="px-4 py-3 border-b border-gray-50">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Compte</p>
                                {role === 'admin' && (
                                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase">Admin</span>
                                )}
                                <p className="text-sm text-gray-700 truncate font-medium">{user.email}</p>
                            </div>
                            {/* Liens dynamiques selon le rôle */}
                            <div className="p-2">
                                {role === 'admin' ? (
                                    <>
                                        <Link 
                                            href="/admin/dashboard" 
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-bold"
                                        >
                                            🛡️ Dashboard Modération
                                        </Link>
                                        <Link 
                                            href="/admin/cities" 
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition"
                                        >
                                            🏙️ Gérer les villes
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            href="/users/dashboard" 
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
                                        >
                                            📊 Mes Événements
                                        </Link>
                                        <Link 
                                            href="/events/new" 
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
                                        >
                                            ✨ Créer un événement
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="p-2 border-t border-gray-50">
                                <button 
                                    onClick={handleSignOut}
                                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
                                >
                                    🚪 Se déconnecter
                                </button>
                        
                            </div>
                        </div>
                    </div>
                </>

            }

        </div>
    )
}