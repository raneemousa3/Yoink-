"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  PICKUP_METHODS,
  type ListingCategory,
  type ListingCondition,
  type PickupMethod,
} from "@/lib/types";
import { createListing, updateListingPhotos } from "@/lib/listings";
import { uploadListingPhotos } from "@/lib/storage";
import { useAuth } from "@/components/providers/AuthProvider";

const MAX_PHOTOS = 5;

export function ListingForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ListingCategory | "">("");
  const [condition, setCondition] = useState<ListingCondition | "">("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [deposit, setDeposit] = useState("");
  const [pickupMethod, setPickupMethod] = useState<PickupMethod | "">("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotoFiles((prev) => [...prev, ...files].slice(0, MAX_PHOTOS));
  };

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Sign in to list an item");
      return;
    }

    if (!title.trim()) {
      setError("Item name is required");
      return;
    }
    if (!category || !condition || !pickupMethod) {
      setError("Please select category, condition, and pickup method");
      return;
    }

    const priceCents = Math.round(parseFloat(pricePerDay || "0") * 100);
    const depositCents = Math.round(parseFloat(deposit || "0") * 100);
    if (priceCents <= 0) {
      setError("Price per day is required");
      return;
    }

    setSubmitting(true);
    try {
      const input = {
        title: title.trim(),
        description: description.trim(),
        category: category as ListingCategory,
        condition: condition as ListingCondition,
        photos: [],
        pricePerDay: priceCents,
        deposit: depositCents,
        pickupMethod: pickupMethod as PickupMethod,
        status: "active" as const,
      };

      const listingId = await createListing(
        input,
        user.uid,
        user.displayName || user.email || "Anonymous",
        user.photoURL || undefined
      );

      if (photoFiles.length > 0) {
        const urls = await uploadListingPhotos(photoFiles, listingId);
        await updateListingPhotos(listingId, urls);
      }

      router.push(`/listings/${listingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-lg bg-amber-50 p-4">
        <p className="text-amber-800">Sign in to list an item.</p>
        <a
          href="/login"
          className="mt-2 inline-block text-sm font-medium text-amber-900 underline"
        >
          Sign in or create account →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Item name
        </label>
        <input
          type="text"
          placeholder="e.g. Winter coat, electric drill, textbook"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Description
        </label>
        <textarea
          placeholder="Describe your item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ListingCategory | "")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none"
          >
            <option value="">Select category</option>
            {LISTING_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Condition
          </label>
          <select
            value={condition}
            onChange={(e) =>
              setCondition(e.target.value as ListingCondition | "")
            }
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none"
          >
            <option value="">Select condition</option>
            {LISTING_CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Photos (up to {MAX_PHOTOS})
        </label>
        <p className="mb-2 text-xs text-zinc-500">
          Upload up to 5 photos to help others see your item
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="block w-full text-sm text-zinc-600"
        />
        {photoFiles.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {photoFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-1 rounded border bg-zinc-50 px-2 py-1 text-xs"
              >
                <span className="truncate max-w-[120px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="text-red-600 hover:underline"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Price per day ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Deposit ($, optional)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Pickup method
        </label>
        <select
          value={pickupMethod}
          onChange={(e) =>
            setPickupMethod(e.target.value as PickupMethod | "")
          }
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none"
        >
          <option value="">Select pickup method</option>
          {PICKUP_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-zinc-900 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "List Item"}
      </button>
    </form>
  );
}
