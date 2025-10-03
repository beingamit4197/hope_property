import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SlidersHorizontal } from "lucide-react";

interface MobileFiltersProps {
  onFilterClick?: () => void;
}

export function MobileFilters({ onFilterClick }: MobileFiltersProps) {
  const categories = [
    { id: "all", label: "All", active: true },
    { id: "house", label: "Houses", active: false },
    { id: "apartment", label: "Apartments", active: false },
    { id: "condo", label: "Condos", active: false },
  ];

  return (
    <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border pb-3 mb-4">
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

        {/* Category Pills */}
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={category.active ? "default" : "outline"}
            className={`rounded-full px-4 py-2 cursor-pointer flex-shrink-0 transition-all duration-200 ${
              category.active
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
          >
            {category.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
