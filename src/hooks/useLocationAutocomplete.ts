import { useState, useRef, useCallback, useEffect } from "react";
import { useMapbox } from "./useMapbox";

interface LocationSuggestion {
  center: [number, number];
  place_name: string;
  text: string;
  context?: Array<{
    id: string;
    text: string;
  }>;
}

interface UseLocationAutocompleteProps {
  onLocationSelect?: (
    coordinates: { lat: number; lng: number },
    address: string
  ) => void;
  debounceMs?: number;
  minQueryLength?: number;
}

export function useLocationAutocomplete({
  onLocationSelect,
  debounceMs = 300,
  minQueryLength = 3,
}: UseLocationAutocompleteProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    coordinates: { lat: number; lng: number };
    address: string;
  } | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { token: mapboxToken, isTokenValid } = useMapbox();

  // Search for address suggestions with debouncing
  const searchAddressSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < minQueryLength) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      if (!isTokenValid || !mapboxToken) {
        console.error("Invalid Mapbox token:", mapboxToken);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${mapboxToken}&limit=5&types=place,locality,neighborhood,address,poi`
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
      } finally {
        setIsLoading(false);
      }
    },
    [mapboxToken, isTokenValid, minQueryLength]
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
      }, debounceMs);
    },
    [searchAddressSuggestions, debounceMs]
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (suggestion: LocationSuggestion) => {
      const [lng, lat] = suggestion.center;
      const coordinates = { lat, lng };
      const address = suggestion.place_name;

      setSelectedLocation({ coordinates, address });
      setSearchQuery(address);
      setShowSuggestions(false);
      onLocationSelect?.(coordinates, address);
    },
    [onLocationSelect]
  );

  // Clear suggestions and search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedLocation(null);
  }, []);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchQuery,
    suggestions,
    showSuggestions,
    isLoading,
    selectedLocation,
    suggestionsRef,
    handleSearchInput,
    handleSuggestionSelect,
    clearSearch,
    setShowSuggestions,
  };
}
