import type { Departure, DepartureResponse } from "@/types/departure";

function formatAlert(a: unknown): string {
  if (a === null || a === undefined) return "";
  if (typeof a === "string") return a;
  if (typeof a === "object" && a !== null) {
    const o = a as Record<string, unknown>;
    const header = o.header ?? o.title ?? o.summary;
    const desc = o.description ?? o.body ?? o.text;
    const parts = [header, desc].filter(
      (x) => typeof x === "string" && x.length > 0,
    ) as string[];
    if (parts.length) return parts.join(" — ");
  }
  try {
    return JSON.stringify(a);
  } catch {
    return String(a);
  }
}

function uniqueAlertStrings(alerts: unknown[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const a of alerts) {
    const s = formatAlert(a).trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function departureTime(d: Departure): number {
  const t = Date.parse(d.realtime) || Date.parse(d.scheduled);
  return Number.isFinite(t) ? t : 0;
}

function formatClock(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(t);
}

function formatDateTime(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(t);
}

export default function DepartureBoard({ data }: { data: DepartureResponse }) {
  const globalStopAlerts = uniqueAlertStrings(
    data.stops.flatMap((s) => s.alerts ?? []),
  );

  const sorted = [...data.departures].sort(
    (a, b) => departureTime(a) - departureTime(b),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 text-zinc-100">
      <header className="shrink-0 border-b border-zinc-700 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Departures
            </h1>
            <p className="mt-1 text-lg text-zinc-400">
              Data snapshot: {formatDateTime(data.timestamp)}
            </p>
          </div>
          <p className="text-base text-zinc-500">
            Board refreshes every hour
          </p>
        </div>
      </header>

      {globalStopAlerts.length > 0 && (
        <section
          className="shrink-0 rounded-lg border border-amber-600/50 bg-amber-950/40 px-4 py-3"
          aria-label="Service alerts"
        >
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-200">
            Alerts
          </h2>
          <ul className="list-inside list-disc space-y-1 font-mono text-sm text-amber-100">
            {globalStopAlerts.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-zinc-700">
        <table className="w-full border-collapse text-left text-base md:text-lg">
          <thead className="sticky top-0 z-10 bg-zinc-900 shadow-sm">
            <tr className="border-b border-zinc-600 text-sm uppercase tracking-wide text-zinc-400">
              <th className="px-3 py-3 md:px-4">When</th>
              <th className="px-3 py-3 md:px-4">Line</th>
              <th className="px-3 py-3 md:px-4">From / toward</th>
              <th className="px-3 py-3 md:px-4">Platform</th>
              <th className="px-3 py-3 md:px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, i) => {
              const rowAlertLines = uniqueAlertStrings(d.alerts ?? []);
              const delay = d.delay;
              const showDelay = delay !== 0;
              const cancelled = d.canceled;

              return (
                <tr
                  key={`${d.trip.trip_id}-${d.scheduled}-${i}`}
                  className={`border-b border-zinc-800 ${
                    cancelled
                      ? "bg-red-950/50 text-red-100"
                      : "odd:bg-zinc-900/50 even:bg-zinc-950/80"
                  }`}
                >
                  <td className="whitespace-nowrap px-3 py-3 align-top font-mono text-xl font-medium md:px-4 md:text-2xl">
                    {formatClock(d.realtime || d.scheduled)}
                    {showDelay && (
                      <span className="ml-2 text-base font-normal text-amber-300">
                        +{delay} min
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top md:px-4">
                    <div className="font-semibold">{d.route.name}</div>
                    <div className="text-sm text-zinc-400">
                      {d.route.transport_mode}
                      {d.route.direction ? ` · ${d.route.direction}` : ""}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top md:px-4">
                    <div className="font-medium">{d.stop.name}</div>
                    <div className="text-sm text-zinc-400">
                      {d.route.origin.name} → {d.route.destination.name}
                    </div>
                    {rowAlertLines.length > 0 && (
                      <ul className="mt-2 list-inside list-disc font-mono text-xs text-amber-200 md:text-sm">
                        {rowAlertLines.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 align-top font-mono text-xl md:px-4 md:text-2xl">
                    {d.realtime_platform?.designation ?? "—"}
                  </td>
                  <td className="px-3 py-3 align-top md:px-4">
                    {cancelled ? (
                      <span className="rounded-md bg-red-900 px-2 py-1 text-sm font-bold uppercase">
                        Cancelled
                      </span>
                    ) : (
                      <span className="text-zinc-500">Scheduled</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
