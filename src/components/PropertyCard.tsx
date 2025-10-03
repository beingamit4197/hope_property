import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, Bed, Bath, Square, MapPin, Navigation } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: string;
    location: string;
    latitude?: number;
    longitude?: number;
    beds: number;
    baths: number;
    sqft: number;
    imageUrl: string;
    type: string;
    featured?: boolean;
  };
  onViewDetails: (property: any) => void;
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const handleViewLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (property.latitude && property.longitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-border bg-card rounded-2xl hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-2xl">
        <ImageWithFallback
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
          <Heart className="h-5 w-5 text-destructive" />
        </button>
        {property.featured && (
          <Badge className="absolute top-4 left-4 bg-warning text-warning-foreground shadow-lg rounded-full px-3 py-1">
            Featured
          </Badge>
        )}
        <Badge className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-foreground shadow-lg rounded-full px-3 py-1">
          {property.type}
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-foreground">{property.title}</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-muted-foreground flex-1">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="text-sm">{property.location}</span>
            </div>
            {property.latitude && property.longitude && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs hover:bg-primary/10 hover:text-primary rounded-lg"
                onClick={handleViewLocation}
                title="View on Google Maps"
              >
                <Navigation className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <p className="text-2xl font-bold text-primary">{property.price}</p>
        </div>
        
        <div className="flex items-center justify-between mb-5 text-muted-foreground bg-muted rounded-xl p-3">
          <div className="flex items-center">
            <div className="bg-accent/30 rounded-lg p-1.5 mr-1.5">
              <Bed className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-sm">{property.beds}</span>
          </div>
          <div className="flex items-center">
            <div className="bg-success/30 rounded-lg p-1.5 mr-1.5">
              <Bath className="h-4 w-4 text-success-foreground" />
            </div>
            <span className="text-sm">{property.baths}</span>
          </div>
          <div className="flex items-center">
            <div className="bg-info/30 rounded-lg p-1.5 mr-1.5">
              <Square className="h-4 w-4 text-info-foreground" />
            </div>
            <span className="text-sm">{property.sqft.toLocaleString()}</span>
          </div>
        </div>
        
        <Button 
          className="w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" 
          onClick={() => onViewDetails(property)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}