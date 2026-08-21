interface PageProps {
    params: Promise<{
      mapName: string;
    }>;
  }
  
  export default async function MapDetailsPage({ params }: PageProps) {
    const { mapName } = await params;
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white capitalize">{mapName} Analytics</h1>
        <p className="text-zinc-400 mt-2">Map breakdown coming soon.</p>
      </div>
    );
  }