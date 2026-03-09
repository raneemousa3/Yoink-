"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { ListingForm } from "@/components/listings/ListingForm";

export default function ListPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <main className="mx-auto max-w-lg px-4 py-8">
        <h1 className="text-xl font-bold text-zinc-900">List an Item</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Share what you have with your campus community
        </p>
        <div className="mt-6">
          <ListingForm />
        </div>
      </main>
      <BottomNav activeTab="list" />
    </div>
  );
}
