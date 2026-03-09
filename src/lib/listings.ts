/**
 * Firestore helpers for listings.
 * Requires composite indexes in Firebase Console:
 * - listings: (status, createdAt)
 * - listings: (status, category, createdAt)
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Listing, ListingCreateInput } from "./types";

const LISTINGS_COLLECTION = "listings";

/**
 * Fetch active listings, optionally filtered by category.
 */
export async function getListings(category?: string): Promise<Listing[]> {
  if (!db) return [];
  const col = collection(db, LISTINGS_COLLECTION);
  let q = query(
    col,
    where("status", "==", "active"),
    orderBy("createdAt", "desc")
  );
  if (category && category !== "All Items") {
    q = query(q, where("category", "==", category));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Listing[];
}

/**
 * Create a new listing. Caller must be authenticated.
 */
export async function createListing(
  input: ListingCreateInput,
  ownerId: string,
  ownerName: string,
  ownerPhotoURL?: string
): Promise<string> {
  if (!db) throw new Error("Firebase not initialized");
  const doc = await addDoc(collection(db, LISTINGS_COLLECTION), {
    ...input,
    ownerId,
    ownerName,
    ownerPhotoURL: ownerPhotoURL ?? null,
    averageRating: null,
    borrowCount: 0,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return doc.id;
}

/**
 * Update listing photo URLs after upload. Call after creating listing + uploading.
 */
export async function updateListingPhotos(
  listingId: string,
  photos: string[]
): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");
  const docRef = doc(db, LISTINGS_COLLECTION, listingId);
  await updateDoc(docRef, { photos, updatedAt: serverTimestamp() });
}

/**
 * Fetch a single listing by ID.
 */
export async function getListingById(id: string): Promise<Listing | null> {
  if (!db) return null;
  const docRef = doc(db, LISTINGS_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { ...snap.data(), id: snap.id } as Listing;
}
