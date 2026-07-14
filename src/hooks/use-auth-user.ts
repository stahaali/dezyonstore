"use client";

import { useCallback, useEffect, useState } from "react";

export type AuthUserClient = {
  id: string;
  email: string;
  name: string | null;
  role: "CUSTOMER" | "ADMIN";
};

type AuthState = {
  user: AuthUserClient | null;
  loading: boolean;
  refresh: () => Promise<AuthUserClient | null>;
};

let cachedUser: AuthUserClient | null | undefined;
let inflight: Promise<AuthUserClient | null> | null = null;

async function fetchSessionUser(): Promise<AuthUserClient | null> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = (await res.json()) as { user?: AuthUserClient | null };
      cachedUser = data.user ?? null;
      return cachedUser;
    } catch {
      cachedUser = null;
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function invalidateAuthCache() {
  cachedUser = undefined;
}

export function useAuthUser(): AuthState {
  const [user, setUser] = useState<AuthUserClient | null>(
    cachedUser === undefined ? null : cachedUser,
  );
  const [loading, setLoading] = useState(cachedUser === undefined);

  const refresh = useCallback(async () => {
    setLoading(true);
    cachedUser = undefined;
    const next = await fetchSessionUser();
    setUser(next);
    setLoading(false);
    return next;
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (cachedUser !== undefined) {
        setUser(cachedUser);
        setLoading(false);
        return;
      }
      const next = await fetchSessionUser();
      if (!active) return;
      setUser(next);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { user, loading, refresh };
}
