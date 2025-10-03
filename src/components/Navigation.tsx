import { Button } from "./ui/button";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { LoginModal } from "./LoginModal";
import { ListPropertyModal } from "./ListPropertyModal";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false);

  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">Hope Livings</h1>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#home"
                className="text-foreground hover:text-primary px-3 py-2 transition-all duration-300 hover:scale-105"
              >
                Home
              </a>
              <a
                href="#properties"
                className="text-foreground hover:text-primary px-3 py-2 transition-all duration-300 hover:scale-105"
              >
                Properties
              </a>
              <a
                href="#about"
                className="text-foreground hover:text-primary px-3 py-2 transition-all duration-300 hover:scale-105"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-foreground hover:text-primary px-3 py-2 transition-all duration-300 hover:scale-105"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            {isAuthenticated ? (
              <>
                <Button
                  className="mr-2 rounded-full"
                  onClick={() => setIsListPropertyOpen(true)}
                >
                  List Property
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full p-0 h-10 w-10"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-lg cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg cursor-pointer">
                      Saved Properties
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg cursor-pointer">
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                      onClick={() => {
                        logout();
                        toast.success("Logged out successfully");
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="mr-2 rounded-full"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Sign In
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => setIsListPropertyOpen(true)}
                >
                  List Property
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
            <a
              href="#home"
              className="block px-3 py-2 text-foreground hover:text-primary rounded-lg hover:bg-muted transition-all duration-300"
            >
              Home
            </a>
            <a
              href="#properties"
              className="block px-3 py-2 text-foreground hover:text-primary rounded-lg hover:bg-muted transition-all duration-300"
            >
              Properties
            </a>
            <a
              href="#about"
              className="block px-3 py-2 text-foreground hover:text-primary rounded-lg hover:bg-muted transition-all duration-300"
            >
              About
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-foreground hover:text-primary rounded-lg hover:bg-muted transition-all duration-300"
            >
              Contact
            </a>
            <div className="px-3 py-2 space-y-2">
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
              <Button
                className="w-full rounded-full"
                onClick={() => {
                  setIsListPropertyOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                List Property
              </Button>
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <ListPropertyModal
        isOpen={isListPropertyOpen}
        onClose={() => setIsListPropertyOpen(false)}
      />
    </nav>
  );
}
