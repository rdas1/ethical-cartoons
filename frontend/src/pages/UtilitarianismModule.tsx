// src/pages/UtilitarianismModule.tsx
import CustomTrolleyProblem from "@/components/CustomTrolleyProblem";
import DiscussionPanel from "@/components/DiscussionPanel";
// import ModuleRestorePrompt from "@/components/ModuleRestorePrompt";
import NavBar from "@/components/NavBar";
import ScenarioQuestion from "@/components/ScenarioQuestion";
import StickFigure from "@/components/StickFigure";
import { useEffect } from "react";
// import { useState, useEffect } from "react";


export default function UtilitarianismModule() {

  const MANY = 20;
  const FEW = 5;

  // const [restoredResponses, setRestoredResponses] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0); // Always start at top
  }, []);
  
  return (
    <div className="w-[100%] overflow-y-scroll scroll-snap-y scroll-snap-mandatory">
      <NavBar />

      {/* <ModuleRestorePrompt
        moduleName="Utilitarianism"
        onRestore={(responses) => setRestoredResponses(responses)}
      /> */}

      {/* Panel 1: Intro to Utilitarianism */}
      <section className="scroll-snap-start w-full flex flex-col items-center justify-center bg-white pt-12 px-6 text-black space-y-6">
        <div className="max-w-3xl space-y-6 text-center">
          <br />
          <h1 className="text-3xl font-semibold">Utilitarianism: Maximizing Happiness</h1>
          <p className="text-lg">
            Utilitarianism says that the morally right action is the one that <br/><b>maximizes <u>happiness</u> – or <i>"utility"</i> – for the greatest number of people</b>.
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
          <p className="text-lg">This idea <b>simplifies certain decisions</b> in useful and intuitive ways.<br /> Consider, for example, the <b>classic trolley problem</b> we encountered earlier:</p>
          {/* <p className="text-md font-semibold">(Scroll down to continue)</p> */}
        </div>
      </section>

      {/* Section 2: Custom trolley problems */}
      <section className="scroll-snap-start w-[100%] flex flex-col items-center justify-center text-center bg-white pt-12 px-6 text-black space-y-6">
        <CustomTrolleyProblem scenarioName="utilitarianism-intro-trolley-classic" 
                              sectionLabel="The Trolley Problem: Classic Edition"
                              questionText={<>What would you do <b>in order to maximize overall happiness</b>?</>}
                              numberOfBottomTrackVictims={5} numberOfTopTrackVictims={1} 
                              />
        <p className="text-lg">In this case, the <b>utilitarian choice</b> is fairly clear: <b>pull the lever</b> to save the five people on the bottom track.</p>
        <p className="text-lg">This is based on the (very reasonable) idea that the "happiest" outcome is the one with the <b>fewest deaths.</b></p>
        <br />
        <p className="text-2xl"><b>But "happiness" can be a tricky thing to measure.</b></p>
        <br/>
        <p className="text-lg">What if the one person on the top track is a<br/> <b>scientist</b> researching a <b>cure for cancer</b>?
        <br/><br/>What if the five people on the bottom track are <br/><b>oil lobbyists</b> who knowingly <b>cause cancer</b>?</p>

        {/* <p className="text-lg">What if we knew a little bit more about the people tied to the tracks?</p>   */}
        <CustomTrolleyProblem scenarioName="utilitarianism-intro-trolley-cancer" 
                              sectionLabel="The Trolley Problem: Cancer Edition"
                              questionText={<>What would you do <b>in order to maximize overall happiness</b>?</>}
                              numberOfBottomTrackVictims={5} numberOfTopTrackVictims={1} 
                              showLabels={true}
                              topTrackLabels={["Cancer-Curing Scientist",]}
                              bottomTrackLabels={["Oil Lobbyist",]}
                              topTrackVictimsAdditionalDescription={<><br/>This person is a <b>scientist</b> researching a <b>cure for cancer</b>.<br/></>}
                              bottomTrackVictimsAdditionalDescription={<><br/>They are all <b>oil lobbyists</b> who knowingly <b>cause cancer</b> in some of their factory employees.<br/><br/></>}
                              // restore={
                              //   restoredResponses?.['utilitarianism-intro-trolley-cancer'] === "pullTheLever" || restoredResponses?.['utilitarianism-intro-trolley-cancer'] === "doNothing"
                              //     ? restoredResponses?.['utilitarianism-intro-trolley-cancer'] === "pullTheLever" ? "top" : "bottom"
                              //     : null
                              // }
                              />

        <p className="text-lg">
          In this case, the <b>utilitarian choice</b> is less clear – or perhaps, <b>less palatable</b>.
        </p>
        <p className="text-lg">
          If we assume that the scientist will cure cancer – or accelerate efforts to cure it –<br /> then the <b>utilitarian choice</b> might be to <b>pull the lever</b> and save the five oil lobbyists.
        </p>
        <p className="text-lg">
          But this is a very different choice than the one most of us made before,<br/> when we were just trying to save the most lives from death by trolley.
        </p>
        <p className="text-lg">
          If we make this choice,<br/>how do we reconcile the discomfiting notion of allowing five people to die<br/> in order to save one person who is "worth more"?
        </p>
        <p className="text-lg">
          Making value judgements on human lives is a very uncomfortable thing to do –<br/>especially when we assign different values to different categories of people.
          <br/>(At its extreme, this idea can manifest in gross discrimination through <u><a href="https://en.wikipedia.org/wiki/Eugenics">eugenics</a></u>.)
        </p>
      </section>

      <section className="scroll-snap-start my-[30vh] w-full flex flex-col items-center justify-center bg-white p-6 text-black text-center">
        <p className="text-3xl">
          These questions are all examples of <br/><b>the utilitarian dilemma</b>.
        </p>
        <br/>
        <br/>
        <p className="text-2xl">
          How do we measure happiness?
        </p>
        <br/>
        <br/>
        <p><b>(Scroll down for some relevant challenges)</b></p>
      </section>

      <section className="scroll-snap-start w-[100%] flex flex-col items-center justify-center bg-white pt-12 px-6 text-black space-y-6">
      {/* Panel 4: Poll about The Repugnant Conclusion */}
      <ScenarioQuestion
        scenarioName="repugnant-conclusion"
        title="Challenge 1: Population Size"
        question={
          <>
            <div className="text-center">
            Suppose there are two worlds:<br /><br />
              <b>World A</b>: <br />1 billion healthy people, who each rate their happiness at 4 out 10.
              <br /><br />
              <b>World B</b>: <br />40,000 sickly people, who each rate their happiness at 10 out of 10.
              <br /><br />
              <b>Which group is better off?</b>

            </div>
          </>
        }
        options={[
          { label: "World A's population", value: "worldA" },
          { label: "World B's population", value: "worldB" },
        ]}
      />
      <DiscussionPanel discussionSlug="repugnant-conclusion" placeholder="Which group is better off, and why?" />
      </section>

      <section className="scroll-snap-start w-[100%] flex flex-col items-center justify-center bg-white pt-12 px-6 text-black space-y-6">
      {/* Panel 5: Poll about Something */}
      <ScenarioQuestion
        scenarioName="repugnant-conclusion"
        title="Challenge 2: Labor Conditions"
        question={
          <>
            Suppose that a cure for cancer has been has been invented, but it is very labor-intensive to produce.<br/><br/>It can be produced in two different ways:<br /><br />
              <b>Mass Production (with bad working conditions)</b>: <br />Doses for every cancer patient can be produced within a year, but 1 million pharmaceutical workers will have to work long hours with terrible pay.
              <br /><br />
              <b>Slower Production (with fair working conditions)</b>: <br />Doses for only 10% of the world's cancer patient can be produced within a year, but 1 million pharmaceutical workers will earn fair wages.
              <br /><br />
              <b>Which is more ethical, from a utilitarian perspective?</b>
          </>
        }
        options={[
          { label: "Mass Production", value: "larger_population" },
          { label: "Labor Conditions", value: "smaller_population" },
        ]}
      />
      <DiscussionPanel discussionSlug="repugnant-conclusion" placeholder="Which group is better off, and why?" />
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
