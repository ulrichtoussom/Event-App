import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import AdminEventCard from "@/components/AdminEventCard";
import { CheckCircle, Clock, LayoutDashboard, AlertCircle } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Sécurité : On vérifie le rôle
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  // Récupération des données
  const { data: pendingEvents } = await supabase
    .from("events")
    .select("*,profiles(email)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { count: totalEvents } = await supabase.from("events").select("*", { count: 'exact', head: true });
  const { count: validatedCount } = await supabase.from("events").select("*", { count: 'exact', head: true }).eq("status", "approved");

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header : Centré sur mobile, à gauche sur Desktop */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 text-center md:text-left">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 shrink-0">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Panneau de Contrôle</h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">Gérez et modérez les propositions</p>
          </div>
        </div>

        {/* Stats : Grid 1 col sur mobile, 3 sur desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <StatCard title="En attente" value={pendingEvents?.length || 0} icon={<Clock className="text-orange-500" />} color="bg-orange-50" />
          <StatCard title="Validés" value={validatedCount || 0} icon={<CheckCircle className="text-green-500" />} color="bg-green-50" />
          {/* On peut cacher la 3ème stat sur petit mobile si besoin, ou la laisser s'empiler */}
          <StatCard title="Total" value={totalEvents || 0} icon={<AlertCircle className="text-indigo-500" />} color="bg-indigo-50" />
        </div>

        {/* Liste des événements */}
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6 flex items-center justify-center md:justify-start gap-2">
          Demandes prioritaires 
          <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full font-black">
            {pendingEvents?.length || 0}
          </span>
        </h2>

        {pendingEvents && pendingEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {pendingEvents.map((event) => (
              <AdminEventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-10 md:p-20 text-center">
            <div className="text-4xl md:text-5xl mb-4">✨</div>
            <h3 className="text-lg font-bold text-gray-900">Tout est à jour !</h3>
            <p className="text-sm text-gray-500">Aucun événement en attente.</p>
          </div>
        )}
      </div>
    </div>
  )
}
//sous composant  StatCard optimisée pour mobile

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl md:text-4xl font-black text-gray-900">{value}</p>
      </div>
      <div className={`p-3 md:p-4 ${color} rounded-2xl shrink-0`}>{icon}</div>
    </div>
  );
}

