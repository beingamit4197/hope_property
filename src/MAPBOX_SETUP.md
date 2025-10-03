# Mapbox Integration Setup

This project uses Mapbox GL JS to display property locations on an interactive map.

## Getting Your Mapbox Access Token

1. **Create a Mapbox Account**

   - Go to [https://www.mapbox.com/](https://www.mapbox.com/)
   - Sign up for a free account (free tier includes 50,000 map loads per month)

2. **Get Your Access Token**

   - After logging in, go to your [Account Dashboard](https://account.mapbox.com/)
   - Navigate to the "Access Tokens" section
   - Copy your default public token (starts with `pk.`)

3. **Add Token to Your Project**
   - The Mapbox token is now configured in `/src/lib/mapbox.ts`
   - The token is already set to: `pk.eyJ1IjoiZmVycm91c2Rlc2lnbmVyIiwiYSI6ImNtOWk0aG1iajBjbzAybXNqcXg4NHBuOHcifQ.lBacD_20jyvmO5ucakJH1g`
   - To use a different token, update the `ACCESS_TOKEN` in the configuration file

## New Implementation Features

### Configuration Management

- **Centralized Config**: All Mapbox settings in `/src/lib/mapbox.ts`
- **Token Validation**: Automatic validation of Mapbox tokens
- **Environment Support**: Support for environment variables
- **Type Safety**: Full TypeScript support with proper interfaces

### React Hooks

- **`useMapbox()`**: Main hook for Mapbox configuration and token management
- **`useMapboxMap()`**: Hook for map initialization and management
- **`useMapboxMarkers()`**: Hook for creating and managing map markers

### Usage Examples

#### Basic Map Setup

```typescript
import { useMapboxMap } from "./hooks/useMapbox";

function MyMapComponent() {
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

#### Map with Markers

```typescript
import { useMapboxMap, useMapboxMarkers } from "./hooks/useMapbox";

function PropertiesMap({ properties }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, isMapLoaded } = useMapboxMap(mapRef);

  const { markers } = useMapboxMarkers(map, properties, {
    onMarkerClick: (property) => console.log("Clicked:", property),
    showPopup: true,
  });

  return <div ref={mapRef} className="w-full h-96" />;
}
```

## Features Implemented

### Interactive Map View

- **Toggle View**: Switch between Grid and Map views using tabs
- **Auto-fit Bounds**: Map automatically zooms to display all property markers
- **Custom Markers**: Green circular markers with white borders matching the theme
- **Interactive Popups**: Click markers to see property details (name, location, price)
- **Responsive**: Map adjusts to different screen sizes
- **Navigation Controls**: Zoom in/out and rotate controls in top-right corner

### Property Cards

- **View Location Button**: Small navigation icon button next to property address
- **Google Maps Integration**: Opens property location in Google Maps (new tab)
- **Coordinates**: Each property has latitude and longitude data

### Property Modal

- **View Location Button**: Full button with icon and text
- **Google Maps Link**: Opens in new tab with property coordinates

## Map Customization

You can customize the map appearance in `/components/PropertiesMap.tsx`:

### Change Map Style

```typescript
style: "mapbox://styles/mapbox/streets-v12", // Default
// Other options:
// - "mapbox://styles/mapbox/light-v11"
// - "mapbox://styles/mapbox/dark-v11"
// - "mapbox://styles/mapbox/satellite-v9"
// - "mapbox://styles/mapbox/outdoors-v12"
```

### Customize Marker Color

```typescript
markerEl.style.backgroundColor = "#9DC183"; // Current theme color
```

### Adjust Default Zoom Level

```typescript
zoom: 3, // Lower = more zoomed out, Higher = more zoomed in
```

## Property Data Structure

Each property needs these fields for map integration:

```typescript
{
  id: number;
  title: string;
  location: string;
  latitude: number;   // Required for map
  longitude: number;  // Required for map
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  type: string;
  featured?: boolean;
}
```

## Google Maps Integration

The "View Location" button generates a Google Maps URL using:

```typescript
https://www.google.com/maps?q=LATITUDE,LONGITUDE
```

This opens the property location in:

- Google Maps app (on mobile devices)
- Google Maps website (on desktop)

## Troubleshooting

### Map Not Loading

- Check that your Mapbox token is correctly set
- Verify the token is a public token (starts with `pk.`)
- Check browser console for any errors

### Markers Not Appearing

- Verify all properties have valid `latitude` and `longitude` values
- Check that coordinates are in the correct format (decimal degrees)
- Latitude range: -90 to 90
- Longitude range: -180 to 180

### Popup Not Showing

- Click directly on the marker (not near it)
- Check browser console for JavaScript errors

## Additional Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Mapbox Examples](https://docs.mapbox.com/mapbox-gl-js/examples/)
- [Google Maps URL Parameters](https://developers.google.com/maps/documentation/urls/get-started)
