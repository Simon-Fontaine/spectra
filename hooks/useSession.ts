"use client";

import type { SessionWithUser } from "@/types/models";
import { betterFetch } from "@better-fetch/fetch";
import useSWR from "swr";

async function fetchSession(): Promise<SessionWithUser | null> {
  const { data, error } = await betterFetch<{
    session: SessionWithUser | null;
  }>("/api/auth/session", {
    baseURL: window.location.origin,
    credentials: "include",
    method: "GET",
  });

  if (error) {
    throw new Error(error.message || "Failed to fetch session");
  }

  return data.session;
}

export function useSession() {
  const { data, error, isLoading } = useSWR("/api/auth/session", fetchSession);

  return {
    session: data ?? null,
    loading: isLoading,
    error,
  };
}
