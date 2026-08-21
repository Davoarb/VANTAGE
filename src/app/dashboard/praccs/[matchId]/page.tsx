import { prisma } from "@/lib/prisma";
import { PraccView } from "@/modules/praccs/pracc-view";
import { notFound } from "next/navigation";

export default async function MatchDetailPage({
  params,
}: {
  // 1. En Next.js 15, params es una Promesa
  params: Promise<{ matchId: string }>; 
}) {
  // 2. Extraemos el ID exacto usando await
  const { matchId } = await params;

  // 3. Buscamos esa partida específica en Supabase
  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      players: true,
    },
  });

    if (!match) {
    notFound();
    }

  // 4. Cambiamos "matchData" por "lastMatch" para que coincida con tu componente
    return <PraccView lastMatch={match} />;
}