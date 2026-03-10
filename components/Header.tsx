'use client'
import { useCity } from "@/context/CityContext"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from 'next/link'
import LoginModal from "./LoginModal"
import UserNav from './UserNav'
// Ajout de l'icône Menu pour le responsive
import { Menu, X } from "lucide-react"

export default function Header() {
    const {selectedCity, setCity} = useCity()
    const [cities, setCities] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)
    const [role, setRole] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    // État pour ouvrir/fermer le menu mobile
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fecthCities = async () => {
            const { data } = await supabase.from('cities').select('*').eq('is_active', true)
            if (data) setCities(data)
        }
        fecthCities()

        const getUserRole = async (userId: string) => {
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single()
            setRole(data?.role || 'user')
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser(session.user)
                getUserRole(session.user.id)
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session) {
                getUserRole(session.user.id)
            } else {
                setRole(null)
            }
        });
        return () => subscription.unsubscribe()
    }, [])

    return (
        <>
            <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b bg-white shadow-sm">
                
                {/* Logo */}
                <Link href="/" className="text-xl md:text-2xl font-extrabold text-indigo-600 shrink-0">
                    CITY<span className="text-gray-900">HUB</span>
                </Link>

                {/* SELECTEUR de ville - Caché sur très petits écrans ou réduit */}
                <div className="hidden sm:flex items-center gap-2 md:gap-3">
                    <label htmlFor="city-select" className="hidden lg:block text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        Ville actuelle : 
                    </label>
                    <select 
                        className="text-sm border-none bg-gray-50 rounded-lg p-1 focus:ring-2 focus:ring-indigo-500"
                        value={selectedCity?.id || ''}
                        onChange={(e) => {
                            const chosen = cities.find((c) => c.id === e.target.value)
                            if (chosen) setCity(chosen)
                        }}
                    >
                        <option value="">-- Ville --</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>

                {/* Navigation Desktop */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-indigo-600">Événements</Link>
                    <Link href="/deals" className="text-sm font-medium hover:text-indigo-600">Bons Plans</Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            {role === 'admin' && (
                                <Link href="/admin/dashboard" className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">🛡️ Admin</Link>
                            )}
                            {role !== 'admin' && (
                                <Link href="/events/new" className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">+ Proposer</Link>
                            )}
                            <UserNav user={user} role={role} />
                        </div>
                    ) : (
                        <button className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold" onClick={() => setIsModalOpen(true)}>
                            Connexion
                        </button>
                    )}
                </nav>

                {/* Bouton Burger (Mobile uniquement) */}
                <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </header>

            {/* Menu Mobile (Overlay) */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b px-4 py-6 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top">
                    {/* Sélecteur ville version mobile */}
                    <div className="flex flex-col gap-2 pb-4 border-b">
                        <span className="text-xs font-bold text-gray-400 uppercase">Ville actuelle</span>
                        <select 
                            className="w-full p-2 bg-gray-100 rounded-lg"
                            value={selectedCity?.id || ''}
                            onChange={(e) => {
                                const chosen = cities.find((c) => c.id === e.target.value)
                                if (chosen) { setCity(chosen); setIsMenuOpen(false); }
                            }}
                        >
                             <option value="">-- Choisir --</option>
                             {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                        </select>
                    </div>
                    
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-semibold py-2">Événements</Link>
                    <Link href="/deals" onClick={() => setIsMenuOpen(false)} className="text-lg font-semibold py-2">Bons Plans</Link>
                    
                    <div className="pt-4 border-t">
                        {user ? (
                            <div className="flex flex-col gap-4">
                                {role === 'admin' ? (
                                    <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="text-center bg-red-100 text-red-700 py-3 rounded-xl font-bold">Tableau de bord Admin</Link>
                                ) : (
                                    <Link href="/events/new" onClick={() => setIsMenuOpen(false)} className="text-center bg-green-100 text-green-700 py-3 rounded-xl font-bold">Proposer un événement</Link>
                                )}
                                <div className="flex justify-center bg-gray-50 py-3 rounded-xl"><UserNav user={user} role={role} /></div>
                            </div>
                        ) : (
                            <button 
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg"
                                onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }}
                            >
                                Se connecter / S'inscrire
                            </button>
                        )}
                    </div>
                </div>
            )}

            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}