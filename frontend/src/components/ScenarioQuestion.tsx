// src/components/ScenarioQuestion.tsx
import { useState } from "react";
import { apiFetch } from "@/utils/api";
import { getSessionId } from "@/utils/session";
import { Button } from "./ui/button";

type ScenarioQuestionProps = {
  scenarioName: string;
  title?: string | React.ReactNode;
  question: string | React.ReactNode;
  options: { label: string; value: string }[];
};

export default function ScenarioQuestion({ scenarioName, title, question, options }: ScenarioQuestionProps) {
  const sessionId = getSessionId();
  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, { percent: number; count: number }> | null>(null);
  const [total, setTotal] = useState<number>(0);

  const handleClick = async (value: string) => {
    setSelected(value);
    await apiFetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: scenarioName, decision: value, session_id: sessionId }),
    });
    const res = await apiFetch(`/stats/${scenarioName}`);
    const data = await res.json();
    setStats(data);
    setTotal(data.total);
  };

  return (
      <div className="max-w-2xl w-full space-y-6 text-center">
        {title && (
          <h1 className="text-3xl font-semibold">{title}</h1>
        )}
        <h2 className="text-2xl">{question}</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {options.map((opt) => (
            <Button
              key={opt.value}
              onClick={() => handleClick(opt.value)}
              disabled={!!selected}
              variant={selected === opt.value ? "default" : "outline"}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {stats && selected && (
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            {options.map((opt) => (
              <p key={opt.value}>
                <b>{opt.label}:</b> {stats[opt.value]?.percent ?? 0}% ({stats[opt.value]?.count ?? 0} votes)
              </p>
            ))}
            <p className="text-xs text-gray-400">Total responses: {total}</p>
          </div>
        )}
      </div>
  );
}
