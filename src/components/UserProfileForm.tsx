import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../hooks/useAuth";
import { toast } from "sonner@2.0.3";
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  MapPin,
  DollarSign,
} from "lucide-react";

interface UserProfileFormProps {
  user: User;
  onUpdate?: (updatedUser: User) => void;
  isEditable?: boolean;
}

export function UserProfileForm({
  user,
  onUpdate,
  isEditable = true,
}: UserProfileFormProps) {
  const { updateProfile, updateUserPreferences } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    avatar: user.avatar || "",
  });
  const [preferences, setPreferences] = useState({
    propertyTypes: user.preferences.propertyTypes,
    priceRange: user.preferences.priceRange,
    locations: user.preferences.locations,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const propertyTypes = [
    "apartment",
    "house",
    "villa",
    "commercial",
    "land",
    "studio",
    "penthouse",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Update basic profile
      await updateProfile(formData);

      // Update preferences
      await updateUserPreferences(preferences);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      onUpdate?.(user);
    } catch (error: any) {
      toast.error("Failed to update profile", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
    setPreferences({
      propertyTypes: user.preferences.propertyTypes,
      priceRange: user.preferences.priceRange,
      locations: user.preferences.locations,
    });
    setErrors({});
    setIsEditing(false);
  };

  const togglePropertyType = (type: string) => {
    setPreferences((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const addLocation = (location: string) => {
    if (location.trim() && !preferences.locations.includes(location.trim())) {
      setPreferences((prev) => ({
        ...prev,
        locations: [...prev.locations, location.trim()],
      }));
    }
  };

  const removeLocation = (location: string) => {
    setPreferences((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l !== location),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Manage your personal information and account details
              </CardDescription>
            </div>
            {isEditable && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={!isEditing || loading}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={!isEditing || loading}
                  className={`pl-10 ${
                    errors.email ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  disabled={!isEditing || loading}
                  className={`pl-10 ${
                    errors.phone ? "border-destructive" : ""
                  }`}
                  placeholder="+91 98765 43210"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge
                  variant={
                    user.role === "admin"
                      ? "destructive"
                      : user.role === "agent"
                      ? "default"
                      : "secondary"
                  }
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                {user.isVerified && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Property Preferences
          </CardTitle>
          <CardDescription>
            Set your preferences to get better property recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Types */}
          <div className="space-y-3">
            <Label>Preferred Property Types</Label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <Button
                  key={type}
                  variant={
                    preferences.propertyTypes.includes(type)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => togglePropertyType(type)}
                  disabled={!isEditing || loading}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPrice">Minimum Price</Label>
                <Input
                  id="minPrice"
                  type="number"
                  value={preferences.priceRange.min}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      priceRange: {
                        ...prev.priceRange,
                        min: Number(e.target.value),
                      },
                    }))
                  }
                  disabled={!isEditing || loading}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Maximum Price</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  value={preferences.priceRange.max}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      priceRange: {
                        ...prev.priceRange,
                        max: Number(e.target.value),
                      },
                    }))
                  }
                  disabled={!isEditing || loading}
                  placeholder="1000000"
                />
              </div>
            </div>
          </div>

          {/* Preferred Locations */}
          <div className="space-y-3">
            <Label>Preferred Locations</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a location (e.g., Mumbai, Delhi)"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLocation(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
                disabled={!isEditing || loading}
              />
            </div>
            {preferences.locations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {preferences.locations.map((location, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {location}
                    {isEditing && (
                      <button
                        onClick={() => removeLocation(location)}
                        className="ml-1 hover:text-destructive"
                        disabled={loading}
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your account creation and last update information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <strong>Member since:</strong>{" "}
              {user.createdAt.toLocaleDateString()}
            </div>
            <div>
              <strong>Last updated:</strong>{" "}
              {user.updatedAt.toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
