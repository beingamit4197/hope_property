import React, { useRef, useState } from "react";
import { useMapbox, useMapboxMap, useMapboxMarkers } from "../hooks/useMapbox";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MapPin, Settings, RefreshCw } from "lucide-react";

// Sample property data
const sampleProperties = [
  {
    id: 1,
    title: "Modern Apartment in Downtown",
    location: "123 Main St, New York, NY",
    price: "$2,500/month",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: 2,
    title: "Cozy House with Garden",
    location: "456 Oak Ave, Brooklyn, NY",
    price: "$3,200/month",
    latitude: 40.6782,
    longitude: -73.9442,
  },
  {
    id: 3,
    title: "Luxury Penthouse",
    location: "789 Park Ave, Manhattan, NY",
    price: "$8,500/month",
    latitude: 40.7589,
    longitude: -73.9851,
  },
];

export function MapboxExample() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedStyle, setSelectedStyle] = useState(
    "mapbox://styles/mapbox/streets-v12"
  );
  const [showMarkers, setShowMarkers] = useState(true);

  // Get Mapbox configuration
  const {
    token,
    isTokenValid,
    isLoading: tokenLoading,
    error: tokenError,
    mapStyles,
    defaultStyle,
    defaultCenter,
    defaultZoom,
  } = useMapbox();

  // Initialize map
  const { map, isMapLoaded, mapError } = useMapboxMap(mapRef, {
    style: selectedStyle,
    center: defaultCenter,
    zoom: defaultZoom,
    onLoad: () => console.log("Map loaded successfully"),
    onError: (error) => console.error("Map error:", error),
  });

  // Add markers
  const { markers } = useMapboxMarkers(
    map,
    showMarkers ? sampleProperties : [],
    {
      onMarkerClick: (property) => {
        console.log("Clicked property:", property);
        alert(`Clicked: ${property.title}\nPrice: ${property.price}`);
      },
      showPopup: true,
    }
  );

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    if (map) {
      map.setStyle(style);
    }
  };

  const handleRefreshMap = () => {
    if (map) {
      map.resize();
    }
  };

  if (tokenLoading) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading Mapbox configuration...</p>
        </div>
      </Card>
    );
  }

  if (tokenError || !isTokenValid) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="bg-destructive/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Mapbox Configuration Error
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {tokenError ||
              "Invalid Mapbox token. Please check your configuration."}
          </p>
          <p className="text-xs text-muted-foreground">
            Token: {token ? `${token.substring(0, 20)}...` : "Not found"}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Map Controls</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Style:</label>
            <select
              value={selectedStyle}
              onChange={(e) => handleStyleChange(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              {Object.entries(mapStyles).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showMarkers"
              checked={showMarkers}
              onChange={(e) => setShowMarkers(e.target.checked)}
              className="rounded"
            />
            <label
              htmlFor="showMarkers"
              className="text-sm text-muted-foreground"
            >
              Show Markers
            </label>
          </div>

          <Button
            onClick={handleRefreshMap}
            variant="outline"
            size="sm"
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Map
          </Button>
        </div>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden">
        <div className="bg-card p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Interactive Map</h3>
              <p className="text-sm text-muted-foreground">
                {showMarkers
                  ? `${sampleProperties.length} properties`
                  : "No markers"}{" "}
                •{isMapLoaded ? " Ready" : " Loading..."}
              </p>
            </div>
          </div>
        </div>

        <div
          ref={mapRef}
          className="w-full h-[500px] relative"
          style={{ minHeight: "500px" }}
        />

        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 p-8">
            <div className="text-center max-w-md bg-card rounded-2xl p-8 shadow-lg">
              <div className="bg-destructive/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Map Error</h3>
              <p className="text-sm text-muted-foreground mb-4">{mapError}</p>
            </div>
          </div>
        )}

        {!isMapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
      </Card>

      {/* Property List */}
      {showMarkers && (
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">
            Sample Properties
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleProperties.map((property) => (
              <div
                key={property.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-foreground mb-2">
                  {property.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {property.location}
                </p>
                <p className="text-lg font-semibold text-primary">
                  {property.price}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Lat: {property.latitude.toFixed(4)}, Lng:{" "}
                  {property.longitude.toFixed(4)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Configuration Info */}
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-4">
          Configuration Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Token Status:</p>
            <p
              className={`font-medium ${
                isTokenValid ? "text-green-600" : "text-red-600"
              }`}
            >
              {isTokenValid ? "Valid" : "Invalid"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Map Status:</p>
            <p
              className={`font-medium ${
                isMapLoaded ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isMapLoaded ? "Loaded" : "Loading"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Style:</p>
            <p className="font-medium">{selectedStyle.split("/").pop()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Markers Count:</p>
            <p className="font-medium">{showMarkers ? markers.length : 0}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
