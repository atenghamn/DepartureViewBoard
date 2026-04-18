"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ONE_HOUR_MS = 60 * 60 * 1000;

export default function HourlyRefresh({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, ONE_HOUR_MS);
    return () => clearInterval(id);
  }, [router]);

  return <>{children}</>;
}
