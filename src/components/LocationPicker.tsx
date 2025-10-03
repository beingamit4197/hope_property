import React, { useRef, useEffect, useState, useCallback } from "react";
import { useMapboxMap, useMapbox } from "../hooks/useMapbox";
import { MapPin, Navigation, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (
    coordinates: { lat: number; lng: number },
    address: string
  ) => void;
  initialLocation?: string;
  initialCoordinates?: { lat: number; lng: number };
  error?: string;
}

export function LocationPicker({
  onLocationSelect,
  initialLocation = "",
  initialCoordinates,
  error,
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(initialCoordinates || null);
  const [address, setAddress] = useState(initialLocation);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get Mapbox token and validation status
  const { token: mapboxToken, isTokenValid } = useMapbox();

  // Initialize map
  const {
    map,
    isMapLoaded: mapReady,
    mapError,
  } = useMapboxMap(mapRef, {
    center: initialCoordinates
      ? [initialCoordinates.lng, initialCoordinates.lat]
      : [-98.5795, 39.8283],
    zoom: initialCoordinates ? 15 : 3,
    onLoad: () => setIsMapLoaded(true),
    onError: (error) => console.error("Map error:", error),
  });

  // Add click handler to map
  useEffect(() => {
    if (!map || !isMapLoaded) return;

    const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      setSelectedCoordinates({ lat, lng });

      // Add marker to map
      await addMarker(lat, lng);

      // Reverse geocode to get address
      reverseGeocode(lat, lng);
    };

    map.on("click", handleMapClick);

    // Add initial marker if coordinates are provided
    if (initialCoordinates) {
      addMarker(initialCoordinates.lat, initialCoordinates.lng);
    }

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, isMapLoaded, initialCoordinates]);

  // Add marker to map
  const addMarker = async (lat: number, lng: number) => {
    if (!map) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll(".mapbox-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // Create custom marker element
    const markerEl = document.createElement("div");
    markerEl.className = "mapbox-marker";
    markerEl.innerHTML = `
      <div class="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <MapPin className="w-4 h-4 text-white" />
      </div>
    `;

    // Dynamically import mapboxgl to avoid UMD global issues
    const mapboxgl = (await import("mapbox-gl")).default;

    // Add marker to map
    new mapboxgl.Marker(markerEl).setLngLat([lng, lat]).addTo(map);

    // Center map on marker
    map.flyTo({ center: [lng, lat], zoom: 15 });
  };

  // Search for address suggestions with debouncing
  const searchAddressSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      if (!isTokenValid || !mapboxToken) {
        console.error("Invalid Mapbox token:", mapboxToken);
        return;
      }

      try {
        const token = mapboxToken;

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${token}&limit=5&types=place,locality,neighborhood,address,poi`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          setSuggestions(data.features);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Address search failed:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [mapboxToken, isTokenValid]
  );

  // Debounced search function
  const handleSearchInput = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for debounced search
      searchTimeoutRef.current = setTimeout(() => {
        searchAddressSuggestions(query);
      }, 300);
    },
    [searchAddressSuggestions]
  );

  // Reverse geocode coordinates to get address
  const reverseGeocode = async (lat: number, lng: number) => {
    if (!isTokenValid || !mapboxToken) {
      console.error("Invalid Mapbox token for reverse geocoding:", mapboxToken);
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=place,locality,neighborhood,address`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const address = feature.place_name;
        setAddress(address);
        setSearchQuery(address);
        onLocationSelect({ lat, lng }, address);
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      const coordsAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(coordsAddress);
      setSearchQuery(coordsAddress);
      onLocationSelect({ lat, lng }, coordsAddress);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Geocode address to get coordinates
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return;

    if (!isTokenValid || !mapboxToken) {
      console.error("Invalid Mapbox token for geocoding:", mapboxToken);
      return;
    }

    setIsGeocoding(true);
    setShowSuggestions(false);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxToken}&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        setSelectedCoordinates({ lat, lng });
        setAddress(feature.place_name);
        setSearchQuery(feature.place_name);
        await addMarker(lat, lng);
        onLocationSelect({ lat, lng }, feature.place_name);
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: any) => {
    const [lng, lat] = suggestion.center;
    setSelectedCoordinates({ lat, lng });
    setAddress(suggestion.place_name);
    setSearchQuery(suggestion.place_name);
    setShowSuggestions(false);
    await addMarker(lat, lng);
    onLocationSelect({ lat, lng }, suggestion.place_name);
  };

  // Clear suggestions
  const clearSuggestions = () => {
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedCoordinates({ lat: latitude, lng: longitude });
        await addMarker(latitude, longitude);
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Unable to retrieve your location. Please try again or search for an address."
        );
      }
    );
  };

  if (mapError) {
    return (
      <Card className="p-4">
        <div className="text-center text-destructive">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Failed to load map. Please check your internet connection.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address-search">
          Search Address <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              id="address-search"
              placeholder="Enter property address..."
              className="pl-10 pr-10 rounded-xl bg-input-background"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  geocodeAddress(searchQuery);
                }
              }}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              disabled={isGeocoding}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  clearSuggestions();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-muted focus:bg-muted focus:outline-none border-b border-border last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {suggestion.text}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {suggestion.place_name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            type="button"
            onClick={() => geocodeAddress(searchQuery)}
            disabled={isGeocoding || !searchQuery.trim()}
          >
            {isGeocoding ? "Searching..." : "Search"}
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          className="w-full"
          disabled={isGeocoding}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Select Location on Map</Label>
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-80 rounded-xl border border-border overflow-hidden"
            style={{ minHeight: "320px" }}
          />
          {!isMapLoaded && (
            <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Click on the map to select the exact property location
        </p>
      </div>

      {selectedCoordinates && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Location Selected
            </p>
            <p className="text-xs text-green-600 dark:text-green-300">
              {address ||
                `${selectedCoordinates.lat.toFixed(
                  6
                )}, ${selectedCoordinates.lng.toFixed(6)}`}
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
