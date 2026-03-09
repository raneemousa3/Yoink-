"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LISTING_CATEGORIES } from "@/lib/types";

interface SearchBarProps {
  category?: string;
}

export function SearchBar({ category }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (cat === "All Items") next.delete("category");
    else next.set("category", cat);
    router.push(`/?${next.toString()}`);
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          🔍
        </span>
        <input
          type="search"
          placeholder="Search"
          className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
            !category || category === "All Items"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
          }`}
          onClick={() => setCategory("All Items")}
        >
          All Items
        </button>
        {LISTING_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              category === c
                ? "bg-zinc-900 text-white"
                : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
            }`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
