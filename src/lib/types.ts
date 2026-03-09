/**
 * Yoink type definitions - aligned with Firestore schema.
 * Using literal union types for categories, conditions, etc.
 */
import type { Timestamp } from "firebase/firestore";

// --- Enums (as string literal unions) ---

export const LISTING_CATEGORIES = [
  "Clothing",
  "Tools",
  "Kitchen",
  "Books",
  "Furniture",
  "Outdoor gear",
  "Art supplies",
  "Electronics",
  "Freebies",
  "Other",
] as const;

export const LISTING_CONDITIONS = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Used",
] as const;

export const PICKUP_METHODS = ["Meetup", "Locker", "Delivery"] as const;

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];
export type ListingCondition = (typeof LISTING_CONDITIONS)[number];
export type PickupMethod = (typeof PICKUP_METHODS)[number];

// --- Firestore document types ---

export interface UserProfile {
  email: string;
  displayName: string;
  photoURL?: string;
  interests: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  totalItemsShared: number;
  totalCO2SavedLbs: number;
  totalMoneySaved: number;
}

export interface Listing {
  id?: string; // Not in Firestore doc; added when reading
  title: string;
  description: string;
  category: ListingCategory;
  condition: ListingCondition;
  photos: string[];
  pricePerDay: number; // cents
  deposit: number; // cents
  pickupMethod: PickupMethod;
  ownerId: string;
  ownerName: string;
  ownerPhotoURL?: string;
  averageRating?: number;
  borrowCount: number;
  status: "active" | "paused" | "deleted";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Shape for creating a new listing. Owner fields set server-side from auth. */
export interface ListingCreateInput
  extends Omit<
    Listing,
    | "ownerId"
    | "ownerName"
    | "ownerPhotoURL"
    | "averageRating"
    | "borrowCount"
    | "createdAt"
    | "updatedAt"
  > {}
