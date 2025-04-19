import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import StickFigure from "@/components/StickFigure";
import { getSessionId } from "@/utils/session";
import { apiFetch } from "@/utils/api";

type TransplantProblemProps = {
  restore?: "sacrifice" | "spare" | null;
};

export default function TransplantProblem({ restore = null }: TransplantProblemProps) {
  const [decision, setDecision] = useState<"sacrifice" | "spare" | null>(restore);
  const [responseId, setResponseId] = useState<number | null>(null);
  const [stats, setStats] = useState<{
    sacrifice: { percent: number; count: number };
    spare: { percent: number; count: number };
    total: number;
  } | null>(null);
  const [wasRestored, setWasRestored] = useState(!!restore);

  const sessionId = getSessionId();

  const loadStats = () => {
    apiFetch("/stats/transplant")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        console.log("Loaded transplant stats:", data);
      })
      .catch((err) => console.error("Failed to load stats", err));
  };

  const handleReset = () => {
    if (responseId) {
      apiFetch(`/response/${responseId}`, { method: "DELETE" })
        .then(() => console.log("Deleted response", responseId))
        .catch((err) => console.error("Failed to delete response", err));
    }
    setDecision(null);
    setResponseId(null);
    setStats(null);
    setWasRestored(false);
    loadStats(); // Fetch latest stats after reset
  };

  // User-initiated decision submission
  useEffect(() => {
    if (!decision || wasRestored) return;

    apiFetch("/submit/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario: "transplant",
        decision,
        session_id: sessionId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResponseId(data.id);
        console.log("Submitted response", data);
      })
      .catch((err) => console.error("Failed to submit response", err));

    loadStats();
  }, [decision]);

  // Restore prior state if provided
  useEffect(() => {
    if (!restore) return;
    console.log("Restoring transplant decision:", restore);

    setDecision(restore);
    setWasRestored(true);

    loadStats();

    apiFetch(`/last_decision/?scenario_name=transplant&session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.response_id) {
          setResponseId(data.response_id);
          console.log("Restored response ID:", data.response_id);
        }
      })
      .catch((err) => console.error("Failed to restore response ID", err));
  }, [restore]);

  return (
    <section className="h-screen w-full flex items-center justify-center scroll-snap-start bg-gray-50 p-4">
        <div className="max-w-3xl w-full text-center">
            <h2 className="text-3xl font-semibold mb-4">Scenario 2: The Transplant Problem</h2>
            <div className="space-y-4 text-black">
                <p>
                    You're an emergency room doctor treating <b>five patients</b> who each need a different organ transplant to survive.
                </p>

                {/* Five patients */}
                <svg viewBox="253.425 173.546 300 80" className="w-full h-[80px] mx-auto">
                    {[0, 1, 2, 3, 4].map((i) => (
                    <g key={i} transform={`translate(${i * 60}, 0)`}>
                        <StickFigure dead={decision === "spare"} />
                    </g>
                    ))}
                </svg>

                <p>
                    <b>One healthy person</b> walks in for a routine checkup. They are a perfect organ-donor match for all five of the other patients.
                </p>

                {/* Healthy person */}
                <svg viewBox="253.425 173.546 36.399 69.454" className="w-full h-[80px] mx-auto">
                    <StickFigure dead={decision === "sacrifice"} />
                </svg>

                <p>You can perform a fatal transplant operation on the healthy person, sacrificing them to save the five patients.</p>
                <p>What do you do?</p>

                <div className="space-x-2">
                    <Button onClick={() => setDecision("sacrifice")} disabled={decision !== null}>
                    Perform the Transplant Operation
                    </Button>
                    <Button onClick={() => setDecision("spare")} disabled={decision !== null}>
                    Do Nothing
                    </Button>
                    {decision && (
                    <Button variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                    )}
                </div>

                {stats && decision && (
                    <p>
                    You chose to <b>{decision === "sacrifice" ? "sacrifice the healthy person" : "do nothing"}</b>,
                    causing <b>{decision === "sacrifice" ? "1" : "5"} death{decision === "spare" ? "s" : ""}</b>.<br />
                    {decision === "sacrifice"
                        ? `${stats.sacrifice.percent}% of respondents made the same choice. ${100 - stats.sacrifice.percent}% disagreed. (${stats.total} total responses)`
                        : `${stats.spare.percent}% of respondents made the same choice. ${100 - stats.spare.percent}% disagreed. (${stats.total} total responses)`}
                    </p>
                )}
            </div>
        </div>
    </section>



  );
}
