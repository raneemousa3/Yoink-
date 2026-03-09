"use client";

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";

interface ListingCardProps {
  listing: Listing;
}

function MapPinIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-zinc-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-amber-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.photos?.[0];
  const rating = listing.averageRating ?? 0;

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
        <div className="relative aspect-square bg-zinc-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              <span className="text-4xl">📦</span>
            </div>
          )}
        </div>
        <div className="p-2.5">
          <h3 className="line-clamp-2 text-sm font-medium text-zinc-900">
            {listing.title}
          </h3>
          <p className="mt-0.5 text-sm font-semibold text-zinc-900">
            ${(listing.pricePerDay / 100).toFixed(0)}/day
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-600">
            <span className="flex items-center gap-0.5">
              <StarIcon />
              {rating > 0 ? rating.toFixed(1) : "—"}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPinIcon />
              {listing.pickupMethod}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
