import { Home, Search, Heart, User, Plus } from "lucide-react";

interface MobileBottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onListProperty: () => void;
}

export function MobileBottomNav({ activeView, onNavigate, onListProperty }: MobileBottomNavProps) {
  const handleNavClick = (view: string) => {
    onNavigate(view);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl">
      <div className="relative px-2 py-2">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
        
        <div className="relative flex items-center justify-around">
          {/* Home */}
          <button
            onClick={() => handleNavClick("home")}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 ${
              activeView === "home"
                ? "bg-primary text-primary-foreground scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className={`h-5 w-5 ${activeView === "home" ? "fill-current" : ""}`} />
            <span className="text-xs mt-1">Home</span>
          </button>

          {/* Search */}
          <button
            onClick={() => handleNavClick("search")}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 ${
              activeView === "search"
                ? "bg-primary text-primary-foreground scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className={`h-5 w-5 ${activeView === "search" ? "fill-current" : ""}`} />
            <span className="text-xs mt-1">Search</span>
          </button>

          {/* Add Property - Center Button */}
          <button
            onClick={onListProperty}
            className="flex flex-col items-center justify-center px-5 py-3 -mt-8 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-background"
          >
            <Plus className="h-6 w-6 stroke-[3]" />
            <span className="text-xs mt-1 font-semibold">List</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => handleNavClick("saved")}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 ${
              activeView === "saved"
                ? "bg-primary text-primary-foreground scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`h-5 w-5 ${activeView === "saved" ? "fill-current" : ""}`} />
            <span className="text-xs mt-1">Saved</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => handleNavClick("profile")}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 ${
              activeView === "profile"
                ? "bg-primary text-primary-foreground scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className={`h-5 w-5 ${activeView === "profile" ? "fill-current" : ""}`} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
