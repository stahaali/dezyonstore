"use client";

import { useEffect, useState } from "react";

/** Avoid hydration mismatch for localStorage/persisted store UI */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
