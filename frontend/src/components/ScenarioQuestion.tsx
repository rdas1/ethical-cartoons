import { useState } from "react";
import { apiFetch, submitResponse } from "@/utils/api";
import { getSessionId } from "@/utils/session";
import { Button } from "./ui/button";
import { useHomeworkContext } from "@/contexts/homeworkContext";
import { homeworkApi } from "@/api/homeworkApi";

type ScenarioQuestionProps = {
  scenarioName: string;
  title?: string | React.ReactNode;
  question: string | React.ReactNode;
  options: { label: string; value: string }[];
};

export default function ScenarioQuestion({ scenarioName, title, question, options }: ScenarioQuestionProps) {
  const sessionId = getSessionId();
  const { homeworkSession } = useHomeworkContext();
  const isHomework = !!homeworkSession?.homeworkSlug;

  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, { percent: number; count: number }> | null>(null);
  const [homeworkStats, setHomeworkStats] = useState<Record<string, { percent: number; count: number }> | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [homeworkTotal, setHomeworkTotal] = useState<number>(0);

  const loadStats = async () => {
    try {
      const res = await apiFetch(`/stats/${scenarioName}`);
      const data = await res.json();
      setStats(data);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to load public stats", err);
    }

    if (homeworkSession?.homeworkSlug) {
      try {
        const res = await homeworkApi.getHomeworkStatsForParticipant(homeworkSession.homeworkSlug);
        const data = await res.json();
        const scenarioStats = data.scenarios?.[scenarioName];

        if (scenarioStats) {
          const formatted: Record<string, { percent: number; count: number }> = {};
          for (const label of Object.keys(scenarioStats.options)) {
            formatted[label] = scenarioStats.options[label];
          }
          setHomeworkStats(formatted);
          setHomeworkTotal(scenarioStats.total_responses);
        }
      } catch (err) {
        console.error("Failed to load homework participant stats", err);
      }
    }
  };

  const handleClick = async (value: string) => {
    setSelected(value);

    await submitResponse({
      scenario: scenarioName,
      decision: value,
      sessionId,
      homeworkParticipantId: homeworkSession?.studentId || null,
    });

    await loadStats();
  };

  return (
    <div className="max-w-2xl w-full space-y-6 text-center">
      {title && (
        <h1 className="text-3xl font-semibold">{title}</h1>
      )}
      <h2 className="text-lg">{question}</h2>
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
          <p className="font-semibold">Public responses:</p>
          {options.map((opt) => (
            <p key={`public-${opt.value}`}>
              <b>{opt.label}:</b> {stats[opt.value]?.percent ?? 0}% ({stats[opt.value]?.count ?? 0} votes)
            </p>
          ))}
          <p className="text-xs text-gray-400">Total responses: {total}</p>

          {isHomework && homeworkStats && (
            <>
              <br />
              <p className="font-semibold">Your class responses:</p>
              {options.map((opt) => (
                <p key={`homework-${opt.value}`}>
                  <b>{opt.label}:</b> {homeworkStats[opt.label]?.percent ?? 0}% ({homeworkStats[opt.label]?.count ?? 0} votes)
                </p>
              ))}
              <p className="text-xs text-gray-400">Total class responses: {homeworkTotal}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
