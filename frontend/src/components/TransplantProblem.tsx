import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import StickFigure from "@/components/StickFigure";
import { getSessionId } from "@/utils/session";
import { apiFetch, submitResponse } from "@/utils/api";
import { useHomeworkContext } from "@/contexts/homeworkContext";
import { homeworkApi } from "@/api/homeworkApi";

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

  const [homeworkStats, setHomeworkStats] = useState<{
    sacrifice: { percent: number; count: number };
    spare: { percent: number; count: number };
    total: number;
  } | null>(null);

  const [wasRestored, setWasRestored] = useState(!!restore);

  const sessionId = getSessionId();
  const { homeworkSession } = useHomeworkContext();
  const isHomework = !!homeworkSession?.homeworkSlug;

  const loadStats = () => {
    apiFetch("/stats/transplant")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        console.log("Loaded transplant public stats:", data);
      })
      .catch((err) => console.error("Failed to load public stats", err));

    if (homeworkSession?.homeworkSlug) {
      homeworkApi.getHomeworkStatsForParticipant(homeworkSession.homeworkSlug)
        .then((res) => res.json())
        .then((data) => {
          const scenarioStats = data.scenarios?.transplant;
          if (scenarioStats) {
            setHomeworkStats({
              sacrifice: scenarioStats.options?.["Perform the Operation"] || { percent: 0, count: 0 },
              spare: scenarioStats.options?.["Do Nothing"] || { percent: 0, count: 0 },
              total: scenarioStats.total_responses || 0,
            });
          }
          console.log("Loaded transplant homework stats:", data);
        })
        .catch((err) => console.error("Failed to load homework participant stats", err));
    }
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
    setHomeworkStats(null);
    setWasRestored(false);
    loadStats();
  };

  useEffect(() => {
    if (!decision || wasRestored) return;

    submitResponse({
      scenario: "transplant",
      decision,
      sessionId,
      homeworkParticipantId: homeworkSession?.studentId || null,
    })
      .then((res) => res.json())
      .then((data) => {
        setResponseId(data.id);
        console.log("Submitted response", data);
        loadStats();
      })
      .catch((err) => console.error("Failed to submit response", err));
  }, [decision]);

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
    <section className="h-screen w-full flex items-center justify-center scroll-snap-start bg-gray-50 my-6">
      <div className="max-w-3xl w-full text-center">
        <h2 className="text-3xl font-semibold mb-4">Scenario 2: The Transplant Problem</h2>
        <div className="space-y-4 text-black">
          <p>
            You're an emergency room doctor treating <b>five patients</b> who each need a different organ transplant to survive.
          </p>

          <svg viewBox="0 0 300 80" className="w-full h-[80px] mx-auto">
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i} transform={`translate(${i * 60}, 0)`}>
                <StickFigure dead={decision === "spare"} emotion={decision === "sacrifice" ? "happy" : "distressed"} />
              </g>
            ))}
          </svg>

          <p>
            <b>One healthy person</b> walks in for a routine checkup. They are a perfect organ-donor match for all five of the other patients.
          </p>

          <svg viewBox="0 0 36.399 69.454" className="w-full h-[80px] mx-auto">
            <StickFigure dead={decision === "sacrifice"} emotion="happy" />
          </svg>

          <p>You can perform a fatal transplant operation on the healthy person, sacrificing them to save the five patients.</p>
          <p>(Note that the healthy person has not consented to any procedure.)</p>

          <div className="space-x-2">
            <Button onClick={() => setDecision("sacrifice")} disabled={decision !== null}>
              Perform the Operation
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

          <div>
            {decision && stats && (
              <div>
                <p>
                  You chose to <b>{decision === "sacrifice" ? "sacrifice the healthy person" : "do nothing"}</b>,
                  causing <b>{decision === "sacrifice" ? "1" : "5"} death{decision === "spare" ? "s" : ""}</b>.<br />
                  {decision === "sacrifice"
                    ? `${stats.sacrifice.percent}% of all respondents made the same choice. ${stats.spare.percent}% disagreed. (${stats.total} total responses)`
                    : `${stats.spare.percent}% of all respondents made the same choice. ${stats.sacrifice.percent}% disagreed. (${stats.total} total responses)`}
                </p>

                {isHomework && homeworkStats && (
                  <div>
                    <br />
                    {homeworkStats.total === 1 ? (
                      <div><b>In your class,</b> you're the first student to respond to this scenario. Check back later for more stats!</div>
                    ) : (
                      <div>
                        <b>In your class,</b> {decision === "sacrifice"
                          ? `${homeworkStats.sacrifice.percent}% made the same choice. ${homeworkStats.spare.percent}% disagreed.`
                          : `${homeworkStats.spare.percent}% made the same choice. ${homeworkStats.sacrifice.percent}% disagreed.`} 
                        ({homeworkStats.total} total response{homeworkStats.total > 1 && "s"}).
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
