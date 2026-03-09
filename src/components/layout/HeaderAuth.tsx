"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * Header link that shows "Sign in" when logged out, "Profile" when logged in.
 */
export function HeaderAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return <span className="text-sm text-zinc-400">...</span>;
  }

  if (user) {
    return (
      <Link
        href="/profile"
        className="text-sm font-medium text-zinc-600 hover:underline"
      >
        Profile
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm font-medium text-zinc-600 hover:underline"
    >
      Sign in
    </Link>
  );
}
