import { useState, useEffect, useCallback } from "react";
import {
  getMapboxToken,
  isValidMapboxToken,
  MAPBOX_CONFIG,
} from "../lib/mapbox";

export interface MapboxHookResult {
  token: string;
  isTokenValid: boolean;
  isLoading: boolean;
  error: string | null;
  mapStyles: typeof MAPBOX_CONFIG.STYLES;
  defaultStyle: string;
  defaultCenter: [number, number];
  defaultZoom: number;
  maxZoom: number;
  markerConfig: typeof MAPBOX_CONFIG.MARKER;
}

export function useMapbox(): MapboxHookResult {
  const [token, setToken] = useState<string>("");
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMapbox = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const mapboxToken = getMapboxToken();
        setToken(mapboxToken);

        if (isValidMapboxToken(mapboxToken)) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setError("Invalid Mapbox token. Please check your configuration.");
        }
      } catch (err) {
        setError("Failed to initialize Mapbox");
        setIsTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMapbox();
  }, []);

  const validateToken = useCallback((tokenToValidate: string): boolean => {
    return isValidMapboxToken(tokenToValidate);
  }, []);

  return {
    token,
    isTokenValid,
    isLoading,
    error,
    mapStyles: MAPBOX_CONFIG.STYLES,
    defaultStyle: MAPBOX_CONFIG.DEFAULT_STYLE,
    defaultCenter: MAPBOX_CONFIG.DEFAULT_CENTER,
    defaultZoom: MAPBOX_CONFIG.DEFAULT_ZOOM,
    maxZoom: MAPBOX_CONFIG.MAX_ZOOM,
    markerConfig: MAPBOX_CONFIG.MARKER,
    validateToken,
  };
}

// Hook for map initialization
export function useMapboxMap(
  containerRef: React.RefObject<HTMLDivElement>,
  options?: {
    style?: string;
    center?: [number, number];
    zoom?: number;
    onLoad?: () => void;
    onError?: (error: string) => void;
  }
) {
  const { token, isTokenValid, error: tokenError } = useMapbox();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !isTokenValid || map) return;

    const initializeMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const mapboxgl = (await import("mapbox-gl")).default;

        mapboxgl.accessToken = token;

        const mapInstance = new mapboxgl.Map({
          container: containerRef.current!,
          style: options?.style || MAPBOX_CONFIG.DEFAULT_STYLE,
          center: options?.center || MAPBOX_CONFIG.DEFAULT_CENTER,
          zoom: options?.zoom || MAPBOX_CONFIG.DEFAULT_ZOOM,
          attributionControl: false,
        });

        // Add navigation controls
        mapInstance.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Add attribution control
        mapInstance.addControl(
          new mapboxgl.AttributionControl({
            compact: true,
          }),
          "bottom-right"
        );

        mapInstance.on("load", () => {
          setIsMapLoaded(true);
          options?.onLoad?.();
        });

        mapInstance.on("error", (e) => {
          const errorMessage = `Map error: ${
            e.error?.message || "Unknown error"
          }`;
          setMapError(errorMessage);
          options?.onError?.(errorMessage);
        });

        setMap(mapInstance);
      } catch (err) {
        const errorMessage = `Failed to initialize map: ${err}`;
        setMapError(errorMessage);
        options?.onError?.(errorMessage);
      }
    };

    initializeMap();

    return () => {
      if (map) {
        map.remove();
        setMap(null);
        setIsMapLoaded(false);
      }
    };
  }, [
    containerRef,
    isTokenValid,
    token,
    options?.style,
    options?.center,
    options?.zoom,
  ]);

  return {
    map,
    isMapLoaded,
    mapError: mapError || tokenError,
    isTokenValid,
  };
}

// Hook for creating markers
export function useMapboxMarkers(
  map: mapboxgl.Map | null,
  properties: Array<{
    id: string | number;
    title: string;
    location: string;
    price: string;
    latitude: number;
    longitude: number;
  }>,
  options?: {
    onMarkerClick?: (property: any) => void;
    showPopup?: boolean;
    customMarker?: (property: any) => HTMLElement;
  }
) {
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map || !properties.length) {
      setMarkers([]);
      return;
    }

    // Clear existing markers
    markers.forEach((marker) => marker.remove());
    const newMarkers: mapboxgl.Marker[] = [];

    properties.forEach((property) => {
      let markerElement: HTMLElement;

      if (options?.customMarker) {
        markerElement = options.customMarker(property);
      } else {
        // Default marker
        markerElement = document.createElement("div");
        markerElement.className = "property-marker";
        markerElement.style.width = `${MAPBOX_CONFIG.MARKER.SIZE}px`;
        markerElement.style.height = `${MAPBOX_CONFIG.MARKER.SIZE}px`;
        markerElement.style.borderRadius = "50%";
        markerElement.style.backgroundColor = MAPBOX_CONFIG.MARKER.COLOR;
        markerElement.style.border = `${MAPBOX_CONFIG.MARKER.BORDER_WIDTH}px solid ${MAPBOX_CONFIG.MARKER.BORDER_COLOR}`;
        markerElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        markerElement.style.cursor = "pointer";
        markerElement.style.transition = "all 0.3s ease";

        // Hover effects
        markerElement.addEventListener("mouseenter", () => {
          markerElement.style.transform = "scale(1.2)";
          markerElement.style.backgroundColor =
            MAPBOX_CONFIG.MARKER.HOVER_COLOR;
        });

        markerElement.addEventListener("mouseleave", () => {
          markerElement.style.transform = "scale(1)";
          markerElement.style.backgroundColor = MAPBOX_CONFIG.MARKER.COLOR;
        });
      }

      // Create popup if enabled
      let popup: mapboxgl.Popup | undefined;
      if (options?.showPopup !== false) {
        const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #2C2C2C;">
              ${property.title}
            </h3>
            <div style="display: flex; align-items: start; gap: 6px; margin-bottom: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DC183" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p style="margin: 0; font-size: 14px; color: #7A7A7A; line-height: 1.4;">
                ${property.location}
              </p>
            </div>
            <p style="margin: 0; font-size: 18px; font-weight: 700; color: #9DC183;">
              ${property.price}
            </p>
          </div>
        `;

        popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          maxWidth: "300px",
        }).setHTML(popupContent);
      }

      // Create marker
      const marker = new mapboxgl.Marker(markerElement).setLngLat([
        property.longitude,
        property.latitude,
      ]);

      if (popup) {
        marker.setPopup(popup);
      }

      // Add click event
      markerElement.addEventListener("click", () => {
        options?.onMarkerClick?.(property);
      });

      marker.addTo(map);
      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit map to bounds
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      properties.forEach((property) => {
        bounds.extend([property.longitude, property.latitude]);
      });

      map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: MAPBOX_CONFIG.MAX_ZOOM,
        duration: 1000,
      });
    }

    return () => {
      newMarkers.forEach((marker) => marker.remove());
    };
  }, [
    map,
    properties,
    options?.onMarkerClick,
    options?.showPopup,
    options?.customMarker,
  ]);

  return { markers };
}
