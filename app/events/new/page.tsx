'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCity } from '@/context/CityContext';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
import{ toast }  from 'sonner'
import { z } from 'zod'


const eventSchema = z.object({
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  category: z.enum(["comedy", "music", "food", "corporate", "lifestyle", "other"], {
    errorMap: () => ({ message: "Veuillez choisir une catégorie valide" }),
  }),
  eventDate: z.string().refine((date) => new Date(date) >= new Date(new Date().setHours(0,0,0,0)), {
    message: "La date ne peut pas être dans le passé",
  }),
});

export default function NewEventPage() {
  const { selectedCity } = useCity();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('comedy');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasError, sethasError] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  
  const[eventDate, setEventDate] = useState(today)

  // 1. Vérifier si l'utilisateur est connecté (Sécurité côté client)
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Tu dois être connecté pour proposer un événement !");
        router.push('/');
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {

      e.preventDefault();
      setFormErrors({}); // Reset des erreurs
      sethasError(false); // On remet à zéro au début de chaque tentative
      // 1. Validation avec Zod
      const result = eventSchema.safeParse({ title, description, category, eventDate });

      if (!result.success) {

        const errors: { [key: string]: string } = {};

        // PETIT PLUS : Si Zod échoue et qu'il n'y a pas d'image, 
        // on montre l'erreur d'image aussi sans attendre le prochain clic
        if (!selectedFile) sethasError(true);

        result.error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
         });

        setFormErrors(errors);
        return toast.error("Veuillez corriger les erreurs");
    }

      if (!selectedFile) {
        sethasError(true)
        return toast.error("Veuillez ajouter une image !")
        
      }
      if (!selectedCity) return alert("Veuillez sélectionner une ville !");      
      

      setLoading(true);

      try {
        
        // ÉTAPE 1 : Upload de l'image vers Supabase Storage
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `events/${fileName}`;

        const { error: uploadError } = await supabase.storage
        .from('events-images') // Assure-toi que le nom du bucket est correct
        .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // ÉTAPE 2 : Récupérer l'URL publique de l'image
        const { data: { publicUrl } } = supabase.storage
          .from('events-images')
          .getPublicUrl(filePath);

        // ÉTAPE 3 : Insertion de l'événement dans la base de données
      const { error: dbError } = await supabase.from('events').insert([
        {
          title,
          description,
          category,
          user_id: user?.id ,
          image_url: publicUrl,
          city_id: selectedCity.id,
          event_date : eventDate,
          status: 'pending' // L'admin devra valider
        }
      ]);

      if (dbError) {
        // Optionnel : supprimer l'image si la création de l'event échoue
        await supabase.storage.from('event-images').remove([filePath]);
        throw dbError;
      }

      toast.success("Succès ! Événement créé.");
      router.push('/');

      } catch (error : any) {
        toast.error(error.message);
      }finally{
        setLoading(false);
      } 
      

  };

  if (!user) return <p className="p-20 text-center">Vérification de l'accès...</p>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-3xl mt-10">
      <h1 className="text-3xl font-black mb-6">Proposer un événement à {selectedCity?.name}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <ImageUpload onFileSelected={(file) => { 
            setSelectedFile(file) 
            sethasError(false) // <-- On enlève le rouge dès qu'un fichier est choisi
            }} hasError={hasError} /> 
          <label className="block text-sm font-bold mb-2">Titre de l'événement</label>
          <input 
            type="text" className={`w-full p-4 bg-gray-50 rounded-2xl outline-none transition ${
                formErrors.title ? 'border-2 border-red-500 ring-1 ring-red-200' : 'focus:ring-2 focus:ring-indigo-500'
            }`}

            placeholder="Ex: Festival Jazz" value={title} onChange={(e) => setTitle(e.target.value)} required
          />
          {formErrors.title && (
            <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Catégorie</label>
          <select 
            className={`w-full p-4 bg-gray-50 rounded-2xl outline-none transition ${
                formErrors.category ? 'border-2 border-red-500 ring-1 ring-red-200' : 'focus:ring-2 focus:ring-indigo-500'
            }`}
            value={category} onChange={(e) => setCategory(e.target.value)}
          >
            <option value="comedy">comedy</option>
            <option value="music">music</option>
            <option value="food">food</option>
            <option value="corporate">corporate</option>
            <option value="lifestyle">lifestyle</option>
            <option value="other">other</option>


          </select>
          {formErrors.category && (
            <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.category}</p>
          )}
        </div>
        <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">
              Date de l'événement
            </label>
            <input 
              type="date" 
              required 
              min={today} // Sécurité côté client
              value={eventDate} 
              onChange={(e) => setEventDate(e.target.value)}
              className={`w-full p-3 bg-gray-50 rounded-2xl outline-none transition ${
                formErrors.eventDate ? 'border-2 border-red-500 ring-1 ring-red-200' : 'focus:ring-2 focus:ring-indigo-500'
            }`}
            />
            {formErrors.eventDate && (
              <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.eventDate}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">Les dates passées ne sont pas autorisées.</p>
            
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Description</label>
          <textarea 
            className={`w-full p-3 bg-gray-50 rounded-2xl outline-none transition ${
                formErrors.description ? 'border-2 border-red-500 ring-1 ring-red-200' : 'focus:ring-2 focus:ring-indigo-500'
            }`}
            placeholder="Dites-nous en plus..." value={description} onChange={(e) => setDescription(e.target.value)} required
          />
            {formErrors.description && (
              <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.description}</p>
            )}
        </div>

        <button 
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition"
        >
          {loading ?
           <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            Envoi...
           </>
          : 'Soumettre la proposition'}

        </button>
      </form>
    </div>
  );
}