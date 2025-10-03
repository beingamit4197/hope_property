import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, Bed, Bath, Square, MapPin, Navigation, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MobilePropertyCardProps {
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

export function MobilePropertyCard({ property, onViewDetails }: MobilePropertyCardProps) {
  const handleViewLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (property.latitude && property.longitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className="overflow-hidden bg-card rounded-3xl border-border shadow-lg active:scale-[0.98] transition-all duration-200"
      onClick={() => onViewDetails(property)}
    >
      <div className="flex gap-3 p-3">
        {/* Image Section - Left Side */}
        <div className="relative flex-shrink-0 w-32 h-32">
          <ImageWithFallback
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover rounded-2xl"
          />
          <button 
            className="absolute top-2 right-2 p-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg active:scale-90 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4 text-destructive" />
          </button>
          {property.featured && (
            <Badge className="absolute bottom-2 left-2 bg-warning text-warning-foreground shadow-lg rounded-full px-2 py-0.5 text-xs">
              Featured
            </Badge>
          )}
        </div>

        {/* Content Section - Right Side */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                {property.title}
              </h3>
              <Badge className="bg-primary/10 text-primary border-0 rounded-lg px-2 py-0.5 text-xs flex-shrink-0">
                {property.type}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground line-clamp-1">{property.location}</span>
            </div>

            <p className="text-lg font-bold text-primary mb-2">{property.price}</p>
          </div>

          {/* Stats & Action */}
          <div className="flex items-center justify-between gap-2">
            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="bg-accent/20 rounded-md p-1">
                  <Bed className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{property.beds}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-success/20 rounded-md p-1">
                  <Bath className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{property.baths}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-info/20 rounded-md p-1">
                  <Square className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{property.sqft}</span>
              </div>
            </div>

            {/* View Arrow */}
            <button className="bg-primary text-primary-foreground p-2 rounded-xl shadow-md active:scale-90 transition-transform">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
