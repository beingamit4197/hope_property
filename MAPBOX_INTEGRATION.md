# Mapbox Integration Guide

This project now includes a comprehensive Mapbox integration with React hooks, TypeScript support, and easy-to-use components.

## 🚀 Quick Start

The Mapbox token is already configured and ready to use! The token `pk.eyJ1IjoiZmVycm91c2Rlc2lnbmVyIiwiYSI6ImNtOWk0aG1iajBjbzAybXNqcXg4NHBuOHcifQ.lBacD_20jyvmO5ucakJH1g` is set up in the configuration.

## 📁 File Structure

```
src/
├── lib/
│   └── mapbox.ts              # Mapbox configuration and utilities
├── hooks/
│   └── useMapbox.ts           # React hooks for Mapbox functionality
├── components/
│   └── PropertiesMap.tsx      # Updated map component
└── examples/
    └── MapboxExample.tsx      # Complete usage example
```

## 🔧 Configuration

### Mapbox Configuration (`src/lib/mapbox.ts`)

```typescript
export const MAPBOX_CONFIG = {
  ACCESS_TOKEN:
    "pk.eyJ1IjoiZmVycm91c2Rlc2lnbmVyIiwiYSI6ImNtOWk0aG1iajBjbzAybXNqcXg4NHBuOHcifQ.lBacD_20jyvmO5ucakJH1g",
  DEFAULT_STYLE: "mapbox://styles/mapbox/streets-v12",
  DEFAULT_CENTER: [-98.5795, 39.8283],
  DEFAULT_ZOOM: 3,
  // ... more configuration
};
```

### Available Map Styles

- **Streets**: `mapbox://styles/mapbox/streets-v12` (default)
- **Light**: `mapbox://styles/mapbox/light-v11`
- **Dark**: `mapbox://styles/mapbox/dark-v11`
- **Satellite**: `mapbox://styles/mapbox/satellite-v9`
- **Outdoors**: `mapbox://styles/mapbox/outdoors-v12`

## 🎣 React Hooks

### `useMapbox()` - Main Configuration Hook

```typescript
import { useMapbox } from "./hooks/useMapbox";

function MyComponent() {
  const {
    token,
    isTokenValid,
    isLoading,
    error,
    mapStyles,
    defaultStyle,
    defaultCenter,
    defaultZoom,
  } = useMapbox();

  if (isLoading) return <div>Loading...</div>;
  if (!isTokenValid) return <div>Invalid token</div>;

  return <div>Mapbox is ready!</div>;
}
```

### `useMapboxMap()` - Map Initialization Hook

```typescript
import { useMapboxMap } from "./hooks/useMapbox";

function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);

  const { map, isMapLoaded, mapError } = useMapboxMap(mapRef, {
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-74.5, 40],
    zoom: 9,
    onLoad: () => console.log("Map loaded"),
    onError: (error) => console.error("Map error:", error),
  });

  return <div ref={mapRef} className="w-full h-96" />;
}
```

### `useMapboxMarkers()` - Markers Management Hook

```typescript
import { useMapboxMarkers } from "./hooks/useMapbox";

function PropertiesMap({ properties }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map } = useMapboxMap(mapRef);

  const { markers } = useMapboxMarkers(map, properties, {
    onMarkerClick: (property) => console.log("Clicked:", property),
    showPopup: true,
    customMarker: (property) => createCustomMarker(property),
  });

  return <div ref={mapRef} className="w-full h-96" />;
}
```

## 🗺️ Usage Examples

### Basic Map Component

```typescript
import React, { useRef } from "react";
import { useMapboxMap } from "./hooks/useMapbox";

export function BasicMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, isMapLoaded, mapError } = useMapboxMap(mapRef);

  return (
    <div className="w-full h-96 relative">
      <div ref={mapRef} className="w-full h-full" />
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100">
          <p className="text-red-600">Map Error: {mapError}</p>
        </div>
      )}
    </div>
  );
}
```

