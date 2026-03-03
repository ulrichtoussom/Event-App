'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLoginView, setIsLoginView] = useState(true); // Gère le basculement
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // --- LOGIQUE AUTH ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = isLoginView 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      
    } else {
      if (!isLoginView) alert("Vérifiez vos emails pour confirmer l'inscription !");
      onClose();
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        
        <div className="p-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            {isLoginView ? 'Content de vous revoir' : 'Rejoindre CityHub'}
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            {isLoginView ? 'Connectez-vous pour voir les meilleurs deals.' : 'Créez un compte pour ne rien rater.'}
          </p>

          {/* BOUTON GOOGLE */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 py-3 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition mb-6"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continuer avec Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Ou par email</span></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <input 
              type="email" placeholder="Email" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
            <input 
              type="password" placeholder="Mot de passe" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password} onChange={(e) => setPassword(e.target.value)} required 
            />

            {error && <p className="text-red-500 text-xs px-2 italic">{error}</p>}

            <button 
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
            >
              {loading ? 'Chargement...' : (isLoginView ? 'Se connecter' : "S'inscrire")}
            </button>
          </form>

          {/* BASCULEMENT INSCRIPTION / CONNEXION */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLoginView(!isLoginView)}
              className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition"
            >
              {isLoginView ? "Pas encore membre ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}