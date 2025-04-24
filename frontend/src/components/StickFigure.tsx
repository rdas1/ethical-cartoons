type StickFigureProps = {
    emotion?: "happy" | "sad" | "distressed";
    splat?: boolean;
  };
  
  export default function StickFigure({ emotion = "distressed", splat = false }: StickFigureProps) {
    if (splat) {
        // Match the same transform as the stick figure
        return (
          <g id="Untitled">
            <path d="M2.164 57.06C2.164 43.488 3.749 28.116 12.84 18.228C15.537 15.295 18.362 13.71 22.087 13.461C23.795 13.346 25.67 13.048 26.954 14.565C30.532 18.795 31.481 24.526 31.996 30.144C32.879 39.772 32.543 49.246 32.543 58.877" fill="#d8d8d8" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="miter" strokeWidth="1"/>
            <g fill="#333333" opacity="1" stroke="none">
              <path d="M8.97386 40.0014L8.97386 34.0309L11.6211 34.0309C12.1532 34.0309 12.5578 34.0845 12.8347 34.1918C13.1116 34.299 13.3329 34.4884 13.4985 34.7599C13.6642 35.0314 13.747 35.3314 13.747 35.66C13.747 36.0835 13.6099 36.4406 13.3356 36.7311C13.0614 37.0216 12.6379 37.2062 12.065 37.2849C12.274 37.3854 12.4329 37.4845 12.5415 37.5822C12.7723 37.794 12.9908 38.0587 13.1972 38.3764L14.2357 40.0014L13.242 40.0014L12.4519 38.7592C12.2211 38.4008 12.031 38.1266 11.8817 37.9366C11.7324 37.7465 11.5987 37.6135 11.4806 37.5374C11.3625 37.4614 11.2423 37.4085 11.1201 37.3786C11.0305 37.3596 10.8839 37.3501 10.6803 37.3501L9.76395 37.3501L9.76395 40.0014L8.97386 40.0014ZM9.76395 36.6659L11.4622 36.6659C11.8233 36.6659 12.1057 36.6286 12.3093 36.5539C12.513 36.4792 12.6677 36.3598 12.7736 36.1955C12.8795 36.0313 12.9324 35.8527 12.9324 35.66C12.9324 35.3776 12.83 35.1455 12.625 34.9636C12.42 34.7816 12.0962 34.6907 11.6536 34.6907L9.76395 34.6907L9.76395 36.6659Z"/>
              <path d="M15.0991 40.0014L15.0991 39.1665L15.934 39.1665L15.934 40.0014L15.0991 40.0014Z"/>
              <path d="M17.4368 40.0014L17.4368 34.0309L18.2268 34.0309L18.2268 40.0014L17.4368 40.0014Z"/>
              <path d="M19.7337 40.0014L19.7337 39.1665L20.5686 39.1665L20.5686 40.0014L19.7337 40.0014Z"/>
              <path d="M21.937 40.0014L21.937 34.0309L24.1892 34.0309C24.5856 34.0309 24.8883 34.0499 25.0974 34.0879C25.3906 34.1368 25.6363 34.2298 25.8345 34.3669C26.0327 34.504 26.1922 34.6961 26.313 34.9432C26.4338 35.1903 26.4943 35.4618 26.4943 35.7577C26.4943 36.2654 26.3327 36.6951 26.0096 37.0467C25.6865 37.3983 25.1028 37.5741 24.2584 37.5741L22.7271 37.5741L22.7271 40.0014L21.937 40.0014ZM22.7271 36.8695L24.2706 36.8695C24.781 36.8695 25.1435 36.7745 25.358 36.5845C25.5725 36.3944 25.6797 36.127 25.6797 35.7822C25.6797 35.5324 25.6166 35.3186 25.4904 35.1407C25.3641 34.9629 25.1978 34.8454 24.9915 34.7884C24.8584 34.7531 24.6127 34.7355 24.2543 34.7355L22.7271 34.7355L22.7271 36.8695Z"/>
              <path d="M26.5391 40.0014L26.5391 39.1665L27.3739 39.1665L27.3739 40.0014L26.5391 40.0014Z"/>
            </g>
          </g>
        );
      }

    if (emotion === "distressed") {
      return (
        <g>
          <path d="M4.00039 19.9312C4.00039 11.1322 10.3574 3.99964 18.1994 3.99964C26.0424 3.99964 32.3994 11.1322 32.3994 19.9312C32.3994 28.7302 26.0424 35.8632 18.1994 35.8632C10.3574 35.8632 4.00039 28.7302 4.00039 19.9312Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.0099"/>
          <path d="M10.9864 14.8622C10.9864 12.8832 12.2904 11.2792 13.8984 11.2792C15.5074 11.2792 16.8114 12.8832 16.8114 14.8622C16.8114 16.8412 15.5074 18.4452 13.8984 18.4452C12.2904 18.4452 10.9864 16.8412 10.9864 14.8622Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M13.1424 15.9402C13.1424 15.3452 13.4814 14.8622 13.8984 14.8622C14.3164 14.8622 14.6554 15.3452 14.6554 15.9402C14.6554 16.5352 14.3164 17.0182 13.8984 17.0182C13.4814 17.0182 13.1424 16.5352 13.1424 15.9402Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M19.5884 14.8622C19.5884 12.8832 20.8924 11.2792 22.5004 11.2792C24.1094 11.2792 25.4134 12.8832 25.4134 14.8622C25.4134 16.8412 24.1094 18.4452 22.5004 18.4452C20.8924 18.4452 19.5884 16.8412 19.5884 14.8622Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M21.7444 15.9402C21.7444 15.3452 22.0834 14.8622 22.5004 14.8622C22.9184 14.8622 23.2574 15.3452 23.2574 15.9402C23.2574 16.5352 22.9184 17.0182 22.5004 17.0182C22.0834 17.0182 21.7444 16.5352 21.7444 15.9402Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M16.8114 35.8632L16.8114 54.5052" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M6.13039 38.0852L16.8114 45.1842" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M28.0344 38.7072L16.9674 45.1842" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M16.9674 54.5052L6.28639 65.4532" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M16.6614 54.5052L28.0344 64.7302" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M12.9812 26.7671C12.9812 24.3853 15.3175 22.4545 18.1995 22.4545C21.0815 22.4545 23.4178 24.3853 23.4178 26.7671C23.4178 29.1488 21.0815 31.0796 18.1995 31.0796C15.3175 31.0796 12.9812 29.1488 12.9812 26.7671Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1.52881"/>
        </g>
      ); 
    }

    if (emotion === "happy") {
      return (
        <g>
          <path d="M4.00039 19.9312C4.00039 11.1322 10.3574 3.99964 18.1994 3.99964C26.0424 3.99964 32.3994 11.1322 32.3994 19.9312C32.3994 28.7302 26.0424 35.8632 18.1994 35.8632C10.3574 35.8632 4.00039 28.7302 4.00039 19.9312Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.0099"/>
          <path d="M10.9864 14.8622C10.9864 12.8832 12.2904 11.2792 13.8984 11.2792C15.5074 11.2792 16.8114 12.8832 16.8114 14.8622C16.8114 16.8412 15.5074 18.4452 13.8984 18.4452C12.2904 18.4452 10.9864 16.8412 10.9864 14.8622Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M13.1424 15.9402C13.1424 15.3452 13.4814 14.8622 13.8984 14.8622C14.3164 14.8622 14.6554 15.3452 14.6554 15.9402C14.6554 16.5352 14.3164 17.0182 13.8984 17.0182C13.4814 17.0182 13.1424 16.5352 13.1424 15.9402Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M19.5884 14.8622C19.5884 12.8832 20.8924 11.2792 22.5004 11.2792C24.1094 11.2792 25.4134 12.8832 25.4134 14.8622C25.4134 16.8412 24.1094 18.4452 22.5004 18.4452C20.8924 18.4452 19.5884 16.8412 19.5884 14.8622Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M21.7444 15.9402C21.7444 15.3452 22.0834 14.8622 22.5004 14.8622C22.9184 14.8622 23.2574 15.3452 23.2574 15.9402C23.2574 16.5352 22.9184 17.0182 22.5004 17.0182C22.0834 17.0182 21.7444 16.5352 21.7444 15.9402Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M16.8114 35.8632L16.8114 54.5052" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M6.13039 38.0852L16.8114 45.1842" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M28.0344 38.7072L16.9674 45.1842" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M16.9674 54.5052L6.28639 65.4532" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M16.6614 54.5052L28.0344 64.7302" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M13.0073 24.4284C12.9916 24.4284 14.6004 31.1646 18.0279 30.6505C20.3371 30.3041 21.7962 27.9871 22.6193 26.0161C23.0171 25.0634 23.5036 21.99 23.1771 22.9695" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.52881"/>
          <path d="M13.179 24.9434C13.6775 23.4478 21.933 22.7671 23.5204 22.5404" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.52881"/>
        </g>
      )
    }

    if (emotion === "sad") {
      return (
        <g>
          <path d="M4.00039 19.9312C4.00039 11.1322 10.3574 3.99964 18.1994 3.99964C26.0424 3.99964 32.3994 11.1322 32.3994 19.9312C32.3994 28.7302 26.0424 35.8632 18.1994 35.8632C10.3574 35.8632 4.00039 28.7302 4.00039 19.9312Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.0099"/>
          <path d="M10.9864 14.8622C10.9864 12.8832 12.2904 11.2792 13.8984 11.2792C15.5074 11.2792 16.8114 12.8832 16.8114 14.8622C16.8114 16.8412 15.5074 18.4452 13.8984 18.4452C12.2904 18.4452 10.9864 16.8412 10.9864 14.8622Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M13.1424 15.9402C13.1424 15.3452 13.4814 14.8622 13.8984 14.8622C14.3164 14.8622 14.6554 15.3452 14.6554 15.9402C14.6554 16.5352 14.3164 17.0182 13.8984 17.0182C13.4814 17.0182 13.1424 16.5352 13.1424 15.9402Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M19.5884 14.8622C19.5884 12.8832 20.8924 11.2792 22.5004 11.2792C24.1094 11.2792 25.4134 12.8832 25.4134 14.8622C25.4134 16.8412 24.1094 18.4452 22.5004 18.4452C20.8924 18.4452 19.5884 16.8412 19.5884 14.8622Z" fill="#ffffff" fillRule="nonzero" opacity="0" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M21.7444 15.9402C21.7444 15.3452 22.0834 14.8622 22.5004 14.8622C22.9184 14.8622 23.2574 15.3452 23.2574 15.9402C23.2574 16.5352 22.9184 17.0182 22.5004 17.0182C22.0834 17.0182 21.7444 16.5352 21.7444 15.9402Z" fill="#121313" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.61202"/>
          <path d="M16.8114 35.8632L16.8114 54.5052" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M6.13039 38.0852L16.8114 45.1842" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M28.0344 38.7072L16.9674 45.1842" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M16.9674 54.5052L6.28639 65.4532" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M16.6614 54.5052L28.0344 64.7302" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="3.2451"/>
          <path d="M12.7928 28.4191C12.421 29.0387 12.0844 23.8886 15.8823 23.3986C20.5526 22.796 22.7102 27.4322 22.748 27.4322" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.52881"/>
        </g>
      )
    }
  }
  