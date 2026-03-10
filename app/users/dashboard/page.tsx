import {redirect} from 'next/navigation'
import Link from 'next/link'
import NextImage from 'next/image';
import {createClient}  from '@/lib/server'
import DeleteButton from '@/components/DeleteButton';





export default async  function DashboarUser() {

    // instatiation du client Server de supabase 
    const supabase =  await createClient()

    // 1. Verifier si l utilisateur est connectè
    const { data : { user }} = await  supabase.auth.getUser()
    
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("SESSION SUR SERVEUR:", sessionData.session ? "OUI" : "NON");
    console.log("USER SUR SERVEUR:", user ? user.email : "AUCUN");

    if(!user) {
        redirect('/')
    }

    // 2. recuperer les evenements creer par les utilisateurs 

    const {data:events , error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {ascending : false})

    // Calcule de quelques statistique Simple 

    if(error){
        console.error("Erreur Supabase:", error.message)
        return <div className="p-10 text-red-500">Une erreur est survenue lors du chargement.</div>
    } 
    console.log(user.id)
    console.log(events)

    const stats = {
    total: events?.length || 0,
    approved: events?.filter(e => e.status === 'approved').length || 0,
    pending: events?.filter(e => e.status === 'pending').length || 0,
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                <h1 className="text-3xl font-black text-gray-900">Mon Dashboard</h1>
                <p className="text-gray-500">Gérez vos publications et suivez leur statut.</p>
                </div>
                <Link href="/events/new" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                + Créer un événement
                </Link>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard label="Total" value={stats.total} color="bg-gray-50 text-gray-700" />
                <StatCard label="Approuvés" value={stats.approved} color="bg-green-50 text-green-700" />
                <StatCard label="En attente" value={stats.pending} color="bg-orange-50 text-orange-700" />
            </div>

        {/* Tableau des événements */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50 border-bottom border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Événement</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Ville</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Statut</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {events && events.length > 0 ? (
                events.map((event) => (
                    <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                            <NextImage src={event.image_url || '/placeholder.jpg'} alt="" fill className="object-cover" />
                        </div>
                        <span className="font-bold text-gray-700 line-clamp-1">{event.title}</span>
                        </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{event.cities?.name}</td>
                    <td className="p-4">
                        <StatusBadge status={event.status} />
                    </td>
                    <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                       
                            {/* On construit l'URL dynamiquement avec l'ID de l'événement */}
                            <Link 
                                href={`/users/dashboard/edit/${event.id}`} 
                                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                            >
                                Modifier
                            </Link>
                            <DeleteButton id ={event.id} />
                        
                        </div>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-400 italic">
                    Vous n`&apos;`avez pas encore créé d`&apos;`événements.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    )
    
 }

 // Petits composants utilitaires internes
function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className={`${color} p-6 rounded-2xl flex flex-col`}>
      <span className="text-sm font-medium opacity-80">{label}</span>
      <span className="text-3xl font-black mt-1">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
    rejected: "bg-red-100 text-red-700",
  };
  const label = status === 'approved' ? 'Approuvé' : status === 'pending' ? 'En attente' : 'Refusé';
  
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${styles[status as keyof typeof styles]}`}>
      {label}
    </span>
  );
}



