import { useState } from "react";
import { PropertyCard } from "../components/PropertyCard";
import { MobilePropertyCard } from "../components/MobilePropertyCard";
import { PropertyModal } from "../components/PropertyModal";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";

// Mock saved properties
const mockSavedProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: "₹3.5 Cr",
    location: "Bandra West, Mumbai",
    latitude: 19.0596,
    longitude: 72.8295,
    beds: 2,
    baths: 2,
    sqft: 1200,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    type: "Apartment",
    featured: true
  },
  {
    id: 4,
    title: "Penthouse with City Views",
    price: "₹12 Cr",
    location: "Cuffe Parade, Mumbai",
    latitude: 18.9155,
    longitude: 72.8140,
    beds: 3,
    baths: 3,
    sqft: 2200,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    type: "Condo",
    featured: true
  },
];

export function SavedPage() {
  const { isAuthenticated } = useAuth();
  const [savedProperties, setSavedProperties] = useState(isAuthenticated ? mockSavedProperties : []);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleRemove = (id: number) => {
    setSavedProperties(prev => prev.filter(p => p.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Save Your Favorites</h2>
          <p className="text-muted-foreground mb-6">
            Sign in to save properties and access them anytime
          </p>
          <Button className="rounded-full px-8">
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (savedProperties.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">No Saved Properties</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring and save properties you love to view them here
          </p>
          <Button className="rounded-full px-8" onClick={() => window.scrollTo(0, 0)}>
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Saved Properties</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedProperties.map((property) => (
            <div key={property.id} className="relative group">
              <PropertyCard
                property={property}
                onViewDetails={handleViewDetails}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                onClick={() => handleRemove(property.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Mobile List */}
        <div className="md:hidden flex flex-col gap-3">
          {savedProperties.map((property) => (
            <div key={property.id} className="relative">
              <MobilePropertyCard
                property={property}
                onViewDetails={handleViewDetails}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(property.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
