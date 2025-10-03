import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "./ui/card";
import { MapPin } from "lucide-react";
import {
  getMapboxToken,
  isValidMapboxToken,
  MAPBOX_CONFIG,
} from "../lib/mapbox";

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  latitude: number;
  longitude: number;
}

interface PropertiesMapProps {
  properties: Property[];
  onMarkerClick?: (property: Property) => void;
}

export function PropertiesMap({
  properties,
  onMarkerClick,
}: PropertiesMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Get and validate Mapbox token
    const mapboxToken = getMapboxToken();
    if (!isValidMapboxToken(mapboxToken)) {
      setMapError(true);
      return;
    }

    // Initialize map
    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.DEFAULT_STYLE,
      center: MAPBOX_CONFIG.DEFAULT_CENTER,
      zoom: MAPBOX_CONFIG.DEFAULT_ZOOM,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add attribution control at bottom-right
    map.current.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      }),
      "bottom-right"
    );

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      // Clean up markers
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      // Clean up map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded || properties.length === 0) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Create bounds to fit all markers
    const bounds = new mapboxgl.LngLatBounds();

    // Add markers for each property
    properties.forEach((property) => {
      // Create custom marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.backgroundImage =
        "url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)";
      el.style.width = "32px";
      el.style.height = "40px";
      el.style.backgroundSize = "100%";
      el.style.cursor = "pointer";

      // Alternative: Use a colored dot marker
      const markerEl = document.createElement("div");
      markerEl.className = "property-marker";
      markerEl.style.width = `${MAPBOX_CONFIG.MARKER.SIZE}px`;
      markerEl.style.height = `${MAPBOX_CONFIG.MARKER.SIZE}px`;
      markerEl.style.borderRadius = "50%";
      markerEl.style.backgroundColor = MAPBOX_CONFIG.MARKER.COLOR;
      markerEl.style.border = `${MAPBOX_CONFIG.MARKER.BORDER_WIDTH}px solid ${MAPBOX_CONFIG.MARKER.BORDER_COLOR}`;
      markerEl.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      markerEl.style.cursor = "pointer";
      markerEl.style.transition = "all 0.3s ease";

      // Add hover effect
      markerEl.addEventListener("mouseenter", () => {
        markerEl.style.transform = "scale(1.2)";
        markerEl.style.backgroundColor = MAPBOX_CONFIG.MARKER.HOVER_COLOR;
      });

      markerEl.addEventListener("mouseleave", () => {
        markerEl.style.transform = "scale(1)";
        markerEl.style.backgroundColor = MAPBOX_CONFIG.MARKER.COLOR;
      });

      // Create popup content with INR formatting
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

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: "300px",
      }).setHTML(popupContent);

      // Create marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([property.longitude, property.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click event
      markerEl.addEventListener("click", () => {
        if (onMarkerClick) {
          onMarkerClick(property);
        }
      });

      markers.current.push(marker);

      // Extend bounds to include this marker
      bounds.extend([property.longitude, property.latitude]);
    });

    // Fit map to bounds with padding
    if (properties.length > 0) {
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: MAPBOX_CONFIG.MAX_ZOOM,
        duration: 1000,
      });
    }
  }, [properties, mapLoaded, onMarkerClick]);

  return (
    <Card className="overflow-hidden rounded-2xl border-border shadow-lg">
      <div className="bg-card p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Property Locations
            </h3>
            <p className="text-sm text-muted-foreground">
              {properties.length}{" "}
              {properties.length === 1 ? "property" : "properties"} on map
            </p>
          </div>
        </div>
      </div>
      <div
        ref={mapContainer}
        className="map-container w-full h-[500px]"
        style={{ position: "relative" }}
      />
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 p-8">
          <div className="text-center max-w-md bg-card rounded-2xl p-8 shadow-lg">
            <div className="bg-warning/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Mapbox Token Required
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              To display the interactive map, please configure your Mapbox
              access token.
            </p>
            <a
              href="/MAPBOX_SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              View Setup Instructions
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      )}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </Card>
  );
}
