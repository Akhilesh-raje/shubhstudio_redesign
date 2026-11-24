import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const EASE = "power2.out";

/* One motion system for every scene, driven by data attributes (no per-component animation code):
   data-intro         page-load entrance, in document order (hero); readable in under ~2 s
   data-reveal        fade + 12 px rise when scrolled into view; reverses when scrolling back
   data-stagger       same, for each child in turn
   data-depth="n"     scroll-linked parallax; larger n = farther away = more lag (negative = moves against)
   data-float         slow ambient bob (lotus, florals)
   data-drift         slow ambient sideways drift (water)
   data-mask          clip-path reveal tied to scroll (venue photo)
   data-seal          wax seal lifts off the card as the invitation scrolls away
   data-exit          content drifts up and softens as its scene leaves the screen
   Never put two of these on one element: they would fight over opacity/y. Nest wrappers instead.
   Reduced motion: nothing runs, everything is visible as authored. */
export function useSiteMotion(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    // shortcut: device scale is read once, so rotating a phone never rebuilds (and replays) the reveals; a reload picks up the new size.
    const k = window.innerWidth <= 700 ? 0.5 : 1; // ART_DIRECTION: halve movement on mobile
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      const inView = (el: Element) => ({ trigger: el, start: "top 85%", toggleActions: "play none none reverse" });
      const across = (el: Element) => ({ trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true });

      const intro = q("[data-intro]");
      if (intro.length) gsap.from(intro, { opacity: 0, y: 16, duration: 0.9, ease: EASE, stagger: 0.11, delay: 0.1 });

      q("[data-reveal]").forEach((el) =>
        gsap.from(el, { opacity: 0, y: 12, duration: 0.8, ease: EASE, scrollTrigger: inView(el) }));

      q("[data-stagger]").forEach((el) =>
        gsap.from(el.children, { opacity: 0, y: 12, duration: 0.8, ease: EASE, stagger: 0.12, scrollTrigger: inView(el.firstElementChild ?? el) })); // first child: wrappers of absolutely placed art have zero height

      q("[data-depth]").forEach((el) => {
        const d = Number((el as HTMLElement).dataset.depth) * 40 * k;
        gsap.fromTo(el, { y: -d }, { y: d, ease: "none", scrollTrigger: across(el) });
      });

      // Ambient loops only run while their scene is on screen (saves battery and frames elsewhere).
      const onScreen = (el: Element) => ({ trigger: el.closest("section"), start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" });
      q("[data-float]").forEach((el, i) =>
        gsap.to(el, { y: -6 * k, rotation: i % 2 ? 1.5 : -1.5, duration: 5 + (i % 3), ease: "sine.inOut", yoyo: true, repeat: -1, scrollTrigger: onScreen(el) }));

      q("[data-drift]").forEach((el) =>
        gsap.to(el, { x: 18 * k, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1, scrollTrigger: onScreen(el) }));

      q("[data-mask]").forEach((el) =>
        gsap.fromTo(el, { clipPath: "inset(8% 8% 8% 8%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 45%", scrub: true },
        }));

      q("[data-seal]").forEach((el) =>
        gsap.to(el, {
          y: -110 * k, x: 50 * k, rotation: 16, opacity: 0, ease: "none",
          scrollTrigger: { trigger: el.closest("section"), start: "top top", end: "top -35%", scrub: true },
        }));

      q("[data-exit]").forEach((el) =>
        gsap.to(el, { y: -40 * k, opacity: 0.3, ease: "none", scrollTrigger: { trigger: el, start: "bottom 35%", end: "bottom top", scrub: true } }));

      // Image sizes change layout after load; recompute trigger positions so nothing stays hidden.
      const refresh = () => ScrollTrigger.refresh();
      if (document.readyState === "complete") refresh(); else window.addEventListener("load", refresh, { once: true });
      return () => window.removeEventListener("load", refresh);
    });

    return () => mm.revert(); // kills every tween, ScrollTrigger and loop above
  }, [root]);
}
