// types/index.ts
export interface User {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  phone: string;
  role: "admin" | "buyer" | "seller" | "tenant";
  isVerified: boolean;
  nidNumber?: string;
  nidImage?: string;
  profileImage?: string;
  warnings: Warning[];
  isBanned: boolean;
  createdAt: Date;
}

export interface FlatListing {
  _id: string;
  title: string;
  description: string;
  type: "sale" | "rent" | "bachelor";
  isPremium: boolean;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    area: string;
    city: string;
    coordinates?: [number, number];
  };
  images: string[];
  amenities: string[];
  ownerId: string;
  owner: User;
  isActive: boolean;
  isSold: boolean;
  views: number;
  createdAt: Date;
}

export interface Booking {
  _id: string;
  listingId: string;
  listing: FlatListing;
  buyerId: string;
  buyer: User;
  visitDate: Date;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  paymentAmount: number;
  paymentReference?: string;
  createdAt: Date;
}

export interface Warning {
  type: "yellow" | "red";
  reason: string;
  date: Date;
}

export interface Complaint {
  _id: string;
  complainantId: string;
  complainant: User;
  targetId: string;
  target: User;
  listingId?: string;
  reason: string;
  description: string;
  evidence?: string[];
  status: "pending" | "resolved" | "dismissed";
  adminNotes?: string;
  createdAt: Date;
}

export interface Payment {
  _id: string;
  userId: string;
  type: "listing" | "appointment" | "sponsorship";
  amount: number;
  method: "bkash" | "nagad" | "rocket" | "bank";
  reference: string;
  receiptImage?: string;
  status: "pending" | "verified" | "rejected";
  createdAt: Date;
}
