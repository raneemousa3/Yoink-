import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getListingById } from "@/lib/listings";
import { BottomNav } from "@/components/layout/BottomNav";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const imageUrl = listing.photos?.[0];

  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <main className="mx-auto max-w-lg">
        <div className="relative aspect-[4/3] bg-zinc-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">
              📦
            </div>
          )}
        </div>
        <div className="px-4 py-6">
          <h1 className="text-xl font-bold text-zinc-900">{listing.title}</h1>
          <p className="mt-2 text-zinc-600">Rental Price: ${(listing.pricePerDay / 100).toFixed(0)}/day</p>
          {listing.deposit > 0 && (
            <p className="text-zinc-600">Deposit: ${(listing.deposit / 100).toFixed(2)}</p>
          )}
          <p className="mt-2 text-zinc-700">{listing.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-600">
            <span>📍 Pick up: {listing.pickupMethod}</span>
            <span>⭐ {(listing.averageRating ?? 0).toFixed(1)}</span>
            <span>🔄 Borrowed {listing.borrowCount} times</span>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <Link
              href="/"
              className="flex-1 rounded-lg border border-zinc-300 py-2 text-center text-sm font-medium"
            >
              Back to search
            </Link>
            <button
              type="button"
              className="flex-1 rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white"
            >
              Reserve (coming soon)
            </button>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
