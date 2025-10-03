import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LocationPicker } from "./LocationPicker";
import {
  Upload,
  Home,
  IndianRupee,
  MapPin,
  Bed,
  Bath,
  Square,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PropertyFormData {
  title: string;
  type: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  description: string;
  contactName: string;
  phone: string;
  email: string;
  notes: string;
  images: File[];
}

export function ListPropertyModal({ isOpen, onClose }: ListPropertyModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PropertyFormData, string>>
  >({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    type: "",
    location: "",
    latitude: undefined,
    longitude: undefined,
    price: "",
    beds: "",
    baths: "",
    sqft: "",
    description: "",
    contactName: "",
    phone: "",
    email: "",
    notes: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLocationSelect = (
    coordinates: { lat: number; lng: number },
    address: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      location: address,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    }));
    // Clear location error when location is selected
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + formData.images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Validate file sizes (max 10MB each)
    const invalidFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error("Some files are too large. Maximum size is 10MB per image.");
      return;
    }

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);

    toast.success(`${files.length} image(s) added successfully`);
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    toast.success("Image removed");
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof PropertyFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = "Property title is required";
    if (!formData.type) newErrors.type = "Property type is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.latitude || !formData.longitude) {
      newErrors.location = "Please select a location on the map";
    }
    if (!formData.price.trim()) newErrors.price = "Price is required";
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    if (!formData.beds.trim())
      newErrors.beds = "Number of bedrooms is required";
    else if (isNaN(Number(formData.beds)) || Number(formData.beds) < 0) {
      newErrors.beds = "Please enter a valid number";
    }
    if (!formData.baths.trim())
      newErrors.baths = "Number of bathrooms is required";
    else if (isNaN(Number(formData.baths)) || Number(formData.baths) < 0) {
      newErrors.baths = "Please enter a valid number";
    }
    if (!formData.sqft.trim()) newErrors.sqft = "Square footage is required";
    else if (isNaN(Number(formData.sqft)) || Number(formData.sqft) <= 0) {
      newErrors.sqft = "Please enter a valid square footage";
    }
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    else if (formData.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof PropertyFormData, string>> = {};

    if (!formData.contactName.trim())
      newErrors.contactName = "Your name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (
      !/^[\+]?[9][1][\s]?[6-9]\d{4}\s?\d{5}$/.test(formData.phone) &&
      !/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Please enter a valid Indian phone number";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (formData.images.length === 0) {
      toast.error("Please upload at least one image of your property");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      toast.success("Step 1 completed");
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would normally send the data to your backend
      console.log("Form submitted:", {
        ...formData,
        imageCount: formData.images.length,
      });

      toast.success("Property listed successfully!", {
        description:
          "Our team will review your listing and get back to you within 24 hours.",
        duration: 5000,
      });

      // Reset form and close modal
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Failed to submit property", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      location: "",
      price: "",
      beds: "",
      baths: "",
      sqft: "",
      description: "",
      contactName: "",
      phone: "",
      email: "",
      notes: "",
      images: [],
    });
    setImagePreviews([]);
    setErrors({});
    setStep(1);
  };

  const handleClose = () => {
    if (
      step > 1 ||
      Object.values(formData).some((val) =>
        typeof val === "string" ? val.trim() : val.length > 0
      )
    ) {
      if (
        confirm("Are you sure you want to close? Your progress will be lost.")
      ) {
        resetForm();
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            List Your Property
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Step {step} of 2:{" "}
            {step === 1 ? "Property Details" : "Contact & Images"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex gap-2">
              <div
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  step >= 1 ? "bg-primary" : "bg-muted"
                }`}
              ></div>
              <div
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  step >= 2 ? "bg-primary" : "bg-muted"
                }`}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                {/* Property Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Property Title <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      id="title"
                      placeholder="e.g., Modern Downtown Apartment"
                      className={`pl-10 rounded-xl bg-input-background ${
                        errors.title ? "border-destructive" : ""
                      }`}
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                  </div>
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">
                    Property Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger
                      className={`rounded-xl ${
                        errors.type ? "border-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.type}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={formData.location}
                    initialCoordinates={
                      formData.latitude && formData.longitude
                        ? { lat: formData.latitude, lng: formData.longitude }
                        : undefined
                    }
                    error={errors.location}
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price (in ₹) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-semibold">
                      ₹
                    </span>
                    <Input
                      id="price"
                      type="number"
                      placeholder="35000000"
                      className={`pl-8 rounded-xl bg-input-background ${
                        errors.price ? "border-destructive" : ""
                      }`}
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter amount in rupees (e.g., 35000000 for ₹3.5 Cr)
                  </p>
                  {errors.price && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Beds, Baths, Sqft */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="beds">
                      Bedrooms <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="beds"
                        type="number"
                        placeholder="2"
                        className={`pl-9 rounded-xl bg-input-background ${
                          errors.beds ? "border-destructive" : ""
                        }`}
                        value={formData.beds}
                        onChange={(e) =>
                          handleInputChange("beds", e.target.value)
                        }
                      />
                    </div>
                    {errors.beds && (
                      <p className="text-xs text-destructive">{errors.beds}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baths">
                      Bathrooms <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="baths"
                        type="number"
                        placeholder="2"
                        className={`pl-9 rounded-xl bg-input-background ${
                          errors.baths ? "border-destructive" : ""
                        }`}
                        value={formData.baths}
                        onChange={(e) =>
                          handleInputChange("baths", e.target.value)
                        }
                      />
                    </div>
                    {errors.baths && (
                      <p className="text-xs text-destructive">{errors.baths}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sqft">
                      Sq Ft <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="sqft"
                        type="number"
                        placeholder="1200"
                        className={`pl-9 rounded-xl bg-input-background ${
                          errors.sqft ? "border-destructive" : ""
                        }`}
                        value={formData.sqft}
                        onChange={(e) =>
                          handleInputChange("sqft", e.target.value)
                        }
                      />
                    </div>
                    {errors.sqft && (
                      <p className="text-xs text-destructive">{errors.sqft}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({formData.description.length}/50 min)
                    </span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, its features, and what makes it special..."
                    className={`min-h-32 rounded-xl bg-input-background ${
                      errors.description ? "border-destructive" : ""
                    }`}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">
                        Your Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contactName"
                        placeholder="John Doe"
                        className={`rounded-xl bg-input-background ${
                          errors.contactName ? "border-destructive" : ""
                        }`}
                        value={formData.contactName}
                        onChange={(e) =>
                          handleInputChange("contactName", e.target.value)
                        }
                      />
                      {errors.contactName && (
                        <p className="text-xs text-destructive">
                          {errors.contactName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className={`rounded-xl bg-input-background ${
                          errors.phone ? "border-destructive" : ""
                        }`}
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`rounded-xl bg-input-background ${
                        errors.email ? "border-destructive" : ""
                      }`}
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="images">
                    Property Images <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({formData.images.length}/10)
                    </span>
                  </Label>
                  <div
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors duration-300 cursor-pointer bg-muted/30"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB (Max 10 images)
                    </p>
                    <input
                      ref={fileInputRef}
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or notes for our team..."
                    className="min-h-24 rounded-xl bg-input-background"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 rounded-xl"
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              )}
              {step < 2 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Submit Property
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
