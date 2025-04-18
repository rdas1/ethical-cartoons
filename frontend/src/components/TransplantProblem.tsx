import { useState } from "react";
import { Button } from "./ui/button";
import StickFigure from "@/components/StickFigure";

export default function TransplantProblem() {
    const [decision, setDecision] = useState<null | "sacrifice" | "spare">(null);
    
    return (
    <div className={"space-y-4 text-black"}>
        <h2 className="text-xl font-bold">Scenario 2: The Transplant Problem</h2>
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
            You could perform a transplant operation on the healthy person, sacrificing them to save the five patients.
        </p>
        <p>
            What do you do?
        </p>
        <div className="space-x-2">
            <Button onClick={() => setDecision('sacrifice')}>Perform the Transplant Operation</Button>
            <Button onClick={() => setDecision('spare')}>Do Nothing</Button>
        </div>
    </div>

    )

}