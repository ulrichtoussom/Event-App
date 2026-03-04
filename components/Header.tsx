'use client'
import { useCity } from "@/context/CityContext"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import  Link from 'next/link'
import {useRouter} from 'next/navigation'
import LoginModal from "./LoginModal"
import UserNav from './UserNav'
 

export default function Header() {

    const {selectedCity, setCity} = useCity()
    const [cities , setCities] = useState<any[]>([])
    const [user, setUser] = useState<any>(null) // Etat pour l utilisateur
    const [role, setRole] = useState <string | null> (null)  //nouvelle etat pour le role 
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modale

    // sconst router = useRouter()

    // recuperer la ville depuis la Bd au montage du composant 
    useEffect(() => {
        const fecthCities = async () =>{
            const { data } = await supabase.from('cities').select('*').eq('is_active',true)
            if(data) setCities(data)
        }
        fecthCities()

        // Fonction pour récupérer le rôle
         const getUserRole = async (userId: string) => {

            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single()
            setRole(data?.role || 'user')
        }
            // verifier si l utilisateur est connecté 
        supabase.auth.getSession().then(({ data: { session }})=>{
            if (session) {
                setUser(session.user)
                getUserRole(session.user.id)
            }
        })

        // 3. Écouter les changements de connexion (logout/login)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session) {
                getUserRole(session.user.id)
            } else {
                setRole(null) // Reset du rôle au logout
            }
        });
        return () => subscription.unsubscribe()

    },[])

    

    return(
        <>
            <header className=" flex items-center justify-between px-8 py-4 border-b bg-white shadow-sm">
            
                {/* Logo sous Forme de Lien */}
                <Link href="/" className="text-2xl font-extrabold text-indigo-600">
                    CITY<span className="text-gray-900">HUB</span>
                </Link>

                {/* SELECTEUR de ville */}
                <div className=" flex items-center gap-3">
                    <label htmlFor="city-select" className="text-xs font-bold text-gray-400 uppercase traking-tighter">
                        Ville atuelle : 
                    </label>
                    <select name="" id="city-select"
                        value={selectedCity?.id || ''}
                        onChange={(e) => {
                            const chosen = cities.find((c) => c.id === e.target.value)
                            if(chosen) setCity(chosen)
                        }}
                    >
                        <option value="">-- Choisir --</option>
                        {
                            cities.map(city => (
                                <option key={city.id} value= {city.id}>
                                    {city.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Navigation  */} 
                <nav className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium hover:text-indigo-600">Événements</Link>
                        <Link href="/deals" className="text-sm font-medium hover:text-indigo-600">Bons Plans</Link>
                        {user ?
                            (
                                <div className="flex items-center gap-4">
                                    {/* BOUTON ADMIN : Visible uniquement pour le rôle admin */}
                                    {role === 'admin' && (
                                        <Link 
                                            href="/admin/dashboard" 
                                            className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200 hover:bg-red-200 transition"
                                        >
                                            🛡️ Admin
                                        </Link>
                                    )}

                                    {/* Ton bouton proposer existant (masqué pour l'admin si tu veux) */}
                                    {role !== 'admin' && (
                                        <Link 
                                            href="/events/new" 
                                            className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition"
                                        >
                                            + Proposer
                                        </Link>
                                    )}
                                    
                                    <UserNav user={user} role={role} />
                                </div>
                                
                            ):
                            (
                                <button
                                    className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Connexion
                                </button>
                            )
                        }
                </nav>

            </header>

            {/* Appel de la modale */}
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )


}