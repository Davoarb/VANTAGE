import { TeamPlayersDashboard } from "@/modules/players/team-players-dashboard";

export default async function PlayerProfilePage({
  params,
}: {
  // Como estás en Next.js 15, params es una promesa
  params: Promise<{ playerName: string }>;
}) {
  // Extraemos el nombre de la URL (ej: "xkttyx")
  const { playerName } = await params;

  return (
    <div className="space-y-6">
      {/* 
        Le pasamos el nombre a tu componente para que sepa a quién pintar.
        Tendrás que asegurarte de que TeamPlayersDashboard acepte esta 'prop'.
      */}
      <TeamPlayersDashboard selectedPlayer={playerName} />
    </div>
  );
}