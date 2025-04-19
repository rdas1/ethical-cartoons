import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import StickFigure from "@/components/StickFigure";
import { getSessionId } from "@/utils/session";

type TransplantProblemProps = {
  restore?: "sacrifice" | "spare" | null;
};

export default function TransplantProblem({ restore = null }: TransplantProblemProps) {
  const [decision, setDecision] = useState<null | "sacrifice" | "spare">(restore);
  const [responseId, setResponseId] = useState<number | null>(null);
  const [stats, setStats] = useState<{
    sacrifice: { percent: number; count: number };
    spare: { percent: number; count: number };
    total: number;
  } | null>(null);
  const [wasRestored, setWasRestored] = useState(!!restore);

  const sessionId = getSessionId();

  const handleReset = () => {
    if (responseId) {
      fetch(`/api/response/${responseId}`, { method: "DELETE" });
    }
    setDecision(null);
    setStats(null);
    setResponseId(null);
    setWasRestored(false);
  };

  // Handle fresh submission (user-initiated)
  useEffect(() => {
    if (!decision || wasRestored) return;

    fetch("/api/submit/", {
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
      });

    fetch(`/api/stats/transplant/`)
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [decision]);

  // Handle restore on mount
  useEffect(() => {
    if (!restore) return;
    setDecision(restore);
    setWasRestored(true);

    fetch(`/api/stats/transplant/`)
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch(`/api/last_decision/?scenario_name=transplant&session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.response_id) {
          setResponseId(data.response_id);
        }
      });
  }, [restore]);

  return (
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
  );
}
