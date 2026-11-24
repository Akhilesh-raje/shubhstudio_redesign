import { useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { content } from "./content";
import { useHeroMotion } from "./useHeroMotion";
import Monogram from "./Monogram";
import "./styles/hero.css";

const A = "/assets/wedding";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useHeroMotion(root);
  const busy = useRef(false);

  // Opening: a slow user-initiated scroll into the invitation; the scroll-linked hero exit (useHeroMotion) plays during it.
  const open = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (busy.current) return; // ignore double clicks while the opening runs
    busy.current = true;
    const target = document.getElementById("invitation")!;
    const done = () => { busy.current = false; target.focus({ preventScroll: true }); };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { target.scrollIntoView(); done(); return; }
    gsap.to(window, { duration: 1.8, ease: "power2.inOut", scrollTo: { y: target, autoKill: true }, onComplete: done, onInterrupt: done });
  };

  return (
    <section ref={root} className="hero" aria-labelledby="hero-names">
      <img className="hero__hills" src={`${A}/backgrounds/hills-distant.png`} alt="" />
      <img className="hero__pavilion hero__pavilion--left" src={`${A}/hero/pavilion-left.png`} alt="" />
      <img className="hero__pavilion hero__pavilion--right" src={`${A}/hero/pavilion-left.png`} alt="" />
      <img className="hero__corner hero__corner--left" src={`${A}/hero/floral-corner-left.png`} alt="" />
      <img className="hero__corner hero__corner--right" src={`${A}/hero/floral-corner-left.png`} alt="" />

      <div className="hero__stage">
        <div className="hero__stage-inner">
        <img className="hero__arch" src={`${A}/hero/arch-frame.png`} alt="" />
        <div className="hero__card">
          <Monogram className="hero__monogram" />
          <p className="label hero__invite">{content.invite}</p>
          <h1 id="hero-names" className="hero__names">
            {content.names[0]} <span>&amp;</span> {content.names[1]}
          </h1>
          <img className="hero__divider" src={`${A}/ornaments/divider-gold.png`} alt="" />
          <p className="label hero__date">{content.date}</p>
          <p className="hero__place">{content.place}</p>
          <a className="button hero__cta" href="#invitation" onClick={open}>{content.cta}</a>
        </div>
        </div>
      </div>
    </section>
  );
}
