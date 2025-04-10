import { Button } from "./ui/button";

export default function TransplantProblem() {

    function setDecision(arg0: string): void {
        console.log("Function not implemented.");
    }

    return (
    <div className="space-y-4 text-black">
        <h2 className="text-xl font-bold">Scenario 2: The Transplant Problem</h2>
        <p>
            You're an emergency room doctor treating <b>five patients</b> who each need a different organ transplant to survive.
        </p>
        {/* Render five-people SVGs here */}

        <svg viewBox="253.425 173.546 300 80" className="w-full h-[80px] mx-auto">
        {[0, 1, 2, 3, 4].map(i => (
            <g
            key={i}
            transform={`translate(${i * 60}, 0)`}
            >
            <g transform="translate(-321.43661499023443, 78.29224395751955)">
            <path d="M578.862 115.185C578.862 106.386 585.219 99.2534 593.061 99.2534C600.904 99.2534 607.261 106.386 607.261 115.185C607.261 123.984 600.904 131.117 593.061 131.117C585.219 131.117 578.862 123.984 578.862 115.185Z" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.0099"/>
            <path d="M588.76 123.007C588.76 120.584 590.686 118.62 593.061 118.62C595.437 118.62 597.362 120.584 597.362 123.007C597.362 125.43 595.437 127.394 593.061 127.394C590.686 127.394 588.76 125.43 588.76 123.007Z" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.52881"/>
            <path d="M585.848 110.116C585.848 108.137 587.152 106.533 588.76 106.533C590.369 106.533 591.673 108.137 591.673 110.116C591.673 112.095 590.369 113.699 588.76 113.699C587.152 113.699 585.848 112.095 585.848 110.116Z" fill="#ffffff" fill-rule="nonzero" opacity="0" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.61202"/>
            <path d="M588.004 111.194C588.004 110.599 588.343 110.116 588.76 110.116C589.178 110.116 589.517 110.599 589.517 111.194C589.517 111.789 589.178 112.272 588.76 112.272C588.343 112.272 588.004 111.789 588.004 111.194Z" fill="#121313" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.61202"/>
            <path d="M594.45 110.116C594.45 108.137 595.754 106.533 597.362 106.533C598.971 106.533 600.275 108.137 600.275 110.116C600.275 112.095 598.971 113.699 597.362 113.699C595.754 113.699 594.45 112.095 594.45 110.116Z" fill="#ffffff" fill-rule="nonzero" opacity="0" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.61202"/>
            <path d="M596.606 111.194C596.606 110.599 596.945 110.116 597.362 110.116C597.78 110.116 598.119 110.599 598.119 111.194C598.119 111.789 597.78 112.272 597.362 112.272C596.945 112.272 596.606 111.789 596.606 111.194Z" fill="#121313" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.61202"/>
            <path d="M591.673 131.117L591.673 149.759" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="3.2451"/>
            <path d="M580.992 133.339L591.673 140.438" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="3.2451"/>
            <path d="M602.896 133.961L591.829 140.438" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="3.2451"/>
            <path d="M591.829 149.759L581.148 160.707" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="3.2451"/>
            <path d="M591.523 149.759L602.896 159.984" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="3.2451"/>
            </g>
            </g>
        ))}
        </svg>

        <p>
            <b>One healthy person</b> walks in for a routine checkup. They are perfect organ-donor match for all five of the other patients.
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="253.425 173.546 36.399 69.454" className="w-full h-[80px]">
        <g id="one-person_2" transform="matrix(1, 0, 0, 1, -321.43661499023443, 78.29224395751955)">
            <path d="M578.862 115.185C578.862 106.386 585.219 99.2534 593.061 99.2534C600.904 99.2534 607.261 106.386 607.261 115.185C607.261 123.984 600.904 131.117 593.061 131.117C585.219 131.117 578.862 123.984 578.862 115.185Z" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.0099"/>
            <path d="M588.76 123.007C588.76 120.584 590.686 118.62 593.061 118.62C595.437 118.62 597.362 120.584 597.362 123.007C597.362 125.43 595.437 127.394 593.061 127.394C590.686 127.394 588.76 125.43 588.76 123.007Z" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.52881"/>
            <path d="M585.848 110.116C585.848 108.137 587.152 106.533 588.76 106.533C590.369 106.533 591.673 108.137 591.673 110.116C591.673 112.095 590.369 113.699 588.76 113.699C587.152 113.699 585.848 112.095 585.848 110.116Z" fill="#ffffff" fill-rule="nonzero" opacity="0" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.61202"/>
            <path d="M588.004 111.194C588.004 110.599 588.343 110.116 588.76 110.116C589.178 110.116 589.517 110.599 589.517 111.194C589.517 111.789 589.178 112.272 588.76 112.272C588.343 112.272 588.004 111.789 588.004 111.194Z" fill="#121313" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.61202"/>
            <path d="M594.45 110.116C594.45 108.137 595.754 106.533 597.362 106.533C598.971 106.533 600.275 108.137 600.275 110.116C600.275 112.095 598.971 113.699 597.362 113.699C595.754 113.699 594.45 112.095 594.45 110.116Z" fill="#ffffff" fill-rule="nonzero" opacity="0" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.61202"/>
            <path d="M596.606 111.194C596.606 110.599 596.945 110.116 597.362 110.116C597.78 110.116 598.119 110.599 598.119 111.194C598.119 111.789 597.78 112.272 597.362 112.272C596.945 112.272 596.606 111.789 596.606 111.194Z" fill="#121313" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.61202"/>
            <path d="M591.673 131.117L591.673 149.759" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="3.2451"/>
            <path d="M580.992 133.339L591.673 140.438" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="3.2451"/>
            <path d="M602.896 133.961L591.829 140.438" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="3.2451"/>
            <path d="M591.829 149.759L581.148 160.707" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="3.2451"/>
            <path d="M591.523 149.759L602.896 159.984" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="3.2451"/>
        </g>
        </svg>
        <p>
            You could perform a transplant operation on the healthy person, sacrificing them to save the five patients.
        </p>
        <p>
            What do you do?
        </p>
        {/* Render five-people SVGs here */}

        <div className="space-x-2">
            <Button onClick={() => setDecision('sacrifice')}>Perform the Transplant Operation</Button>
            <Button onClick={() => setDecision('spare')}>Do Nothing</Button>
        </div>

        {/* Render one-person and five-people SVGs here */}
    </div>

    )

}