import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { Button } from '@/components/ui/button'
import { getSessionId } from '@/utils/session'

gsap.registerPlugin(MotionPathPlugin)

type TrolleyProblemProps = {
  restore?: 'top' | 'bottom' | null;
};

export default function TrolleyProblem({ restore = null }: TrolleyProblemProps) {

    const [responseId, setResponseId] = useState<number | null>(null);
    const [stats, setStats] = useState<{
      top: { percent: number; count: number };
      bottom: { percent: number; count: number };
      total: number;
    } | null>(null);

    const sessionId = getSessionId();

    const trolleyRef = useRef<SVGSVGElement>(null)
    const [track, setTrack] = useState<'top' | 'bottom' | null>(null);
    const [trackTrigger, setTrackTrigger] = useState(0); // <-- new trigger    
    const [hasActivated, setHasActivated] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    const activateTrack = (t: 'top' | 'bottom') => {
      setTrack(t);
      setTrackTrigger(prev => prev + 1);  // triggers animation
      setHasActivated(true);
    };

  
    useEffect(() => {
        if (!trolleyRef.current) return;
      
        const shared = document.querySelector('#SharedPath') as SVGPathElement;
        const top = document.querySelector('#TopPath') as SVGPathElement;
        const bottom = document.querySelector('#BottomPath') as SVGPathElement;
      
        if (!shared || !top || !bottom) return;
            
        gsap.set(trolleyRef.current, {
          motionPath: {
            path: shared,
            align: shared,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0.12,
            end: 0.12, // Align only; no movement
          }
        });
      }, []);      
    
    useEffect(() => {
      if (!track || !trolleyRef.current) return;
      if (track) {
        const decision = track === "top" ? "pullTheLever" : "doNothing";
        fetch("/api/submit/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenario: "trolley",
            decision,
            session_id: sessionId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setResponseId(data.id);
          });
      
        fetch(`/api/stats/trolley/`)
          .then((res) => res.json())
          .then((data) =>
            setStats({
              top: data.pullTheLever,
              bottom: data.doNothing,
              total: data.total
            })
          );
      }

      const shared = document.querySelector('#SharedPath') as SVGPathElement
      const top = document.querySelector('#TopPath') as SVGPathElement
      const bottom = document.querySelector('#BottomPath') as SVGPathElement
  
      if (!shared || !top || !bottom) return
  
      // Merge `d` attributes for continuous paths
      const sharedD = shared.getAttribute('d')!
      const topD = top.getAttribute('d')!
      const bottomD = bottom.getAttribute('d')!
  
      const fullD = track === 'top'
        ? `${sharedD} ${topD.replace(/^M[^ ]+ [^ ]+/, '')}`
        : `${sharedD} ${bottomD.replace(/^M[^ ]+ [^ ]+/, '')}`
  
        const tl = gsap.timeline({
            onStart: () => setIsAnimating(true),
            onComplete: () => setIsAnimating(false),
          })

        tl.to(trolleyRef.current, {
            motionPath: {
              path: fullD,
              align: shared,
              alignOrigin: [0.5, 0.5],
              autoRotate: true,
              start: 0.05,
              end: 1,
            },
            duration: 3,
            ease: 'power1.inOut',
          }, 'move');
        
          tl.call(() => {
            const victims = document.querySelector(
              track === 'bottom' ? '#one-person' : '#one-person_2'
            ) as SVGGElement;
            const splat = document.querySelector(
              track === 'bottom' ? '#splat-x5' : '#splat'
            ) as SVGGElement;
          
            if (victims && splat) {
              gsap.to(victims, { opacity: 0, duration: 0.3 });
              splat.setAttribute('visibility', 'visible');
              gsap.fromTo(splat, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            }
          }, [], 'move+=1.8'); // 1.8 seconds into the trolley movement
                  
    }, [trackTrigger])

    useEffect(() => {
      if (!restore) return;
      console.log("restore", restore);
      activateTrack(restore);
    
      fetch(`/api/stats/trolley/`)
        .then((res) => res.json())
        .then((data) =>
          setStats({
            top: data.pullTheLever,
            bottom: data.doNothing,
            total: data.total
          })
        );
    
      fetch(`/api/last_decision/?scenario_name=trolley&session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.response_id) {
            setResponseId(data.response_id);
          }
        });
    }, [restore]);
    

    const handleReset = () => {

      if (responseId) {
        fetch(`/api/response/${responseId}`, { method: "DELETE" });
      }
      setResponseId(null);
      setStats(null);

        const shared = document.querySelector('#SharedPath') as SVGPathElement
        const one = document.querySelector('#one-person') as SVGGElement
        const five = document.querySelector('#one-person_2') as SVGGElement
        const splat = document.querySelector('#splat') as SVGGElement
        const splatX5 = document.querySelector('#splat-x5') as SVGGElement
      
        if (!trolleyRef.current || !shared || !one || !five || !splat || !splatX5) return
      
        // Reset trolley position
        gsap.set(trolleyRef.current, {
          motionPath: {
            path: shared,
            align: shared,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0.12,
            end: 0.12,
          },
        })
      
        // Restore victims
        gsap.set(one, { opacity: 1 })
        gsap.set(five, { opacity: 1 })
      
        // Hide splats
        splat.setAttribute('visibility', 'hidden')
        splatX5.setAttribute('visibility', 'hidden')
        gsap.set([splat, splatX5], { opacity: 0 })
      
        // Allow interaction again
        setTrack(null)
        setHasActivated(false)
      }
      

  return (
    <div className="space-y-4">
      <div text-black bg-white border-red>
        <p>A trolley is heading towards <b>five people</b> tied to the tracks.</p>
        <p>You can pull a lever to divert it to another track, where <b>one person</b> is tied up.</p>
        <br />
        <p>What do you do?</p>
      </div>

      <div className="space-x-2">
        <Button
          onClick={() => activateTrack('top')}
          disabled={hasActivated || isAnimating}
        >
          Pull the Lever
        </Button>

        <Button
          onClick={() => activateTrack('bottom')}
          disabled={hasActivated || isAnimating}
        >
          Do Nothing
        </Button>
        {hasActivated && (
        <Button variant="outline" onClick={handleReset} disabled={isAnimating}>
            Reset
        </Button>
        )}
      </div>

      {track && stats && (
        <p>
          You chose to <b>{track === "top" ? "pull the lever" : "do nothing"}</b>,
          causing <b>{track === "top" ? "1" : "5"} death{track === "bottom" ? "s" : ""}</b>.<br />
          {`${stats[track].percent}% of respondents made the same choice. ${100 - stats[track].percent}% disagreed. (${stats.total} total responses)`}
        </p>
      )}
      
      <svg viewBox="0 0 800 400" className="w-full h-[400px]">
        <g id="one-person">
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
        <clipPath id="ArtboardFrame">
        <rect height="400" width="800" x="0" y="0"/>
        </clipPath>
        <g clipPath="url(#ArtboardFrame)" id="track">
        <title>Track</title>
        <path d="M291.844 257.986C287.869 265.936 293.86 250.118 296.103 246.914C303.514 236.326 312.369 227.322 321.655 218.38C347.988 193.023 381.515 172.758 413.218 154.925C484.824 114.646 566.534 89.8549 647.875 80.3966C677.941 76.9006 708.35 76.1378 738.587 76.1378C741.122 76.1378 773.45 77.9105 764.991 79.1189" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036">
        <title>Top-Track-Top-Railing</title>
        </path>
        <path d="M16.3033 111.911C12.1663 118.117 55.9877 129.931 59.7425 130.65C110.182 140.308 159.878 156.105 210.502 164.294C267.157 173.459 320.583 192.33 376.167 205.604C444.244 221.861 512.714 236.737 579.735 257.134C625.532 271.073 672.701 282.874 719.422 293.334C734.077 296.615 749.149 297.784 763.713 301.425C767.254 302.311 777.715 305.418 774.36 303.981" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036">
        <title>Bottom-Track-Top-Railing</title>
        </path>
        <path d="M-2.0093 181.329C-6.17571 180.287 22.8635 186.034 28.2278 186.439C48.7684 187.99 63.9007 197.995 83.1656 203.048C139.098 217.719 197 225.628 252.664 242.229C282.445 251.111 313.201 255.969 342.949 264.8C482.22 306.146 622.477 334.243 765.417 358.067" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036">
        <title>Bottom-Track-Bottom-Railing</title>
        </path>
        <path d="M363.817 275.873C358.801 277.545 395.475 250.239 401.294 246.914C429.634 230.719 460.63 216.536 490.302 203.048C559.495 171.597 635.731 152.91 711.331 146.407C733.431 144.506 773.532 135.604 794.376 148.111" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036">
        <title>Top-Track-Bottom-Railing</title>
        </path>
        <g opacity="0">
        <path d="M152.235 146.935C152.171 146.261 152.683 144.69 152.045 144.915C148.617 146.122 148.547 151.352 147.544 154.845C146.679 157.862 145.853 160.891 145 163.912C142.965 171.123 141.051 178.368 138.881 185.539C136.64 192.941 128.461 207.126 133.52 215.244" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M101.26 132.026C102.047 140.402 96.1079 149.488 93.4375 157.208C87.7885 173.539 81.0817 190.357 78.4653 207.509" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M54.9788 130.937C48.1063 154.23 36.4182 175.895 30.8787 199.752" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M187.053 163.36C188.986 161.027 190.272 158.577 189.976 158.332C189.588 158.011 188.919 158.681 188.693 159.132C187.923 160.666 187.703 162.42 187.116 164.033C186.083 166.875 185.003 169.701 183.835 172.491C179.866 181.975 176.049 191.548 172.963 201.355C171.869 204.828 170.748 208.297 169.871 211.832C168.964 215.492 169.592 216.612 173.006 216.291" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M223.322 173.538C225.388 172.627 225.447 172.805 227.171 171.139C227.63 170.696 228.798 169.175 228.391 169.666C221.266 178.268 219.321 190.681 217.098 201.286C215.658 208.157 214.309 217.396 213.188 224.743" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M273.117 183.125C273.279 182.43 274.206 180.665 273.601 181.042C270.577 182.926 269.705 187.06 268.364 190.362C266.882 194.008 265.81 197.81 264.663 201.575C260.767 214.362 255.055 229.445 256.337 243.103" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M475.52 234.073C476.294 233.138 477.581 229.939 476.551 230.581C472.911 232.848 469.922 242.651 468.516 246.275C463.681 258.74 458.734 271.145 457.855 284.627C457.714 286.791 457.553 292.294 460.023 293.252" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M515.281 245.281C516.137 244.748 517.754 242.678 517.848 243.682C518.046 245.798 515.808 247.422 514.987 249.383C512.451 255.444 511.03 261.918 509.289 268.254C507.079 276.295 504.424 284.295 503.422 292.573C502.78 297.876 506.811 303.903 504.939 308.729" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M568.086 257.981C568.45 257.041 570.035 254.629 569.179 255.162C567.955 255.925 566.858 256.964 566.066 258.17C563.016 262.815 560.964 268.455 559.378 273.738C557.574 279.752 555.758 285.769 554.29 291.873C553.181 296.483 551.125 305.663 553.976 310.238" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M613.128 274.805C614.021 274.248 616.306 271.901 615.442 270.513C615.175 270.085 614.443 270.897 614.158 271.313C613.415 272.396 612.997 273.671 612.455 274.868C611.497 276.981 610.459 279.065 609.658 281.243C608.472 284.464 607.543 287.774 606.503 291.046C604.56 297.162 600.422 309.503 599.354 316.165C598.135 323.768 600.475 331.189 598.746 338.633" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M663.976 288.368C664.822 286.188 665.922 284.187 666.773 281.993C666.955 281.523 667.822 280.536 667.32 280.583C664.761 280.824 664.25 284.75 663.176 287.084C661.913 289.831 660.901 292.69 659.896 295.542C654.532 310.761 648.09 328.94 649.636 345.4" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M714.802 294.462C715.288 293.209 715.685 292.382 715.832 290.97C715.879 290.522 715.994 289.276 715.706 289.623C712.73 293.216 710.111 300.59 708.282 304.582C702.757 316.637 695.066 330.188 696.337 343.733" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M750.271 303.356C753.317 304.538 751.524 297.344 747.705 304.956C744.179 311.983 741.737 319.505 738.893 326.835C734.196 338.944 729.634 350.642 726.696 363.294" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M425.505 149.805C428.056 153.274 432.284 155.118 435.751 157.671C447.43 166.271 458.502 175.675 469.561 185.057C479.877 193.81 488.312 199.139 493.083 211.372" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M494.125 128.423C492.272 126.138 493.019 127.219 491.79 125.247C491.523 124.819 491.172 123.494 490.99 123.963C489.881 126.821 492.741 129.954 494.504 132.462C497.417 136.605 500.818 140.388 503.783 144.494C512.633 156.752 520.425 169.774 527.77 182.989C529.929 186.874 532.153 190.965 535.576 193.801" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M545.179 108.011C544.99 105.991 544.8 103.972 544.611 101.952C544.569 101.504 544.622 102.863 544.737 103.299C545.325 105.521 545.832 107.782 546.715 109.904C548.469 114.117 550.688 118.121 552.628 122.252C558.965 135.742 565.273 149.251 572.029 162.535C574.59 167.57 577.148 172.984 581.498 176.587" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M602.671 91.0692C602.558 89.8555 602.375 86.9306 601.682 87.7665C601.107 88.4607 601.596 89.6237 601.935 90.4592C603.382 94.0285 605.278 97.3988 606.985 100.851C610.307 107.566 614.03 114.093 617.022 120.961C623.171 135.074 627.666 148.926 631.227 163.769" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M656.841 89.3797C656.141 88.2555 655.402 83.6223 656.21 82.6479C656.664 82.0991 656.955 83.9012 657.072 84.6043C657.479 87.0498 657.249 89.5849 657.767 92.0092C658.868 97.1543 660.539 102.161 661.914 107.239C664.004 114.965 665.68 122.814 668.164 130.421C670.135 136.455 672.384 142.432 675.256 148.092C676.586 150.712 678.327 153.272 680.663 155.054C681.753 155.886 683.398 155.25 684.765 155.348" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M704.994 81.464C705.021 90.7291 707.355 99.8865 709.605 108.875C711.934 118.184 713.939 127.601 716.971 136.706C718.997 142.791 721.343 148.869 724.736 154.313C725.761 155.958 728.088 156.262 729.764 157.236" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M747.657 80.1756C743.815 82.5698 747.199 86.9696 747.932 90.3364C749.086 95.6402 749.94 101.006 750.795 106.366C752.144 114.836 752.982 123.387 754.542 131.821C755.742 138.308 756.839 144.88 759.068 151.09C759.955 153.564 761.83 155.635 763.738 157.442C764.104 157.789 764.103 156.503 764.285 156.033" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M751.633 79.1232C763.879 77.9737 776.801 80.6527 789.163 81.0331C793.554 81.1682 801.241 80.062 799.829 86.1438" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M773.743 83.1597C774.968 96.2109 776.091 109.179 778.081 122.141C779.006 128.16 779.892 134.19 780.461 140.253C780.503 140.702 780.934 141.887 780.587 141.6C779.653 140.825 779.567 139.39 778.925 138.36" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        <path d="M445.247 222.653C447.73 216.253 442.472 223.613 441.46 225.725C438.734 231.415 437.103 237.425 434.962 243.313C431.242 253.542 428.116 264.308 423.606 274.26C421.532 278.835 420.16 278.298 421.671 282.591" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7.11036"/>
        </g>
        <path visibility="hidden" d="M 12.756 147.012 C 22.682 151.111 360.16 233.6 370.029 237.93" id="SharedPath">
        <title>SharedPath</title>
        </path>
        <path visibility="hidden" d="M 370.029 237.93 C 379.449 240.932 716.927 323.421 726.796 327.751" id="BottomPath">
        <title>BottomPath</title>
        </path>
        <path visibility="hidden" d="M 370.029 237.93 C 366.372 180.049 878.792 70.787 775.764 108.894" id="TopPath">
        <title>TopPath</title>
        </path>
        </g>
        <g clipPath="url(#ArtboardFrame)" id="splat-x5" visibility="hidden" transform="matrix(1, 0, 0, 1, -4.82093, -68.6527)">
        <path d="M501.334 318.767C491.714 317.109 477.437 317.425 469.809 317.909C466.906 318.093 462.901 318.106 462.659 319.355C462.512 320.108 466.415 320.645 470.747 321.419C474.623 322.11 478.481 322.752 482.348 323.418C484.02 323.706 485.678 323.921 487.365 324.283C488.365 324.497 490.837 324.943 490.312 325.126C489.22 325.505 486.777 325.115 485.002 325.103C482.742 325.089 480.415 325.022 478.208 325.048C470.684 325.136 460.793 325.336 454.813 326.373C453.621 326.579 452.554 327.027 452.931 327.722C453.71 329.158 461.458 330.711 462.921 331.007C469.77 332.392 476.536 333.144 483.384 334.757C484.29 334.971 485.668 335.389 485.788 335.73C485.981 336.28 485.05 336.598 484.093 336.777C481.667 337.229 478.627 337.34 475.835 337.586C469.148 338.174 458.657 338.64 453.799 340.26C452.825 340.585 452.471 341.369 453.567 342.118C454.653 342.858 457.034 343.28 458.834 343.695C462.851 344.621 466.872 345.361 470.874 346.105C475.072 346.886 479.208 347.447 483.415 348.267C485.871 348.745 488.583 349.123 490.793 349.985C491.686 350.334 490.273 350.579 489.559 350.665C486.914 350.986 483.837 351.042 480.904 351.182C477.077 351.365 472.965 351.357 469.28 351.634C466.633 351.833 463.575 351.888 461.963 352.605C461.388 352.861 462.448 353.817 463.676 354.128C468.188 355.27 472.712 355.789 477.158 356.452C483.917 357.46 490.545 358.231 497.246 359.133C504.354 360.09 511.37 360.86 518.588 362.031C522.357 362.642 526.444 363.216 530.042 364.451C531.535 364.964 531.579 365.905 530.981 366.287C529.827 367.025 527.259 367.172 525.231 367.528C522.446 368.018 519.071 368.198 516.554 368.823C514.695 369.284 511.54 369.547 512.225 370.755C512.737 371.656 516.561 372.428 518.871 372.905C525.405 374.256 531.846 375.157 538.269 376.137C554.341 378.59 570.296 380.683 586.575 383.683C589.663 384.252 592.878 384.909 595.876 385.844C596.589 386.067 596.579 386.551 596.168 386.676C595.109 386.996 593.416 386.996 591.882 387.053C589.142 387.154 585.9 386.909 583.374 387.149C581.927 387.286 579.728 387.401 580.195 388.163C580.564 388.765 583.223 389.109 584.752 389.395C590.738 390.517 596.709 391.52 602.581 392.357C617.251 394.449 631.731 396.169 645.956 397.602C649.784 397.987 653.467 398.2 657.139 398.413C657.41 398.429 657.977 398.365 657.683 398.284C655.005 397.547 648.784 396.772 647.064 396.565C646.423 396.488 644.606 396.364 645.267 396.478C654.676 398.1 663.325 398.359 672.065 398.977C677.533 399.364 683.208 399.925 688.329 399.995C690.802 400.029 693.297 399.908 694.559 399.283C695.215 398.959 694.492 398.097 693.348 397.512C691.54 396.587 688.896 395.994 686.66 395.243C683.664 394.237 680.399 393.387 677.652 392.239C676.807 391.886 676.157 391.247 676.65 391.062C680.651 389.559 689.863 390.889 697.074 391.346C702.381 391.683 707.828 392.159 713.066 392.429C715.838 392.571 718.777 392.794 721.072 392.581C721.92 392.503 722.69 392.069 721.909 391.609C720.548 390.808 718.2 390.281 716.246 389.74C710.669 388.198 704.515 387.346 699.399 385.386C698.246 384.944 696.71 384.044 697.373 383.809C699.019 383.224 702.232 383.444 704.899 383.432C714.806 383.388 726.168 384.376 735.003 383.599C736.477 383.469 738.812 383.22 737.826 382.411C736.614 381.418 733.264 380.812 730.866 380.207C725.775 378.922 720.639 377.894 715.524 376.781C711.601 375.927 707.68 375.195 703.757 374.306C700.098 373.478 696.133 372.898 692.805 371.637C691.363 371.091 690.792 369.974 691.865 369.801C695.251 369.255 700.104 369.609 704.513 369.749C710.453 369.939 716.841 370.542 722.846 370.789C727.908 370.997 733.462 371.516 737.689 371.115C739.762 370.919 742.438 370.232 740.805 369.086C738.483 367.454 733.402 366.396 729.478 365.347C723.879 363.852 718.167 362.645 712.526 361.532C704.633 359.976 696.816 358.734 688.97 357.36C683.216 356.353 677.513 355.531 671.725 354.388C670.061 354.059 667.317 353.649 666.813 352.983C666.273 352.268 668.698 352.304 670.075 352.206C677.736 351.66 687.092 352.215 694.222 351.346C695.01 351.25 695.649 350.738 694.745 350.32C692.302 349.191 689.106 348.317 686.134 347.608C680.006 346.147 673.843 344.983 667.741 343.88C660.715 342.609 653.787 341.612 646.817 340.496C641.614 339.663 636.486 339.051 631.224 338.032C629.427 337.683 626.406 337.163 625.957 336.454C625.352 335.499 627.828 335.281 629.24 334.899C631.731 334.227 636.663 334.709 638.231 333.659C638.532 333.457 637.236 332.858 636.413 332.676C632.406 331.79 628.384 331.132 624.498 330.622C610.841 328.832 597.709 327.805 584.51 326.631C579.835 326.215 575.259 325.913 570.546 325.452C569.247 325.324 566.934 325.418 566.512 324.868C565.985 324.181 568.309 324.23 569.46 324.037C571.383 323.714 573.8 323.666 575.69 323.325C576.776 323.13 578.712 323.085 578.325 322.44C577.981 321.867 575.73 321.236 574.271 320.96C568.792 319.925 563.38 319.197 558.134 318.625C549.799 317.716 542.313 317.755 534.407 317.325C532.022 317.195 529.653 317.088 527.174 316.86C524.005 316.567 522.241 315.709 519.189 315.93C516.023 316.158 512.738 317.307 510.805 318.056C510.38 318.22 510.163 318.466 509.842 318.671" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.15786"/>
        <path d="M528.194 335.287C527.596 334.515 525.3 334.798 524.746 334.836C523.322 334.932 521.943 335.066 520.583 335.214C517.523 335.546 514.078 335.983 512.935 337.346C511.947 338.525 517.372 340.452 519.224 341.386C520.867 342.214 522.567 343.033 524.022 343.916C535.007 350.585 521.97 350.801 512.87 350.615" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M543.678 337.109C542.755 337.065 545.221 339.464 545.382 339.812C545.962 341.062 546.489 342.309 546.836 343.527C547.91 347.309 548.863 351.087 548.02 354.489" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M542.801 337.227C544.916 335.873 558.653 337.896 561.355 340.346C565.947 344.509 553.981 346.046 548.749 346.752" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M575.624 341.598C575.146 341.374 574.924 342.701 574.801 342.87C573.611 344.503 573.044 346.24 572.975 348.189C572.89 350.588 573.724 352.88 571.842 354.819C571.379 355.296 568.769 356.19 569.571 357.142C570.941 358.768 574.993 358.447 576.997 358.646C580.426 358.985 584.016 359.981 587.473 360.838" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M598.514 364.176C599.208 362.74 601.543 362.205 603.478 361.245C605.809 360.088 607.439 358.79 609.027 357.318C610.944 355.542 610.665 352.78 613.706 351.432C614.387 351.129 616.765 351.105 618.044 351.03C618.532 351.001 619.208 350.744 619.575 351.006C620.275 351.506 618.818 351.712 618.464 352.073C617.684 352.868 617.516 354.157 617.552 355.068C617.606 356.437 619.074 358.971 619.332 360.206C619.893 362.897 617.606 364.779 618.217 367.445" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M606.578 358.993C610.653 359.814 614.682 361.08 618.765 361.81" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M647.079 357.348C645.999 361.708 648.457 366.888 646.404 371.078C646.185 371.524 644.467 373.908 643.162 373.165" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M630.024 353.996C630.85 353.814 632.304 354.146 633.488 354.384C637.416 355.176 641.345 355.968 645.273 356.766C651.56 358.044 657.848 359.364 664.134 360.699" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        </g>
        <g id="splat" visibility="hidden" transform="matrix(1, 0, 0, 1, -6.54677, -64.3734)">
        <path d="M562.951 178.888C559.632 179.591 554.933 183.331 552.448 185.633C551.503 186.51 550.178 187.485 550.2 188.756C550.214 189.523 551.549 189.106 553.046 188.815C554.385 188.555 555.715 188.25 557.049 187.967C557.626 187.845 558.192 187.655 558.78 187.601C559.129 187.568 559.984 187.407 559.824 187.71C559.494 188.341 558.654 188.549 558.065 188.965C557.316 189.494 556.541 189.989 555.813 190.545C553.33 192.439 550.073 195.011 548.179 197.454C547.801 197.942 547.485 198.632 547.667 199.217C548.042 200.423 550.734 200.068 551.242 200.003C553.622 199.701 555.923 198.805 558.321 198.725C558.639 198.714 559.129 198.789 559.196 199.091C559.305 199.579 559.024 200.112 558.722 200.515C557.956 201.537 556.959 202.375 556.055 203.285C553.89 205.464 550.457 208.438 548.982 211.178C548.686 211.727 548.633 212.574 549.057 213.037C549.477 213.495 550.3 213.332 550.93 213.302C552.335 213.235 553.726 212.987 555.111 212.747C556.565 212.496 557.979 212.047 559.439 211.831C560.291 211.705 561.219 211.419 562.021 211.725C562.345 211.849 561.898 212.427 561.669 212.682C560.819 213.629 559.806 214.423 558.847 215.264C557.595 216.362 556.234 217.343 555.037 218.497C554.177 219.326 553.17 220.115 552.695 221.198C552.526 221.585 552.955 222.258 553.387 222.265C554.973 222.289 556.513 221.705 558.039 221.28C560.358 220.633 562.615 219.789 564.906 219.054C567.337 218.274 569.722 217.335 572.206 216.736C573.504 216.423 574.903 215.998 576.195 216.332C576.731 216.471 576.823 217.374 576.656 217.889C576.335 218.882 575.497 219.642 574.855 220.476C573.974 221.62 572.872 222.607 572.09 223.818C571.513 224.712 570.49 225.727 570.816 226.734C571.059 227.486 572.388 227.316 573.191 227.224C575.464 226.964 577.669 226.291 579.875 225.698C585.395 224.215 590.847 222.411 596.48 221.41C597.548 221.22 598.666 221.085 599.735 221.272C599.989 221.317 600.025 221.79 599.9 222.009C599.576 222.575 599.015 222.982 598.512 223.406C597.614 224.163 596.521 224.704 595.704 225.544C595.237 226.025 594.518 226.665 594.736 227.293C594.907 227.789 595.815 227.483 596.344 227.393C598.417 227.043 600.476 226.581 602.488 225.982C607.514 224.486 612.446 222.675 617.271 220.646C618.57 220.1 619.806 219.421 621.039 218.746C621.13 218.696 621.312 218.497 621.208 218.49C620.261 218.418 618.139 219.162 617.553 219.374C617.334 219.453 616.723 219.77 616.951 219.722C620.198 219.034 623.081 217.206 626.024 215.705C627.865 214.767 629.789 213.947 631.49 212.784C632.311 212.222 633.127 211.505 633.493 210.595C633.684 210.122 633.374 209.46 632.947 209.167C632.273 208.704 631.35 208.764 630.548 208.572C629.474 208.316 628.324 208.275 627.321 207.822C627.012 207.683 626.745 207.219 626.893 206.92C628.094 204.5 631.251 203.576 633.675 202.286C635.459 201.337 637.3 200.49 639.056 199.493C639.985 198.965 640.976 198.474 641.718 197.716C641.992 197.436 642.211 196.83 641.915 196.572C641.399 196.121 640.579 196.174 639.888 196.119C637.916 195.963 635.809 196.614 633.956 195.941C633.538 195.79 632.956 195.286 633.156 194.898C633.653 193.934 634.734 193.376 635.616 192.723C638.891 190.299 642.732 188.527 645.592 185.648C646.069 185.168 646.821 184.365 646.429 183.817C645.946 183.144 644.788 183.362 643.945 183.351C642.155 183.327 640.371 183.564 638.587 183.713C637.219 183.827 635.861 184.059 634.49 184.14C633.211 184.215 631.852 184.606 630.647 184.182C630.125 183.998 629.845 183.051 630.186 182.625C631.261 181.282 632.896 180.458 634.367 179.534C636.348 178.29 638.511 177.34 640.519 176.137C642.211 175.122 644.092 174.291 645.458 172.885C646.128 172.196 646.957 170.887 646.323 170.166C645.42 169.141 643.652 169.335 642.268 169.26C640.292 169.155 638.303 169.356 636.345 169.632C633.606 170.019 630.917 170.693 628.208 171.245C626.221 171.65 624.267 172.224 622.257 172.505C621.68 172.586 620.738 172.848 620.517 172.322C620.279 171.758 621.085 171.21 621.533 170.784C624.023 168.412 627.165 166.702 629.453 164.145C629.706 163.862 629.875 163.211 629.542 163.023C628.641 162.514 627.512 162.434 626.47 162.461C624.322 162.515 622.187 162.868 620.078 163.263C617.649 163.718 615.274 164.417 612.876 165.008C611.086 165.45 609.339 166.089 607.514 166.364C606.891 166.458 605.848 166.679 605.642 166.099C605.363 165.318 606.165 164.511 606.601 163.801C607.37 162.549 609.042 161.832 609.474 160.436C609.558 160.167 609.08 159.897 608.792 159.919C607.394 160.022 606.009 160.349 604.681 160.789C600.015 162.335 595.585 164.494 591.121 166.528C589.54 167.248 588 168.055 586.403 168.74C585.963 168.928 585.205 169.575 585.02 169.143C584.789 168.603 585.563 168.092 585.928 167.627C586.538 166.851 587.333 166.224 587.931 165.439C588.274 164.988 588.911 164.479 588.731 163.946C588.57 163.472 587.773 163.401 587.267 163.484C585.37 163.796 583.519 164.391 581.736 165.097C578.903 166.218 576.429 168.055 573.778 169.538C572.978 169.986 572.185 170.451 571.346 170.825C570.273 171.304 569.619 170.895 568.627 171.842C567.598 172.825 566.605 174.73 566.027 175.921C565.9 176.183 565.848 176.474 565.759 176.75" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.15786"/>
        <path d="M573.194 188.467C572.932 187.861 572.196 188.688 572.015 188.858C571.552 189.294 571.107 189.756 570.669 190.226C569.683 191.284 568.579 192.536 568.313 194.134C568.082 195.516 570.036 196.082 570.725 196.544C571.336 196.953 571.966 197.339 572.52 197.846C576.702 201.679 572.405 205.022 569.379 207.03" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M578.467 186.513C578.158 186.693 579.17 188.429 579.252 188.728C579.547 189.802 579.823 190.885 580.038 191.985C580.703 195.397 581.328 198.835 581.328 202.341" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M578.187 186.839C578.775 185.016 583.487 183.677 584.582 185.406C586.443 188.344 582.609 192.712 580.935 194.655" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M589.407 183.192C589.23 183.089 589.265 184.43 589.239 184.625C588.979 186.496 588.933 188.318 589.07 190.226C589.239 192.575 589.703 194.6 589.239 196.935C589.124 197.509 588.334 199.004 588.677 199.735C589.264 200.984 590.579 199.699 591.258 199.41C592.421 198.915 593.691 199.019 594.905 199.019" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M598.832 199.605C598.944 198.045 599.673 196.964 600.234 195.567C600.911 193.883 601.344 192.232 601.749 190.421C602.238 188.237 601.919 185.623 602.815 183.583C603.016 183.126 603.8 182.53 604.218 182.15C604.377 182.005 604.579 181.593 604.723 181.759C604.995 182.075 604.53 182.626 604.442 183.061C604.249 184.02 604.299 185.312 604.386 186.188C604.516 187.503 605.209 189.61 605.396 190.747C605.802 193.224 605.2 195.601 605.62 198.042" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M601.076 192.636C602.492 192.453 603.929 192.714 605.34 192.44" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M614.344 181.303C614.344 185.795 615.582 190.232 615.246 194.793C615.21 195.278 614.837 198.006 614.344 197.598" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        <path d="M608.425 182.15C608.684 181.774 609.192 181.747 609.603 181.694C610.968 181.518 612.333 181.342 613.699 181.173C615.884 180.902 618.073 180.672 620.263 180.456" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.36603"/>
        </g>
        <g ref={trolleyRef} transform="scale(0.5, 0.5)">
        <path d="M55.7349 36.7064L222.949 74.4527L199.864 176.719L32.6496 138.973L55.7349 36.7064Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
        <path d="M28.711 156.421C30.8862 146.784 38.8883 140.381 46.5841 142.118C54.28 143.856 58.7553 153.076 56.5801 162.712C54.4048 172.348 46.4028 178.751 38.707 177.014C31.0111 175.277 26.5358 166.057 28.711 156.421Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
        <path d="M56.5801 162.712C58.7553 153.076 66.7574 146.672 74.4532 148.409C82.149 150.147 86.6243 159.367 84.4491 169.003C82.2739 178.639 74.2718 185.042 66.576 183.305C58.8802 181.568 54.4048 172.348 56.5801 162.712Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
        <path d="M84.4491 169.003C86.6243 159.367 94.6264 152.963 102.322 154.701C110.018 156.438 114.493 165.658 112.318 175.294C110.143 184.93 102.141 191.333 94.4451 189.596C86.7492 187.859 82.2739 178.639 84.4491 169.003Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
        <path d="M168.056 187.876C170.232 178.24 178.234 171.836 185.929 173.574C193.625 175.311 198.101 184.531 195.925 194.167C193.75 203.803 185.748 210.206 178.052 208.469C170.356 206.732 165.881 197.512 168.056 187.876Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
        <path d="M140.187 181.585C142.362 171.949 150.365 165.545 158.06 167.283C165.756 169.02 170.232 178.24 168.056 187.876C165.881 197.512 157.879 203.915 150.183 202.178C142.487 200.441 138.012 191.221 140.187 181.585Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
        <path d="M112.318 175.294C114.493 165.658 122.495 159.254 130.191 160.992C137.887 162.729 142.362 171.949 140.187 181.585C138.012 191.221 130.01 197.624 122.314 195.887C114.618 194.15 110.143 184.93 112.318 175.294Z" fill="#ffffff" fillRule="nonzero" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
        <g opacity="1">
            <path d="M76.0939 74.7165C67.511 72.779 60.2522 85.484 57.5723 93.9053C56.8467 96.1857 53.5247 110.603 55.7859 108.742L69.3644 112.559C62.0028 110.797 55.2765 109.417 56.8547 111.023L77.9307 114.948L83.6113 116.553C86.3393 104.467 89.0067 77.6313 76.0939 74.7165Z" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
            <path d="M116.026 83.7306C107.443 81.7931 100.184 94.4981 97.5044 102.919C96.7788 105.2 93.4568 119.617 95.718 117.756L109.297 121.573C101.935 119.811 95.2086 118.431 96.7868 120.037L117.863 123.963L123.543 125.567C126.271 113.482 128.939 86.6455 116.026 83.7306Z" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
            <path d="M192.666 101.031C184.083 99.0935 176.824 111.799 174.144 120.22C173.419 122.5 170.097 136.917 172.358 135.057L185.936 138.873C178.575 137.111 171.849 135.731 173.427 137.337L194.503 141.263L200.183 142.867C202.911 130.782 205.579 103.946 192.666 101.031Z" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
            <path d="M152.734 92.0169C144.151 90.0794 136.892 102.784 134.212 111.206C133.487 113.486 130.165 127.903 132.426 126.043L146.004 129.859C138.643 128.097 131.916 126.717 133.495 128.323L154.571 132.249L160.251 133.853C162.979 121.768 165.647 94.9318 152.734 92.0169Z" fill="none" opacity="1" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"/>
        </g>
        </g>
      </svg>
    </div>
  )
}
