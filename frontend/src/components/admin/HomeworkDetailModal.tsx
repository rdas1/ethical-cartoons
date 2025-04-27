import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { educatorApi } from "@/api/educatorApi";

export function HomeworkDetailModal({
  slug,
  open,
  onOpenChange,
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await educatorApi.getHomeworkStats(slug);
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setStats(data.scenarios);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchStats();
    }
  }, [slug, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assignment Response Details</DialogTitle>
          <DialogDescription>Response Statistics by Scenario</DialogDescription>
        </DialogHeader>

        {loading ? (
          <p>Loading...</p>
        ) : stats ? (
          Object.entries(stats).map(([scenarioName, scenarioStats]: any) => (
            <div key={scenarioName} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{scenarioName}</h3>
              {Object.entries(scenarioStats.options).length === 0 ? (
                <p className="text-gray-500">No responses yet</p>
              ) : (
                <ul className="list-disc ml-6">
                  {Object.entries(scenarioStats.options).map(([optionLabel, optionStats]: any) => (
                    <li key={optionLabel}>
                      {optionLabel}: {optionStats.count} responses ({optionStats.percent}%)
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Total responses: {scenarioStats.total_responses}
              </p>
            </div>
          ))
        ) : (
          <p>No stats available.</p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
              Close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