### Properties Map with Markers

```typescript
import React, { useRef } from "react";
import { useMapboxMap, useMapboxMarkers } from "./hooks/useMapbox";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  latitude: number;
  longitude: number;
}

export function PropertiesMap({ properties }: { properties: Property[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, isMapLoaded } = useMapboxMap(mapRef);

  const { markers } = useMapboxMarkers(map, properties, {
    onMarkerClick: (property) => {
      alert(`Clicked: ${property.title}\nPrice: ${property.price}`);
    },
    showPopup: true,
  });

  return (
    <div className="w-full h-96 relative">
      <div ref={mapRef} className="w-full h-full" />
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p>Loading map...</p>
        </div>
      )}
    </div>
  );
}
```

### Custom Marker Example

```typescript
function createCustomMarker(property: Property): HTMLElement {
  const markerEl = document.createElement("div");
  markerEl.className = "custom-property-marker";
  markerEl.innerHTML = `
    <div class="marker-content">
      <div class="marker-icon">🏠</div>
      <div class="marker-price">${property.price}</div>
    </div>
  `;

  // Add custom styles
  markerEl.style.cssText = `
    width: 60px;
    height: 60px;
    background: white;
    border: 2px solid #9DC183;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    cursor: pointer;
  `;

  return markerEl;
}

// Use in component
const { markers } = useMapboxMarkers(map, properties, {
  customMarker: createCustomMarker,
});
```

## 🎨 Styling and Customization

### Marker Styling

The default markers can be customized in `src/lib/mapbox.ts`:

```typescript
MARKER: {
  SIZE: 30,
  COLOR: "#9DC183",
  BORDER_COLOR: "white",
  BORDER_WIDTH: 3,
  HOVER_COLOR: "#8AB172",
}
```

### Map Styles

Change the map style dynamically:

```typescript
const { mapStyles } = useMapbox();

// Change style
map.setStyle(mapStyles.DARK);
map.setStyle(mapStyles.SATELLITE);
```

## 🔍 Property Data Structure

For the map to work properly, your property objects should have this structure:

```typescript
interface Property {
  id: string | number;
  title: string;
  location: string;
  price: string;
  latitude: number; // Required for map positioning
  longitude: number; // Required for map positioning
}
```

## 🚨 Error Handling

The hooks include comprehensive error handling:

```typescript
const { map, isMapLoaded, mapError } = useMapboxMap(mapRef, {
  onError: (error) => {
    console.error("Map initialization failed:", error);
    // Handle error (show notification, fallback UI, etc.)
  },
});

if (mapError) {
  return <div>Error: {mapError}</div>;
}
```

## 🧪 Testing

See `src/examples/MapboxExample.tsx` for a complete working example that demonstrates:

- Map initialization
- Style switching
- Marker management
- Error handling
- Interactive features

## 🔧 Troubleshooting

### Map Not Loading

1. Check that the Mapbox token is valid
2. Verify the token starts with `pk.`
3. Check browser console for errors
4. Ensure the container element has proper dimensions

### Markers Not Appearing

1. Verify properties have valid `latitude` and `longitude`
2. Check that coordinates are in decimal degrees format
3. Ensure the map is loaded before adding markers

### Performance Issues

1. Limit the number of markers displayed at once
2. Use clustering for large datasets
3. Implement marker filtering based on zoom level

## 📚 Additional Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Examples](https://docs.mapbox.com/mapbox-gl-js/examples/)
- [Mapbox Style Reference](https://docs.mapbox.com/mapbox-gl-js/style-spec/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)

## 🎯 Next Steps

1. **Customize Markers**: Create custom marker designs for different property types
2. **Add Clustering**: Implement marker clustering for better performance with many properties
3. **Geocoding**: Add address search and geocoding functionality
4. **Directions**: Integrate routing and directions between properties
5. **Heatmaps**: Add heatmap visualization for property density
6. **3D Buildings**: Enable 3D building visualization for urban areas
