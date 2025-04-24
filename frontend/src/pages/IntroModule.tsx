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
    <div className="w-[100%] overflow-y-scroll scroll-snap-y scroll-snap-mandatory">
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

      {/* Page 3: Discussion Panel on the differences between the trolley and transplant problems */}
      <TrolleyVsTransplantDiscussionPanel />

      {/* Page 4: My take on the ethical difference */}
      <section className="w-full flex flex-col items-center justify-center scroll-snap-start bg-white my-6 text-black p-6">
        <div className="max-w-3xl w-full space-y-6">
          <h2 className="text-3xl font-semibold text-center">Interpreting the Difference</h2>
          <p className="text-lg">
              As some of you have pointed out, there are a few key differences between the Trolley and Transplant problems. These include:
          </p>
          <h2 className="text-2xl font-semibold">Responsibility for the Harmful Conditions</h2>
          <p className="text-lg">
              In the Trolley Problem, you are a bystander observing a terrible situation <b>that you did not cause</b>. You did not cause the trolley's brakes to fail; you did not tie anyone to the tracks. These harmful conditions were pre-existing.  Thus, even if you choose to redirect the trolley so that a single person dies, you weren't responsible for putting them in danger in the first place.
          </p>

          <p className="text-lg">
              In the Transplant Problem, by contrast, <b>you would be directly responsible for the healthy person's death</b> if you chose to operate. They were in no danger of dying when they arrived for a checkup. You put them in danger by choosing to perform a fatal transplant operation. 
          </p>

          <h2 className="text-md font-semibold"><u>Complicating Question</u>: What if the healthy person were replaced with a terminally-ill cancer patient?</h2>              

          {/* Difference 3 */}
          <h2 className="text-2xl font-semibold">Trust and Social Roles</h2>
          <p className="text-lg">
             In the Trolley Problem, you’re just a bystander, and therefore not violating any social contract.
          </p>
          <p className="text-lg">
             In the Transplant Problem, you’re a doctor, which means that you're subject to codes of medical ethics, including the Hippocratic Oath.
          </p>
          <h2 className="text-1xl font-semibold"><u>Complicating Question:</u> What if you're not a doctor, but rather, a bystander in the waiting room? What if it's guaranteed that you will not be prosecuted for killing the healthy patient?</h2>              

          <p className="text-lg">
              And many more.
          </p>
          {/* <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-700">
            “It is better to let the world perish than to allow an innocent man to be put to death.” — Immanuel Kant
          </blockquote>

          <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-700">
            “The greatest happiness of the greatest number is the foundation of morals and legislation.” — Jeremy Bentham
          </blockquote> */}

        </div>
      </section>

      {/* Conclusion */}
      <section className="w-full flex flex-col items-center justify-center scroll-snap-start bg-white my-6 text-black p-6">
      <div className="max-w-3xl w-full space-y-6">
        <h2 className="text-3xl font-semibold text-center">Why Study Ethics?</h2>

        <p className="text-lg">
          These scenarios might seem abstract — but real-world decisions often present us with similar moral tensions:
        </p>

        <p className="text-lg">
          <b>A self-driving car experiencing brake failure must decide whether to swerve and harm one pedestrian or stay its course and harm three passengers.</b> Whom should it prioritize – and why?
        </p>
        <p className="text-lg">
          <b>A hospital has one ICU bed left during a disaster. </b>
          Should it go to a <b>younger patient</b> with a higher chance of long-term survival, or an <b>older patient who arrives first?</b>
        </p>

        <p className="text-lg">
          <b>Your close friend cheated on their partner.</b> Their partner calls you, the next day, and asks if your friend was with you last night.
          <b> What should you tell them?</b>
        </p>

        <p className="text-lg">
          Ethics offers us the opportunity — and the <b>tools</b> — to articulate our moral values – that is, our understanding of right and wrong. These can help us make difficult decisions, and provide a framework for discussing them with others. Additionally, studying ethics can help us understand other people's perspectives, and why they might disagree with us. Perhaps most importantly, ethics can help us envision what a "good life" means to us – and how we can achieve it.
        </p>

        <h2 className="text-2xl font-semibold text-center">What’s Next?</h2>
        <p className="text-lg">
          In the next few modules, we’ll explore major ethical frameworks that philosophers have proposed to help us reason through moral dilemmas like these:
        </p>

        <ul className="list-disc list-inside text-lg space-y-2">
          <li>
            <b><a className="text-blue-600 underline" href="#/modules/utilitarian">Utilitarianism</a></b>: Should we always act to maximize overall happiness?
          </li>
          <li>
            <b><a className="text-blue-600 underline" href="#/modules/deontological">Deontology</a></b>: Are some actions simply wrong, regardless of the consequences?
          </li>
        </ul>

        <p className="text-lg font-semibold text-center">
          Let’s keep thinking, questioning, and learning.
        </p>
      </div>
    </section>
    </div>
  );
}
