import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigation } from "./components/Navigation";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { ListPropertyModal } from "./components/ListPropertyModal";
import { Toaster } from "./components/ui/sonner";

// Pages
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { SavedPage } from "./pages/SavedPage";
import { ProfilePage } from "./pages/ProfilePage";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState("home");
  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <HomePage />;
      case "search":
        return <SearchPage />;
      case "saved":
        return <SavedPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navigation />
      </div>
      
      {/* Main Content */}
      {renderContent()}
      
      {/* Contact & Footer - Only on Home */}
      {currentView === "home" && (
        <>
          <ContactSection />
          <Footer />
        </>
      )}
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeView={currentView}
        onNavigate={handleNavigate}
        onListProperty={() => setIsListPropertyOpen(true)}
      />
      
      {/* List Property Modal */}
      <ListPropertyModal 
        isOpen={isListPropertyOpen} 
        onClose={() => setIsListPropertyOpen(false)} 
      />
      
      <Toaster position="top-right" richColors />
    </div>
  );
}