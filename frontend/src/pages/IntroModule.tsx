import ModuleRestorePrompt from "@/components/ModuleRestorePrompt";
import NavBar from "@/components/NavBar";
import TransplantProblem from "@/components/TransplantProblem";
import TrolleyProblem from "@/components/TrolleyProblem";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IntroModule() {

  const [restoredResponses, setRestoredResponses] = useState<Record<string, string> | null>(null);
  // useEffect(() => {
  //   window.scrollTo(0, 0); // Always start at top
  // }, []);

  return (
    <div className="h-screen w-screen overflow-y-scroll scroll-snap-y scroll-snap-mandatory">
      {/* NavBar */}
        <NavBar />

        <ModuleRestorePrompt
          moduleName="IntroModule"
          onRestore={(responses) => setRestoredResponses(responses)}
        />

      {/* Page 1: Trolley Problem */}
      <section className="h-screen w-full flex items-center justify-center scroll-snap-start bg-white">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-3xl font-semibold mb-2">Scenario 1</h2>
          <p>(Inspired by Neal Agarwal's <Link to="https://neal.fun/absurd-trolley-problems/" className="underline">Absurd Trolley Problems</Link>)</p>
          {/* Interactive component will go here */}
          <div className="mt-4">
            <TrolleyProblem 
                restore={
                  restoredResponses?.trolley === "pullTheLever" || restoredResponses?.trolley === "doNothing"
                    ? restoredResponses.trolley === "pullTheLever" ? "top" : "bottom"
                    : null
                }
              />
            {/* <p className="mb-2">[Interactive trolley problem placeholder]</p> */}
          </div>
        </div>
      </section>

      {/* Page 2: Transplant Problem */}
      <section className="h-screen w-full flex items-center justify-center scroll-snap-start bg-gray-50 p-4">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-3xl font-semibold mb-4">Scenario 2: The Transplant Problem</h2>
            <TransplantProblem 
              restore={
                restoredResponses?.transplant === "sacrifice" || restoredResponses?.transplant === "spare"
                  ? restoredResponses.transplant
                  : null
              } 
            />
        </div>
      </section>

      {/* Page 3: Summary or Response Form */}
      <section className="h-screen w-full flex items-center justify-center scroll-snap-start bg-white p-4">
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">What's the ethical difference between these two scenarios?</h2>
          <p>
          What’s the difference between the Trolley and Transplant dilemmas?
          </p>
          <p>
          In both, you face a choice: sacrifice one person to save five.
          </p>
          <p>
          Yet most people give different answers. Why?
          </p>
        </div>
      </section>
    </div>
  );
}
