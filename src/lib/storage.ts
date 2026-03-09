/**
 * Firebase Storage helpers for Yoink.
 */
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

const LISTING_PHOTOS_PREFIX = "listings";

/**
 * Upload a listing photo and return its download URL.
 * Call after creating the listing doc to get listingId.
 */
export async function uploadListingPhoto(
  file: File,
  listingId: string,
  index: number
): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not initialized");
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${LISTING_PHOTOS_PREFIX}/${listingId}/${index}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/**
 * Upload multiple photos for a listing. Returns array of download URLs.
 */
export async function uploadListingPhotos(
  files: File[],
  listingId: string
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadListingPhoto(files[i], listingId, i);
    urls.push(url);
  }
  return urls;
}
