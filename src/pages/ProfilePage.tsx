import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { LoginModal } from "../components/LoginModal";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Home as HomeIcon,
  Settings,
  Bell,
  Shield,
  LogOut,
  Edit2,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "../components/ui/separator";

export function ProfilePage() {
  const { user, isAuthenticated, logout, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: "Please try again later",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Welcome to Hope Livings
          </h2>
          <p className="text-muted-foreground mb-6">
            Sign in to access your profile and manage your properties
          </p>
          <Button
            className="rounded-full px-8"
            onClick={() => setIsLoginOpen(true)}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-6 border-border rounded-2xl overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-primary via-accent to-info"></div>
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-card">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 md:pb-4">
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {user?.name}
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>

              {/* Edit Button */}
              <div className="md:pb-4">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    className="rounded-full w-full md:w-auto"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || "",
                          email: user?.email || "",
                          phone: user?.phone || "",
                        });
                      }}
                      disabled={isSaving || loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="rounded-full"
                      onClick={handleSave}
                      disabled={isSaving || loading}
                    >
                      {isSaving ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <Card className="border-border rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-xs text-muted-foreground">Saved</p>
              </CardContent>
            </Card>

            <Card className="border-border rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="bg-accent/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <HomeIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Listed</p>
              </CardContent>
            </Card>

            <Card className="border-border rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="bg-success/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-xs text-muted-foreground">Searches</p>
              </CardContent>
            </Card>
          </div>

          {/* Personal Information */}
          <div className="md:col-span-2">
            <Card className="border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="rounded-xl bg-input-background"
                        disabled={isSaving || loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="rounded-xl bg-input-background"
                        disabled={isSaving || loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="rounded-xl bg-input-background"
                        disabled={isSaving || loading}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="bg-accent/20 p-3 rounded-xl">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Full Name
                        </p>
                        <p className="font-medium text-foreground">
                          {user?.name}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="bg-success/20 p-3 rounded-xl">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="bg-info/20 p-3 rounded-xl">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground">
                          {user?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Menu */}
          <div className="space-y-4">
            <Card className="border-border rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-xl hover:bg-muted"
                >
                  <Bell className="h-5 w-5 mr-3" />
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-xl hover:bg-muted"
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Privacy & Security
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-xl hover:bg-muted"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Preferences
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                  onClick={() => {
                    logout();
                    toast.success("Logged out successfully");
                  }}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
