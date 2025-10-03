// Firestore Collections and Document Types

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: "apartment" | "house" | "villa" | "commercial" | "land";
  status: "available" | "sold" | "rented" | "pending";
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: "sqft" | "sqm";
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  features: string[];
  amenities: string[];
  ownerId: string;
  agentId?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "agent" | "admin";
  isVerified: boolean;
  preferences: {
    propertyTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
    locations: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  savedAt: Date;
  notes?: string;
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  userId: string;
  agentId?: string;
  message: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  status: "pending" | "responded" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  userId: string;
  licenseNumber: string;
  company?: string;
  specialties: string[];
  rating: number;
  totalSales: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  agentId?: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  PROPERTIES: "properties",
  SAVED_PROPERTIES: "savedProperties",
  PROPERTY_INQUIRIES: "propertyInquiries",
  AGENTS: "agents",
  REVIEWS: "reviews",
} as const;

// Query helpers
export const createPropertyQuery = (filters: {
  propertyType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
}) => {
  const constraints = [];

  if (filters.propertyType) {
    constraints.push(where("propertyType", "==", filters.propertyType));
  }

  if (filters.status) {
    constraints.push(where("status", "==", filters.status));
  }

  if (filters.minPrice !== undefined) {
    constraints.push(where("price", ">=", filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    constraints.push(where("price", "<=", filters.maxPrice));
  }

  if (filters.city) {
    constraints.push(where("address.city", "==", filters.city));
  }

  if (filters.bedrooms !== undefined) {
    constraints.push(where("bedrooms", ">=", filters.bedrooms));
  }

  if (filters.bathrooms !== undefined) {
    constraints.push(where("bathrooms", ">=", filters.bathrooms));
  }

  constraints.push(where("isActive", "==", true));
  constraints.push(orderBy("createdAt", "desc"));

  return constraints;
};

export const createUserSavedPropertiesQuery = (userId: string) => {
  return [where("userId", "==", userId), orderBy("savedAt", "desc")];
};

export const createPropertyInquiriesQuery = (propertyId: string) => {
  return [where("propertyId", "==", propertyId), orderBy("createdAt", "desc")];
};
