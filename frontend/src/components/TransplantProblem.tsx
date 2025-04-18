import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import StickFigure from "@/components/StickFigure";

export default function TransplantProblem() {
    const [decision, setDecision] = useState<null | "sacrifice" | "spare">(null);
    const [responseId, setResponseId] = useState<number | null>(null);
    const [stats, setStats] = useState<{
        sacrifice: { percent: number; count: number };
        spare: { percent: number; count: number };
        total: number;
      } | null>(null);
    
    const handleReset = () => {
        if (responseId) {
            fetch(`/api/response/${responseId}`, { method: "DELETE" });
        }
        setDecision(null);
        setStats(null);
        setResponseId(null);
    };

    useEffect(() => {
        if (!decision) return;
      
        fetch("/api/submit/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario: "transplant", decision }),
        })
          .then(res => res.json())
          .then(data => {
            setResponseId(data.id); // store response ID
          });
      
        fetch(`/api/stats/transplant/`)
          .then(res => res.json())
          .then(data => {
            setStats(data);
          });
      }, [decision]);      

    return (
    <div className={"space-y-4 text-black"}>
        <p>
            You're an emergency room doctor treating <b>five patients</b> who each need a different organ transplant to survive.
        </p>
        {/* Render five-people SVGs here */}
        <svg viewBox="253.425 173.546 300 80" className="w-full h-[80px] mx-auto">
        {[0, 1, 2, 3, 4].map((i) =>
          <g key={i} transform={`translate(${i * 60}, 0)`}>
            <StickFigure dead={decision === "spare"} />
          </g>
        )}
      </svg>

        <p>
            <b>One healthy person</b> walks in for a routine checkup. They are perfect organ-donor match for all five of the other patients.
        </p>
        {/* Render one-person SVG or tombstone here */}
        <svg viewBox="253.425 173.546 36.399 69.454" className="w-full h-[80px] mx-auto">
            <StickFigure dead={decision === "sacrifice"} />
        </svg>
        <p>
            You can perform a transplant operation on the healthy person, sacrificing their life to save the five patients.
        </p>
        <p>
            What do you do?
        </p>
        <div className="space-x-2">
                <Button onClick={() => setDecision('sacrifice')} disabled={decision !== null}>
                    Perform the Transplant Operation
                </Button>
                <Button onClick={() => setDecision('spare')} disabled={decision !== null}>
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
                You chose to {decision === "sacrifice" ? "sacrifice the healthy person" : "do nothing"},
                causing {decision === "sacrifice" ? "1" : "5"} death{decision === "spare" ? "s" : ""}.<br />
                {decision === "sacrifice"
                ? `${stats.sacrifice.percent}% out of ${stats.total} respondents made the same choice (${stats.sacrifice.count} votes).`
                : `${stats.spare.percent}% of respondents made the same choice (${stats.spare.count} votes).`}
                <br />
            </p>
        )}
    </div>

    )

}