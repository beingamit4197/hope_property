import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

export function MobileHeroSection() {
  return (
    <section className="md:hidden relative bg-primary text-white pt-4 pb-8 px-4">
      <div className="absolute inset-0 bg-primary/80 -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(152,193,217,0.3),transparent_50%)] -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(201,184,224,0.3),transparent_50%)] -z-10"></div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-white/80 mb-1">Welcome to</p>
            <h1 className="text-2xl font-bold drop-shadow-lg">Hope Livings</h1>
          </div>
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-lg">🏠</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-3 mb-3">
          <div className="relative mb-3">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search location..."
              className="pl-10 text-foreground bg-input-background rounded-xl border-border h-11"
            />
          </div>

          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="text-foreground rounded-xl flex-1 h-11">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-xl h-11 px-4">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold mb-1">50+</p>
            <p className="text-xs text-white/80">Properties</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold mb-1">30+</p>
            <p className="text-xs text-white/80">Locations</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold mb-1">100+</p>
            <p className="text-xs text-white/80">Happy Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
}
