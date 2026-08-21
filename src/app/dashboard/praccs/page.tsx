import { prisma } from "@/lib/prisma";
import { PraccView } from "@/modules/praccs/pracc-view";

export default async function PraccsPage() {
  // Buscamos la última partida en la base de datos
  const lastMatch = await prisma.match.findFirst({
    include: {
      players: true,
    },
  });

  if (!lastMatch) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        No hay partidas registradas.
      </div>
    );
  }

  return <PraccView lastMatch={lastMatch} />;
}