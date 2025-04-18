type StickFigureProps = {
    dead?: boolean;
  };
  
  export default function StickFigure({ dead = false }: StickFigureProps) {
    if (dead) {
        // Match the same transform as the stick figure
        return (
            <g>
                <path style={{ fill: "rgb(216, 216, 216)", stroke: "rgb(0, 0, 0)" }} d="M 255.589 230.606 C 255.589 217.034 257.174 201.662 266.265 191.774 C 268.962 188.841 271.787 187.256 275.512 187.007 C 277.22 186.892 279.095 186.594 280.379 188.111 C 283.957 192.341 284.906 198.072 285.421 203.69 C 286.304 213.318 285.968 222.792 285.968 232.423"/>
                <text style={{ whiteSpace: "pre", fill: "rgb(51, 51, 51)", fontFamily: "Arial, sans-serif", fontSize: "28px" }} x="264.906" y="204.247" transform="matrix(0.261446, 0, 0, 0.300021, 193.546021, 151.381622)">R.I.P.<tspan x="264.906005859375" dy="1em">​</tspan></text>
            </g>
        );
      }

    return (
      <g transform="translate(-321.43661499023443, 78.29224395751955)">
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
    );
  }
  