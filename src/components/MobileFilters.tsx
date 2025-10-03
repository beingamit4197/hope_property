import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { SlidersHorizontal, X, Search } from "lucide-react";

interface MobileFiltersProps {
  filters: {
    search: string;
    type: string;
    priceRange: string;
    beds: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  onFilterClick?: () => void;
}

export function MobileFilters({
  filters,
  onFilterChange,
  onClearFilters,
  onFilterClick,
}: MobileFiltersProps) {
  const categories = [
    { id: "all", label: "All", value: "all" },
    { id: "house", label: "Houses", value: "House" },
    { id: "apartment", label: "Apartments", value: "Apartment" },
    { id: "condo", label: "Condos", value: "Condo" },
    { id: "townhouse", label: "Townhouses", value: "Townhouse" },
  ];

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.priceRange !== "all" ||
    filters.beds !== "all" ||
    filters.search !== "";

  return (
    <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border pb-3 mb-4">
      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search properties..."
            className="pl-10 rounded-xl bg-input-background"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 no-scrollbar">
        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-full flex-shrink-0 h-9"
          onClick={onFilterClick}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full flex-shrink-0 h-9 text-muted-foreground hover:text-foreground"
            onClick={onClearFilters}
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}

        {/* Category Pills */}
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={filters.type === category.value ? "default" : "outline"}
            className={`rounded-full px-4 py-2 cursor-pointer flex-shrink-0 transition-all duration-200 ${
              filters.type === category.value
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
            onClick={() => onFilterChange("type", category.value)}
          >
            {category.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
