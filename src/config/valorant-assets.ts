// 🗺️ MAPS BACKGROUND
export const MAP_BACKGROUNDS: Record<string, string> = {
    Pearl: "/maps/pearl.png",
    Ascent: "/maps/ascent.png",
    Bind: "/maps/bind.png",
    Abyss: "/maps/abyss.png",
    Haven: "/maps/haven.png",
    Lotus: "/maps/lotus.png",
    Breeze: "/maps/breeze.png",
    Icebox: "/maps/icebox.png",
    Split: "/maps/split.png",
    Fracture: "/maps/fracture.png",
    Sunset: "/maps/sunset.png",
    Summit: "/maps/summit.png"
}

// 🔮 AGENTS ICONS
export const AGENT_FULL_ICONS: Record<string, string> = {
    Jett: "/pjs/jett.png",
    Reyna: "/pjs/reyna.png",
    Raze: "/pjs/raze.png",
    Iso: "/pjs/iso.png",
    Neon: "/pjs/neon.png",
    Phoenix: "/pjs/phoenix.png",
    Waylay: "/pjs/waylay.png",
    Yoru: "/pjs/yoru.png",
    Astra: "/pjs/astra.png",
    Viper: "/pjs/viper.png",
    Omen: "/pjs/omen.png",
    Brimstone:"/pjs/brimstone.png",
    Clove: "/pjs/clove.png",
    Miks: "/pjs/miks.png",
    Harbor: "/pjs/harbor.png",
    Fade: "/pjs/fade.png",
    Breach: "/pjs/breach.png",
    Skye: "/pjs/skye.png",
    Sova: "/pjs/sova.png",
    Kay0: "/pjs/kayo.png",
    Gekko: "/pjs/gekko.png",
    Tejo: "/pjs/tejo.png",
    Vyse: "/pjs/vyse.png",
    Chamber: "/pjs/chamber.png",
    Killjoy: "/pjs/killjoy.png",
    Veto: "/pjs/veto.png",
    Cypher: "/pjs/cypher.png",
    Deadlock: "/pjs/deadlock.png",
    Sage: "/pjs/sage.png"
}

// 🚀 LA FUNCIÓN QUE TE FALTA EXPORTAR AQUÍ:
export function getMapBackground(mapName: string): string {
    if (!mapName) return MAP_BACKGROUNDS.Pearl;
    // Formateamos la primera letra en mayúscula por si viene mal de la API
    const formattedName = mapName.trim().charAt(0).toUpperCase() + mapName.trim().slice(1).toLowerCase();
    return MAP_BACKGROUNDS[formattedName] || MAP_BACKGROUNDS.Pearl;
}

// 🧠 Helper generacion ruta Minimaps auto
export function getMapMinimap(mapName: string): string {
    if (!mapName) return "/maps/default_minimapa.png";
    const formattedName = mapName.toLowerCase().trim();
    return `/maps/${formattedName}_minimap.png`;
}