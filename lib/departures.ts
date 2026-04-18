import type { DepartureResponse } from "@/types/departure";

function apiBase(): string {
  const raw = process.env.DEPARTURE_API_URL ?? "http://localhost:5150";
  return raw.replace(/\/$/, "");
}

export async function fetchDepartureResponse(): Promise<DepartureResponse | null> {
  const url = `${apiBase()}/departure`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as DepartureResponse;
  } catch {
    return null;
  }
}
