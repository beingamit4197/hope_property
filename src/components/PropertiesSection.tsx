import React, { useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { MobilePropertyCard } from "./MobilePropertyCard";
import { MobileFilters } from "./MobileFilters";
import { PropertyModal } from "./PropertyModal";
import { PropertiesMap } from "./PropertiesMap";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Search, Filter, Map } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Mock data for properties with coordinates
const mockProperties = [
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
    featured: true,
  },
  {
    id: 2,
    title: "Luxury Family Home",
    price: "₹8.5 Cr",
    location: "Whitefield, Bangalore",
    latitude: 12.9698,
    longitude: 77.7499,
    beds: 4,
    baths: 3,
    sqft: 2500,
    imageUrl:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    type: "House",
    featured: false,
  },
  {
    id: 3,
    title: "Cozy Townhouse",
    price: "₹2.8 Cr",
    location: "Sector 50, Gurgaon",
    latitude: 28.427,
    longitude: 77.0688,
    beds: 3,
    baths: 2,
    sqft: 1800,
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    type: "Townhouse",
    featured: false,
  },
  {
    id: 4,
    title: "Penthouse with City Views",
    price: "₹12 Cr",
    location: "Cuffe Parade, Mumbai",
    latitude: 18.9155,
    longitude: 72.814,
    beds: 3,
    baths: 3,
    sqft: 2200,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    type: "Condo",
    featured: true,
  },
  {
    id: 5,
    title: "Charming Villa",
    price: "₹1.8 Cr",
    location: "Lonavala, Pune",
    latitude: 18.7533,
    longitude: 73.4067,
    beds: 2,
    baths: 1,
    sqft: 1000,
    imageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
    type: "House",
    featured: false,
  },
  {
    id: 6,
    title: "Modern Loft",
    price: "₹4.2 Cr",
    location: "Koramangala, Bangalore",
    latitude: 12.9352,
    longitude: 77.6245,
    beds: 1,
    baths: 1,
    sqft: 900,
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    type: "Apartment",
    featured: false,
  },
];

export function PropertiesSection() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    priceRange: "all",
    beds: "all",
  });

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    let filtered = mockProperties;

    if (newFilters.search) {
      filtered = filtered.filter(
        (prop) =>
          prop.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
          prop.location.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }

    if (newFilters.type && newFilters.type !== "all") {
      filtered = filtered.filter((prop) => prop.type === newFilters.type);
    }

    if (newFilters.priceRange && newFilters.priceRange !== "all") {
      filtered = filtered.filter((prop) => {
        const price = parseFloat(prop.price.replace(/[₹,Cr]/g, ""));
        switch (newFilters.priceRange) {
          case "0-2cr":
            return price < 2;
          case "2cr-5cr":
            return price >= 2 && price < 5;
          case "5cr-10cr":
            return price >= 5 && price < 10;
          case "10cr+":
            return price >= 10;
          default:
            return true;
        }
      });
    }

    if (newFilters.beds && newFilters.beds !== "all") {
      filtered = filtered.filter(
        (prop) => prop.beds >= parseInt(newFilters.beds)
      );
    }

    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setFilters({ search: "", type: "all", priceRange: "all", beds: "all" });
    setFilteredProperties(mockProperties);
  };

  return (
    <section id="properties" className="py-6 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-foreground">
            Featured Properties
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto hidden md:block">
            Discover our handpicked selection of premium properties available
            for sale
          </p>
        </div>

        {/* Filters - Hidden on Mobile */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-8 border border-border hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search properties..."
                className="pl-10 rounded-xl bg-input-background"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange("priceRange", value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-2cr">Under ₹2 Cr</SelectItem>
                <SelectItem value="2cr-5cr">₹2 Cr - ₹5 Cr</SelectItem>
                <SelectItem value="5cr-10cr">₹5 Cr - ₹10 Cr</SelectItem>
                <SelectItem value="10cr+">₹10 Cr+</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.beds}
              onValueChange={(value) => handleFilterChange("beds", value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Bedrooms</SelectItem>
                <SelectItem value="1">1+ Beds</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Mobile Filters */}
        <MobileFilters
          filters={filters as any}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        {/* Tabs for Grid/Map View */}
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="grid" className="rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="map" className="rounded-xl">
              <Map className="h-4 w-4 mr-2" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-0">
            {/* Properties Grid - Desktop */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard
                  // key={property.id}
                  property={property}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Properties List - Mobile */}
            <div className="md:hidden flex flex-col gap-3">
              {filteredProperties.map((property) => (
                <MobilePropertyCard
                  // key={property.id}
                  property={property}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No properties found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-full"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <PropertiesMap
              properties={filteredProperties}
              onMarkerClick={handleViewDetails}
            />
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8"
          >
            View All Properties
          </Button>
        </div>
      </div>

      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
