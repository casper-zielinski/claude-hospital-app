"use client";

import { useEffect, useState } from "react";

/** Current time in ms, null until mounted (avoids server/client mismatch). */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [intervalMs]);
  return now;
}
