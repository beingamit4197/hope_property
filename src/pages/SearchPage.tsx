import { PropertiesSection } from "../components/PropertiesSection";

export function SearchPage() {
  return (
    <div className="pt-4 md:pt-0">
      <div className="md:hidden px-4 mb-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">Search Properties</h1>
        <p className="text-sm text-muted-foreground">
          Find your perfect home from our curated listings
        </p>
      </div>
      
      <PropertiesSection />
    </div>
  );
}
