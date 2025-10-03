import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-primary via-accent to-info text-white overflow-visible">
      <div className="absolute inset-0 bg-primary/80 -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(152,193,217,0.3),transparent_50%)] -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(201,184,224,0.3),transparent_50%)] -z-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 pb-32">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
            Find Your Dream Home
          </h1>
          <p className="text-xl lg:text-2xl mb-12 text-white/90">
            Discover the perfect property that matches your lifestyle and budget
          </p>
          
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Enter location..."
                  className="pl-10 text-foreground bg-input-background rounded-xl border-border"
                />
              </div>
              
              <Select>
                <SelectTrigger className="text-foreground rounded-xl">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="text-foreground rounded-xl">
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
              
              <Button className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}