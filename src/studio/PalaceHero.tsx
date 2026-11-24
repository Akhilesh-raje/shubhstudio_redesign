import { useEffect, useLayoutEffect, useRef, type MouseEvent, type RefObject } from "react";
import gsap from "gsap";
import { studio as s } from "./content";
import { waLink } from "./whatsapp";
import "./palace-card.css";

// Hero: the whole palace in miniature, inside an invitation card. Clicking it flies into the full palace (/palace/).
const A = "/assets/wedding";
const PALACE_URL = "/palace/";
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function PalaceCard({ onEnter }: { onEnter: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a className="pcard" href={PALACE_URL} onClick={onEnter} aria-label="Enter the Palace in Bloom, our flagship wedding invitation">
      <div className="pcard__face">
        <div className="pcard__archbox">
          {/* Approved Scene 03 layers, far to near. data-layer = pointer-parallax strength in px. */}
          <div className="pcard__window">
            <img className="pc pc--sky" src={`${A}/backgrounds/sky-pale.webp`} alt="" data-layer="4" />
            <img className="pc pc--hills" src={`${A}/backgrounds/hills-distant.png`} alt="" data-layer="7" />
            <img className="pc pc--chhatri" src={`${A}/palace/chhatri-tall.png`} alt="" data-layer="10" />
            <img className="pc pc--chhatri pc--right" src={`${A}/palace/chhatri-tall.png`} alt="" data-layer="10" />
            <img className="pc pc--palace" src={`${A}/palace/palace-main.png`} alt="" data-layer="12" />
            <div className="pc pc--garden" data-layer="15" />
            <div className="pc pc--water" data-layer="18">
              <img className="pc__waterimg" src={`${A}/palace/water.png`} alt="" data-drift />
              <img className="pc__lotus" style={{ left: "16%" }} src={`${A}/florals/lotus-single.png`} alt="" data-float />
              <img className="pc__lotus" style={{ left: "60%" }} src={`${A}/florals/lotus-single.png`} alt="" data-float />
            </div>
            <div className="pc pc--peacocks" data-layer="24">
              <img className="pc__peacock" src={`${A}/peacocks/peacock-left.png`} alt="" />
              <img className="pc__peacock pc--right" src={`${A}/peacocks/peacock-left.png`} alt="" />
            </div>
          </div>
          <img className="pcard__arch" src={`${A}/hero/arch-frame.png`} alt="" />
        </div>
        <p className="pcard__title">The Palace in Bloom</p>
        <span className="pcard__enter">Enter the palace <span aria-hidden="true">→</span></span>
      </div>
      <img className="pcard__corner" src={`${A}/hero/floral-corner-left.png`} alt="" />
      <img className="pcard__corner pcard__corner--right" src={`${A}/hero/floral-corner-left.png`} alt="" />
    </a>
  );
}

// Pointer tilt: the card turns in 3D and the scene layers shift by depth. Fine pointers only; off for reduced motion.
function usePalaceTilt(wrap: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      const el = wrap.current!;
      const card = el.querySelector(".pcard")!;
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: "power3.out" });
      const layers = [...el.querySelectorAll<HTMLElement>("[data-layer]")].map((l) => ({
        d: Number(l.dataset.layer),
        x: gsap.quickTo(l, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(l, "y", { duration: 0.9, ease: "power3.out" }),
      }));
      const move = (e: PointerEvent) => {
        if (el.dataset.entering) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        rx(-py * 9); ry(px * 11);
        layers.forEach((l) => { l.x(-px * l.d); l.y(-py * l.d * 0.5); });
      };
      const leave = () => { rx(0); ry(0); layers.forEach((l) => { l.x(0); l.y(0); }); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    });
    return () => mm.revert();
  }, [wrap]);
}

export default function PalaceHero() {
  const section = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  usePalaceTilt(wrap);

  // Back button after entering: the browser may restore the zoomed-in page from cache; reload it fresh.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) location.reload(); };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  // Entering: the card turns flat and flies forward until its window fills the screen, the arch passes overhead, then the palace opens.
  const enter = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = wrap.current!;
    if (el.dataset.entering) return; // ignore double clicks
    el.dataset.entering = "1";
    if (reduceMotion()) { location.href = PALACE_URL; return; }
    const card = el.querySelector<HTMLElement>(".pcard")!;
    const win = card.querySelector<HTMLElement>(".pcard__window")!;
    gsap.killTweensOf(card);
    gsap.set(card, { rotationX: 0, rotationY: 0 });
    const c = card.getBoundingClientRect(), w = win.getBoundingClientRect();
    const s = Math.max(innerWidth / w.width, innerHeight / w.height) * 1.12;
    const cx = c.left + c.width / 2, cy = c.top + c.height / 2, wx = w.left + w.width / 2, wy = w.top + w.height / 2;
    section.current!.classList.add("is-entering");
    gsap.timeline({ onComplete: () => { location.href = PALACE_URL; } })
      .to([".s-hero__text", ".nav", ".s-hero__hills"], { opacity: 0, duration: 0.5, ease: "power1.out" }, 0)
      .to(card, { x: innerWidth / 2 - cx - s * (wx - cx), y: innerHeight / 2 - cy - s * (wy - cy), scale: s, duration: 1.7, ease: "power3.inOut" }, 0.1)
      .to(card.querySelectorAll(".pcard__arch, .pcard__corner, .pcard__title, .pcard__enter"), { scale: 1.6, opacity: 0, duration: 1.1, ease: "power2.in" }, 0.55)
      .to(".s-hero__veil", { opacity: 1, duration: 0.45, ease: "power1.in" }, 1.55);
  };

  return (
    <section ref={section} id="top" className="s-hero" tabIndex={-1} aria-labelledby="hero-title">
      <img className="s-hero__hills" src={`${A}/backgrounds/hills-distant.png`} alt="" data-depth="0.8" />
      <div className="s-hero__text">
        <p className="eyebrow" data-intro>{s.hero.label}</p>
        <h1 id="hero-title" className="s-hero__title">
          {s.hero.title.map((line) => <span key={line} data-intro>{line}</span>)}
        </h1>
        <p className="s-hero__lede" data-intro>{s.hero.text}</p>
        <div className="s-hero__ctas" data-intro>
          <a className="button button--solid" href="#templates">See templates</a>
          <a className="button" href={waLink("Hi Shubh Studio! I'd like to know more about wedding invites.")} target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
        </div>
        <ul className="s-hero__trust" data-intro>{s.hero.trust.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
      <div ref={wrap} className="s-hero__cardwrap" data-intro>
        <PalaceCard onEnter={enter} />
      </div>
      <div className="s-hero__veil" aria-hidden="true" />
    </section>
  );
}
