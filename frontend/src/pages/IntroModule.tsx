import ModuleRestorePrompt from "@/components/ModuleRestorePrompt";
import NavBar from "@/components/NavBar";
import TransplantProblem from "@/components/TransplantProblem";
import TrolleyProblem from "@/components/TrolleyProblem";
import TrolleyVsTransplantDiscussionPanel from "@/components/TrolleyVsTransplantDiscussionPanel";
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
      <TrolleyVsTransplantDiscussionPanel />
    </div>
  );
}
