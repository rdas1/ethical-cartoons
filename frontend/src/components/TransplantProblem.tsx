import { Button } from "./ui/button";

export default function TransplantProblem() {

    function setDecision(arg0: string): void {
        console.log("Function not implemented.");
    }

    return (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">Scenario 2: The Transplant Problem</h2>
        <p>
            You're an emergency room doctor treating <b>five patients</b> who each need a different organ transplant to survive.
        </p>
        {/* Render five-people SVGs here */}
        <svg viewBox="0 0 800 400">
        <g id="five-people">
        <g opacity="1">
        <g opacity="1">
        <path d="M655.597 299.725C655.597 290.927 661.955 283.794 669.797 283.794C677.639 283.794 683.997 290.927 683.997 299.725C683.997 308.524 677.639 315.657 669.797 315.657C661.955 315.657 655.597 308.524 655.597 299.725Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.0099"/>
        <path d="M665.496 307.547C665.496 305.124 667.422 303.16 669.797 303.16C672.172 303.16 674.098 305.124 674.098 307.547C674.098 309.97 672.172 311.935 669.797 311.935C667.422 311.935 665.496 309.97 665.496 307.547Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.52881"/>
        <path d="M662.583 294.656C662.583 292.677 663.887 291.073 665.496 291.073C667.104 291.073 668.408 292.677 668.408 294.656C668.408 296.635 667.104 298.239 665.496 298.239C663.887 298.239 662.583 296.635 662.583 294.656Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M664.74 295.734C664.74 295.139 665.078 294.656 665.496 294.656C665.914 294.656 666.252 295.139 666.252 295.734C666.252 296.329 665.914 296.812 665.496 296.812C665.078 296.812 664.74 296.329 664.74 295.734Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M671.185 294.656C671.185 292.677 672.489 291.073 674.098 291.073C675.706 291.073 677.01 292.677 677.01 294.656C677.01 296.635 675.706 298.239 674.098 298.239C672.489 298.239 671.185 296.635 671.185 294.656Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M673.341 295.734C673.341 295.139 673.68 294.656 674.098 294.656C674.515 294.656 674.854 295.139 674.854 295.734C674.854 296.329 674.515 296.812 674.098 296.812C673.68 296.812 673.341 296.329 673.341 295.734Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M668.408 315.657L668.408 334.299" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M657.728 317.879L668.408 324.978" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M679.631 318.501L668.564 324.978" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M668.564 334.299L657.884 345.248" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M668.259 334.299L679.631 344.524" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M610.423 289.268C610.423 280.469 616.781 273.336 624.623 273.336C632.465 273.336 638.823 280.469 638.823 289.268C638.823 298.067 632.465 305.199 624.623 305.199C616.781 305.199 610.423 298.067 610.423 289.268Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.0099"/>
        <path d="M620.322 297.09C620.322 294.667 622.248 292.703 624.623 292.703C626.998 292.703 628.924 294.667 628.924 297.09C628.924 299.513 626.998 301.477 624.623 301.477C622.248 301.477 620.322 299.513 620.322 297.09Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.52881"/>
        <path d="M617.41 284.199C617.41 282.22 618.714 280.616 620.322 280.616C621.931 280.616 623.235 282.22 623.235 284.199C623.235 286.178 621.931 287.782 620.322 287.782C618.714 287.782 617.41 286.178 617.41 284.199Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M619.566 285.277C619.566 284.681 619.905 284.199 620.322 284.199C620.74 284.199 621.079 284.681 621.079 285.277C621.079 285.872 620.74 286.354 620.322 286.354C619.905 286.354 619.566 285.872 619.566 285.277Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M626.012 284.199C626.012 282.22 627.316 280.616 628.924 280.616C630.533 280.616 631.837 282.22 631.837 284.199C631.837 286.178 630.533 287.782 628.924 287.782C627.316 287.782 626.012 286.178 626.012 284.199Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M628.168 285.277C628.168 284.681 628.506 284.199 628.924 284.199C629.342 284.199 629.68 284.681 629.68 285.277C629.68 285.872 629.342 286.354 628.924 286.354C628.506 286.354 628.168 285.872 628.168 285.277Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M623.235 305.199L623.235 323.842" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M612.554 307.422L623.235 314.521" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M634.458 308.043L623.39 314.521" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M623.39 323.842L612.71 334.79" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M623.085 323.842L634.458 334.067" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M566.731 277.327C566.731 268.528 573.088 261.396 580.931 261.396C588.773 261.396 595.131 268.528 595.131 277.327C595.131 286.126 588.773 293.259 580.931 293.259C573.088 293.259 566.731 286.126 566.731 277.327Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.0099"/>
        <path d="M576.63 285.149C576.63 282.726 578.555 280.762 580.931 280.762C583.306 280.762 585.232 282.726 585.232 285.149C585.232 287.572 583.306 289.537 580.931 289.537C578.555 289.537 576.63 287.572 576.63 285.149Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.52881"/>
        <path d="M573.717 272.258C573.717 270.279 575.021 268.675 576.63 268.675C578.238 268.675 579.542 270.279 579.542 272.258C579.542 274.237 578.238 275.841 576.63 275.841C575.021 275.841 573.717 274.237 573.717 272.258Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M575.873 273.336C575.873 272.741 576.212 272.258 576.63 272.258C577.048 272.258 577.386 272.741 577.386 273.336C577.386 273.931 577.048 274.414 576.63 274.414C576.212 274.414 575.873 273.931 575.873 273.336Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M582.319 272.258C582.319 270.279 583.623 268.675 585.232 268.675C586.84 268.675 588.144 270.279 588.144 272.258C588.144 274.237 586.84 275.841 585.232 275.841C583.623 275.841 582.319 274.237 582.319 272.258Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M584.475 273.336C584.475 272.741 584.814 272.258 585.232 272.258C585.649 272.258 585.988 272.741 585.988 273.336C585.988 273.931 585.649 274.414 585.232 274.414C584.814 274.414 584.475 273.931 584.475 273.336Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M579.542 293.259L579.542 311.901" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M568.862 295.481L579.542 302.58" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M590.765 296.103L579.698 302.58" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M579.698 311.901L569.018 322.849" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M579.393 311.901L590.765 322.126" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M519.074 266.465C519.074 257.666 525.432 250.533 533.274 250.533C541.117 250.533 547.474 257.666 547.474 266.465C547.474 275.263 541.117 282.396 533.274 282.396C525.432 282.396 519.074 275.263 519.074 266.465Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.0099"/>
        <path d="M528.973 274.287C528.973 271.864 530.899 269.899 533.274 269.899C535.65 269.899 537.575 271.864 537.575 274.287C537.575 276.71 535.65 278.674 533.274 278.674C530.899 278.674 528.973 276.71 528.973 274.287Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.52881"/>
        <path d="M526.061 261.396C526.061 259.417 527.365 257.813 528.973 257.813C530.582 257.813 531.886 259.417 531.886 261.396C531.886 263.374 530.582 264.979 528.973 264.979C527.365 264.979 526.061 263.374 526.061 261.396Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M528.217 262.473C528.217 261.878 528.556 261.396 528.973 261.396C529.391 261.396 529.73 261.878 529.73 262.473C529.73 263.069 529.391 263.551 528.973 263.551C528.556 263.551 528.217 263.069 528.217 262.473Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M534.663 261.396C534.663 259.417 535.967 257.813 537.575 257.813C539.184 257.813 540.488 259.417 540.488 261.396C540.488 263.374 539.184 264.979 537.575 264.979C535.967 264.979 534.663 263.374 534.663 261.396Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M536.819 262.473C536.819 261.878 537.157 261.396 537.575 261.396C537.993 261.396 538.331 261.878 538.331 262.473C538.331 263.069 537.993 263.551 537.575 263.551C537.157 263.551 536.819 263.069 536.819 262.473Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M531.886 282.396L531.886 301.039" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M521.205 284.618L531.886 291.717" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M543.109 285.24L532.041 291.717" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M532.041 301.039L521.361 311.987" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M531.736 301.039L543.109 311.264" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M473.727 255.602C473.727 246.803 480.084 239.67 487.926 239.67C495.769 239.67 502.126 246.803 502.126 255.602C502.126 264.401 495.769 271.534 487.926 271.534C480.084 271.534 473.727 264.401 473.727 255.602Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.0099"/>
        <path d="M483.625 263.424C483.625 261.001 485.551 259.037 487.926 259.037C490.302 259.037 492.227 261.001 492.227 263.424C492.227 265.847 490.302 267.811 487.926 267.811C485.551 267.811 483.625 265.847 483.625 263.424Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.52881"/>
        <path d="M480.713 250.533C480.713 248.554 482.017 246.95 483.625 246.95C485.234 246.95 486.538 248.554 486.538 250.533C486.538 252.512 485.234 254.116 483.625 254.116C482.017 254.116 480.713 252.512 480.713 250.533Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M482.869 251.611C482.869 251.016 483.208 250.533 483.625 250.533C484.043 250.533 484.382 251.016 484.382 251.611C484.382 252.206 484.043 252.689 483.625 252.689C483.208 252.689 482.869 252.206 482.869 251.611Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M489.315 250.533C489.315 248.554 490.619 246.95 492.227 246.95C493.836 246.95 495.14 248.554 495.14 250.533C495.14 252.512 493.836 254.116 492.227 254.116C490.619 254.116 489.315 252.512 489.315 250.533Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M491.471 251.611C491.471 251.016 491.81 250.533 492.227 250.533C492.645 250.533 492.984 251.016 492.984 251.611C492.984 252.206 492.645 252.689 492.227 252.689C491.81 252.689 491.471 252.206 491.471 251.611Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M486.538 271.534L486.538 290.176" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M475.857 273.756L486.538 280.855" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M497.761 274.378L486.694 280.855" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M486.694 290.176L476.013 301.124" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M486.388 290.176L497.761 300.401" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        </g>
        </g>
        </g>

        </svg>
        <p>
            <b>One healthy person</b> walks in for a routine checkup. They are perfect organ-donor match for all five of the other patients.
        </p>
        <svg viewBox="0 0 800 400">
        <g id="one-person_2">
        <path d="M578.862 115.185C578.862 106.386 585.219 99.2534 593.061 99.2534C600.904 99.2534 607.261 106.386 607.261 115.185C607.261 123.984 600.904 131.117 593.061 131.117C585.219 131.117 578.862 123.984 578.862 115.185Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.0099"/>
        <path d="M588.76 123.007C588.76 120.584 590.686 118.62 593.061 118.62C595.437 118.62 597.362 120.584 597.362 123.007C597.362 125.43 595.437 127.394 593.061 127.394C590.686 127.394 588.76 125.43 588.76 123.007Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.52881"/>
        <path d="M585.848 110.116C585.848 108.137 587.152 106.533 588.76 106.533C590.369 106.533 591.673 108.137 591.673 110.116C591.673 112.095 590.369 113.699 588.76 113.699C587.152 113.699 585.848 112.095 585.848 110.116Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M588.004 111.194C588.004 110.599 588.343 110.116 588.76 110.116C589.178 110.116 589.517 110.599 589.517 111.194C589.517 111.789 589.178 112.272 588.76 112.272C588.343 112.272 588.004 111.789 588.004 111.194Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M594.45 110.116C594.45 108.137 595.754 106.533 597.362 106.533C598.971 106.533 600.275 108.137 600.275 110.116C600.275 112.095 598.971 113.699 597.362 113.699C595.754 113.699 594.45 112.095 594.45 110.116Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M596.606 111.194C596.606 110.599 596.945 110.116 597.362 110.116C597.78 110.116 598.119 110.599 598.119 111.194C598.119 111.789 597.78 112.272 597.362 112.272C596.945 112.272 596.606 111.789 596.606 111.194Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
        <path d="M591.673 131.117L591.673 149.759" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M580.992 133.339L591.673 140.438" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M602.896 133.961L591.829 140.438" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M591.829 149.759L581.148 160.707" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
        <path d="M591.523 149.759L602.896 159.984" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
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
            <Button onClick={() => setDecision('sacrifice')}>Sacrifice the Healthy Person</Button>
            <Button onClick={() => setDecision('spare')}>Do Nothing</Button>
        </div>

        {/* Render one-person and five-people SVGs here */}
    </div>

    )

}