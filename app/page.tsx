import DepartureBoard from "@/components/DepartureBoard";
import HourlyRefresh from "@/components/HourlyRefresh";
import { fetchDepartureResponse } from "@/lib/departures";

export default async function Home() {
  const data = await fetchDepartureResponse();

  return (
    <HourlyRefresh>
      <div className="flex min-h-screen flex-col bg-zinc-950 p-4 md:p-6">
        {!data ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-zinc-100">
            <h1 className="text-2xl font-semibold md:text-3xl">
              Could not load departures
            </h1>
            <p className="mt-3 max-w-md text-lg text-zinc-400">
              Check that the DepartureViewer API is running and{" "}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm">
                DEPARTURE_API_URL
              </code>{" "}
              points to it (default{" "}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm">
                http://localhost:5150
              </code>
              ).
            </p>
          </div>
        ) : (
          <DepartureBoard data={data} />
        )}
      </div>
    </HourlyRefresh>
  );
}
