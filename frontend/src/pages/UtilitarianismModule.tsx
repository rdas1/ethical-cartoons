// src/pages/UtilitarianismModule.tsx
import CustomTrolleyProblem from "@/components/CustomTrolleyProblem";
import NavBar from "@/components/NavBar";
import ScenarioQuestion from "@/components/ScenarioQuestion";
import StickFigure from "@/components/StickFigure";

export default function UtilitarianismModule() {

  const MANY = 20;
  const FEW = 5;

  return (
    <div className="w-[100%] overflow-y-scroll scroll-snap-y scroll-snap-mandatory">
      <NavBar />

      {/* Panel 1: Intro to Utilitarianism */}
      <section className="scroll-snap-start h-screen w-full flex flex-col items-center justify-center bg-white p-6 text-black">
        <div className="max-w-3xl space-y-6 text-center">
          <h1 className="text-3xl font-semibold">Utilitarianism: Maximizing Happiness</h1>
          <p className="text-lg">
            Utilitarianism says that the morally right action is the one that <b>maximizes happiness</b> – or "utility" – <b>for the greatest number of people</b>.
          </p>
          <p className="text-lg italic">"The greatest happiness of the greatest number is the foundation of morals and legislation." — Jeremy Bentham</p>
          <p className="text-lg">This means that the happiness of the many...</p>
          <svg viewBox={`0 0 400 80`} className="w-full h-[80px] mx-auto">
            {[...Array(MANY)].map((_, i) => (
              <g key={i} transform={`translate(${i * (400 / MANY)}, 0)`}>
                  <StickFigure emotion="happy" />
              </g>
            ))}
          </svg>
          <p className="text-lg">... outweighs the suffering of the few.</p>
          <svg viewBox={`0 0 400 80`} className="w-full h-[80px] mx-auto">
            {[...Array(FEW)].map((_, i) => (
              <g key={i} transform={`translate(${i * (400 / FEW)}, 0)`}>
                  <StickFigure emotion="sad" />
              </g>
            ))}
          </svg>
          <p className="text-lg">This simplifies certain decisions in useful and intuitive ways.<br /> Consider, for example, the classic trolley problem we encountered earlier:</p>
          <p className="text-lg"></p>
          {/* <p className="text-md font-semibold">(Scroll down to continue)</p> */}
        </div>
      </section>

      {/* CUSTOM TROLLEY PROBLEM TEST */}
      <section className="scroll-snap-start h-screen w-full flex flex-col items-center justify-center bg-white p-6 text-black">
        <CustomTrolleyProblem sectionLabel="The Trolley Problem, Revisited (Part 1)" numberOfBottomTrackVictims={2} numberOfTopTrackVictims={1} scenarioName="custom-trolley-test-1"/>
      </section>

      {/* Panel 2: Application Example */}
      <section className="scroll-snap-start h-screen w-full flex flex-col items-center justify-center bg-white p-6 text-black">
        <div className="max-w-3xl space-y-6 text-center">
          <h2 className="text-2xl font-semibold">Utilitarianism in Action: Example 1</h2>
          {/* Example: Classic Trolley Problem */}
          <p className="text-lg">
            Suppose you’re allocating scarce hospital resources. One patient has a rare condition and will require extensive care. 
            Three others have treatable injuries that require less intensive support. Who should you prioritize?
          </p>
        </div>
      </section>

      {/* Panel 3: Scenario Question */}
      <ScenarioQuestion
        scenarioName="utilitarian-hospital-scarcity"
        question="You can save either one person with a rare disease, or three people with common injuries. Who do you treat?"
        options={[
          { label: "Save the one with the rare disease", value: "save_one" },
          { label: "Save the three with common injuries", value: "save_three" },
        ]}
      />

      {/* Panel 4: The Repugnant Conclusion */}
      <section className="scroll-snap-start h-screen w-full flex flex-col items-center justify-center bg-white p-6 text-black">
        <div className="max-w-3xl space-y-6 text-center">
          <h2 className="text-2xl font-semibold">A Challenge: The Repugnant Conclusion</h2>
          <p className="text-lg">
            If the goal is to maximize happiness, would a world with a vast number of barely-happy people be better than a world with fewer but very happy people?
            This is known as the “Repugnant Conclusion,” and it challenges some versions of utilitarian thinking.
          </p>
        </div>
      </section>

      {/* Panel 5: Reflection/Transition */}
      <section className="scroll-snap-start h-screen w-full flex flex-col items-center justify-center bg-white p-6 text-black">
        <div className="max-w-3xl space-y-6 text-center">
          <h2 className="text-2xl font-semibold">Reflecting on Utilitarianism</h2>
          <p className="text-lg">
            Utilitarianism offers a simple and powerful framework — but as we've seen, applying it in real life can be complex. 
            In the next module, we’ll explore <strong>Deontological Ethics</strong>, which focuses on duties and moral rules rather than outcomes.
          </p>
        </div>
      </section>
    </div>
  );
}
