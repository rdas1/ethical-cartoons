import ModuleRestorePrompt from "@/components/ModuleRestorePrompt";
import NavBar from "@/components/NavBar";
import TransplantProblem from "@/components/TransplantProblem";
import TrolleyProblem from "@/components/TrolleyProblem";
import { useState } from "react";

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
      <TrolleyProblem 
                restore={
                  restoredResponses?.trolley === "pullTheLever" || restoredResponses?.trolley === "doNothing"
                    ? restoredResponses.trolley === "pullTheLever" ? "top" : "bottom"
                    : null
                }
              />

      {/* Page 2: Transplant Problem */}
      <TransplantProblem 
              restore={
                restoredResponses?.transplant === "sacrifice" || restoredResponses?.transplant === "spare"
                  ? restoredResponses.transplant
                  : null
              } 
            />

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
