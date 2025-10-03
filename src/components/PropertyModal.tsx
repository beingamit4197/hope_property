import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Bed, Bath, Square, MapPin, Calendar, Phone, Mail, Navigation } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PropertyModalProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyModal({ property, isOpen, onClose }: PropertyModalProps) {
  if (!property) return null;

  const handleViewLocation = () => {
    if (property.latitude && property.longitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-2xl rounded-t-3xl p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl text-foreground">{property.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ImageWithFallback
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-64 lg:h-80 object-cover rounded-2xl"
            />
            
            <div className="grid grid-cols-3 gap-3 mt-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"
                alt="Interior view"
                className="w-full h-20 object-cover rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400"
                alt="Kitchen view"
                className="w-full h-20 object-cover rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400"
                alt="Bathroom view"
                className="w-full h-20 object-cover rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-3xl font-bold text-primary">{property.price}</p>
                {property.featured && (
                  <Badge className="bg-warning text-warning-foreground rounded-full px-3 py-1">Featured</Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.location}</span>
                </div>
                {property.latitude && property.longitude && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary"
                    onClick={handleViewLocation}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    View Location
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-4 bg-accent/20 rounded-2xl hover:bg-accent/30 transition-colors duration-300">
                  <div className="bg-accent/40 rounded-xl p-2 inline-block mb-2">
                    <Bed className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{property.beds}</p>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                </div>
                <div className="text-center p-4 bg-success/20 rounded-2xl hover:bg-success/30 transition-colors duration-300">
                  <div className="bg-success/40 rounded-xl p-2 inline-block mb-2">
                    <Bath className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{property.baths}</p>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                </div>
                <div className="text-center p-4 bg-info/20 rounded-2xl hover:bg-info/30 transition-colors duration-300">
                  <div className="bg-info/40 rounded-xl p-2 inline-block mb-2">
                    <Square className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{property.sqft.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Sq Ft</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-foreground">Description</h3>
              <p className="text-muted-foreground">
                This beautiful {property.type.toLowerCase()} offers modern living with stunning views. 
                Features include updated kitchen, spacious bedrooms, and premium finishes throughout. 
                Located in a desirable neighborhood with easy access to schools, shopping, and dining.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <Phone className="h-4 w-4 mr-2" />
                Call Agent
              </Button>
              <Button variant="outline" className="w-full rounded-xl hover:bg-muted transition-all duration-300">
                <Mail className="h-4 w-4 mr-2" />
                Email Agent
              </Button>
              <Button variant="outline" className="w-full rounded-xl hover:bg-muted transition-all duration-300">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}