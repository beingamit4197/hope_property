// Mapbox Configuration
export const MAPBOX_CONFIG = {
  // Mapbox access token - replace with your actual token
  ACCESS_TOKEN:
    "pk.eyJ1IjoiZmVycm91c2Rlc2lnbmVyIiwiYSI6ImNtOWk0aG1iajBjbzAybXNqcXg4NHBuOHcifQ.lBacD_20jyvmO5ucakJH1g",

  // Default map style
  DEFAULT_STYLE: "mapbox://styles/mapbox/streets-v12",

  // Alternative map styles
  STYLES: {
    STREETS: "mapbox://styles/mapbox/streets-v12",
    LIGHT: "mapbox://styles/mapbox/light-v11",
    DARK: "mapbox://styles/mapbox/dark-v11",
    SATELLITE: "mapbox://styles/mapbox/satellite-v9",
    OUTDOORS: "mapbox://styles/mapbox/outdoors-v12",
  },

  // Default map settings
  DEFAULT_CENTER: [-98.5795, 39.8283], // Center of US
  DEFAULT_ZOOM: 3,
  MAX_ZOOM: 12,

  // Marker settings
  MARKER: {
    SIZE: 30,
    COLOR: "#9DC183",
    BORDER_COLOR: "white",
    BORDER_WIDTH: 3,
    HOVER_COLOR: "#8AB172",
  },
} as const;

// Helper function to get Mapbox token
export function getMapboxToken(): string {
  // Check for Vite environment variable first (for production)
  if (
    typeof window !== "undefined" &&
    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  ) {
    return import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  }

  // Check for window environment variable (for production)
  if (
    typeof window !== "undefined" &&
    (window as any).env?.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  ) {
    return (window as any).env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  }

  // Fallback to config file
  return MAPBOX_CONFIG.ACCESS_TOKEN;
}

// Helper function to validate token
export function isValidMapboxToken(token: string): boolean {
  return token && token.startsWith("pk.") && !token.includes("example");
}
