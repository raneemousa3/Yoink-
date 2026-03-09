"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { BottomNav } from "@/components/layout/BottomNav";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 pb-16">
        <main className="mx-auto max-w-lg px-4 py-8">
          <h1 className="text-xl font-bold text-zinc-900">Profile</h1>
          <p className="mt-2 text-zinc-600">Sign in to view your profile.</p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Sign in
          </Link>
        </main>
        <BottomNav activeTab="profile" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <main className="mx-auto max-w-lg px-4 py-8">
        <h1 className="text-xl font-bold text-zinc-900">Profile</h1>
        <p className="mt-2 text-zinc-600">{user.email}</p>
        <p className="text-zinc-600">{user.displayName || "No name set"}</p>
        <button
          onClick={() => auth && signOut(auth)}
          className="mt-4 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
        >
          Sign out
        </button>
      </main>
      <BottomNav activeTab="profile" />
    </div>
  );
}
