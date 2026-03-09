import Link from "next/link";
import { Suspense } from "react";
import { getListings } from "@/lib/listings";
import { ListingCard } from "@/components/listings/ListingCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeaderAuth } from "@/components/layout/HeaderAuth";
import { SearchBar } from "@/components/listings/SearchBar";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { category } = await searchParams;
  const listings = await getListings(category);

  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <main className="mx-auto max-w-3xl px-4 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">Yoink!</h1>
          <HeaderAuth />
        </div>
        <Suspense fallback={<div className="h-20 animate-pulse rounded bg-zinc-200" />}>
          <SearchBar category={category} />
        </Suspense>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4">
          {listings.length === 0 ? (
            <div className="col-span-2 rounded-lg border-2 border-dashed border-zinc-200 bg-white p-8 text-center text-zinc-500">
              <p>No listings yet. Be the first to list an item!</p>
              <Link
                href="/list"
                className="mt-2 inline-block text-sm font-medium text-zinc-900 underline"
              >
                List an item →
              </Link>
            </div>
          ) : (
            listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          )}
        </div>
      </main>
      <BottomNav activeTab="search" />
    </div>
  );
}
