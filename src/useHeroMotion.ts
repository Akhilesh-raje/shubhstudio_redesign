import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Slow, ceremonial entrance (Hero v1.1 review): opacity plus a few px of drift, no bounce, no zoom.
// Reduced motion: nothing runs, so the static composition shows as-is.
export function useHeroMotion(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      gsap.timeline({ defaults: { ease: "power1.out", duration: 1.6 } })
        .from(q(".hero__hills"), { opacity: 0, duration: 2.4 }, 0)
        .from(q(".hero__corner"), { opacity: 0, duration: 2.4 }, 0.2)
        .from(q(".hero__pavilion"), { opacity: 0, y: 24, duration: 2.2 }, 0.5)
        .from(q(".hero__arch"), { opacity: 0, duration: 2 }, 1.0)
        .from(q(".hero__monogram"), { opacity: 0 }, 1.8)
        .from(q(".hero__invite"), { opacity: 0, y: 8 }, 2.2)
        .from(q(".hero__names"), { opacity: 0, y: 10, duration: 2 }, 2.7)
        .from(q(".hero__divider, .hero__date, .hero__place"), { opacity: 0, y: 6, stagger: 0.25 }, 3.4)
        .from(q(".hero__cta"), { opacity: 0, duration: 1.4 }, 4.3);

      // Exit, tied to scroll (reverses when scrolling back): the pavilions part, the corners lift, the invitation rises away.
      // Uses properties the entrance doesn't touch (xPercent, yPercent, a wrapper) so the two never fight.
      gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
        .to(q(".hero__pavilion--left"), { xPercent: -22 }, 0)
        .to(q(".hero__pavilion--right"), { xPercent: 22 }, 0)
        .to(q(".hero__corner"), { yPercent: -25 }, 0)
        .to(q(".hero__stage-inner"), { y: -70, opacity: 0 }, 0);
    });
    return () => mm.revert(); // also covers React StrictMode's double mount
  }, [root]);
}
