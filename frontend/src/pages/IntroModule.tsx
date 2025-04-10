import NavBar from "@/components/NavBar";
import TransplantProblem from "@/components/TransplantProblem";
import TrolleyProblem from "@/components/TrolleyProblem";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function IntroModule() {
  useEffect(() => {
    window.scrollTo(0, 0); // Always start at top
  }, []);

  return (
    <div className="h-screen w-screen overflow-y-scroll scroll-snap-y scroll-snap-mandatory">
      {/* NavBar */}
        <NavBar />

      {/* Page 1: Trolley Problem */}
      <section className="h-screen w-full flex items-center justify-center scroll-snap-start bg-white">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-3xl font-semibold mb-2">The Trolley Problem</h2>
          <p>(Inspired by Neal Agarwal's <Link to="https://neal.fun/absurd-trolley-problems/" className="underline">Absurd Trolley Problems</Link>)</p>
          {/* Interactive component will go here */}
          <div className="mt-4">
            <TrolleyProblem />
            {/* <p className="mb-2">[Interactive trolley problem placeholder]</p> */}
          </div>
        </div>
      </section>

      {/* Page 2: Transplant Problem */}
      <section className="h-screen w-full flex items-center justify-center scroll-snap-start bg-gray-50 p-4">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-3xl font-semibold mb-4">The Transplant Problem</h2>
          <p className="text-lg text-gray-700">
            <TransplantProblem />
          </p>
        </div>
      </section>

      {/* Page 3: Summary or Response Form */}
      <section className="h-screen w-full flex items-center justify-center scroll-snap-start bg-white p-4">
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">What's the ethical difference between these two scenarios?</h2>
          <p className="text-gray-600">
            [We'll ask you to explain your thinking after the scenarios.]
          </p>
        </div>
      </section>
    </div>
  );
}
