import { Fragment, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { studio as s, type TemplateId } from "./content";
import Invite, { type Template } from "./Invite";
import "./showcase.css";

// Sample invitations as physical stationery: card + envelope + monogram + palette.
// Motion: entrance (once), barely-there idle float, pointer tilt with layered depth, click opens a gatefold invitation.
const A = "/assets/wedding";
const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const ENTER_FROM: Record<TemplateId, gsap.TweenVars> = {
  floral: { x: -90, rotation: -9 },
  royal: { y: 70 },
  minimal: { x: 90, rotation: 9 },
};
const PALETTE: Record<TemplateId, string[]> = {
  royal: ["#5e1a24", "#c9a86a", "#e6d3b4"],
  floral: ["#ecd7ce", "#66775f", "#7894b1"],
  minimal: ["#fbf8f3", "#2a2420", "#b9b0a5"],
};
const INNER_LINE: Record<TemplateId, string> = {
  royal: "request the honour of your presence at the wedding of",
  floral: "invite you to celebrate the wedding of",
  minimal: "would love you to join them for the wedding of",
};

/* ---------- The opened invitation (portal dialog) ---------- */
function Opened({ t, from, onClose, onChoose }: { t: Template; from: HTMLElement; onClose: () => void; onChoose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current!;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden"; // no page scroll behind the dialog
    el.querySelector<HTMLElement>(".op__close")!.focus();
    if (!reduce()) {
      const sheet = el.querySelector<HTMLElement>(".op__sheet")!;
      const f = from.getBoundingClientRect(), r = sheet.getBoundingClientRect();
      tl.current = gsap.timeline()
        .from(el.querySelector(".op__backdrop"), { opacity: 0, duration: 0.5, ease: "power1.out" }, 0)
        .from(sheet, {
          x: f.left + f.width / 2 - (r.left + r.width / 2), y: f.top + f.height / 2 - (r.top + r.height / 2),
          scale: f.width / r.width, duration: 0.9, ease: "power3.inOut",
        }, 0)
        .to(el.querySelector(".op__cover--l"), { rotationY: -160, duration: 1.1, ease: "power2.inOut" }, 0.85)
        .to(el.querySelector(".op__cover--r"), { rotationY: 160, duration: 1.1, ease: "power2.inOut" }, 0.95)
        .from(el.querySelectorAll(".op__inner > *"), { opacity: 0, y: 10, stagger: 0.09, duration: 0.6, ease: "power2.out" }, 1.4)
        .from(el.querySelectorAll(".op__actions, .op__close"), { opacity: 0, duration: 0.5 }, 1.8);
    } else {
      gsap.set(el.querySelectorAll(".op__cover"), { autoAlpha: 0 }); // reduced motion: show the inside at once
    }
    return () => { tl.current?.kill(); document.documentElement.style.overflow = prevOverflow; };
  }, [from]);

  const close = (then = onClose) => {
    if (closing.current) return;
    closing.current = true;
    const t1 = tl.current;
    if (!t1 || reduce()) return then();
    t1.eventCallback("onReverseComplete", then);
    t1.timeScale(1.7).reverse();
  };

  // Escape closes; Tab stays inside the dialog.
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    const f = [...ref.current!.querySelectorAll<HTMLElement>("a[href], button")];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return createPortal(
    <div ref={ref} className={`op op--${t.id}`} role="dialog" aria-modal="true" aria-labelledby="op-names" onKeyDown={onKey}>
      <div className="op__backdrop" onClick={() => close()} />
      <button className="op__close" type="button" onClick={() => close()}>Close <span aria-hidden="true">×</span></button>
      <div className="op__stage">
        <div className="op__sheet">
          <div className="op__inner">
            {t.id === "royal" && <p className="op__blessing" lang="hi">॥ श्री गणेशाय नमः ॥</p>}
            <p className="op__small">Together with their families</p>
            <p className="op__line">{INNER_LINE[t.id]}</p>
            <h2 id="op-names" className="op__names">{t.couple.split(" & ")[0]} <span>&amp;</span> {t.couple.split(" & ")[1]}</h2>
            <p className="op__date">{t.date}</p>
            <p className="op__small op__style">Sample invitation · {t.style}</p>
          </div>
          {(["l", "r"] as const).map((side, i) => (
            <div key={side} className={`op__cover op__cover--${side}`} aria-hidden="true">
              <div className="op__face op__face--front"><span>{t.initials[i]}</span></div>
              <div className="op__face op__face--back" />
            </div>
          ))}
        </div>
        <div className="op__actions">
          <a className="button button--solid" href={t.demo} target="_blank" rel="noopener noreferrer">Explore this invitation <span aria-hidden="true">↗</span></a>
          <button className="button" type="button" onClick={() => close(onChoose)}>Choose {t.name}</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ---------- The gallery ---------- */
export default function Showcase({ choose }: { choose: (template: TemplateId) => void }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<{ t: Template; from: HTMLElement } | null>(null);
  const items = [s.templates[1], s.templates[0], s.templates[2]]; // floral · royal (centre) · minimal

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Entrance: plays once when the row comes into view. Royal leads from below, the sides slide in tilted and straighten.
      const tl = gsap.timeline({ scrollTrigger: { trigger: q(".sc__row")[0], start: "top 82%", once: true } });
      tl.from(q(".sc__word"), { opacity: 0, y: 14, duration: 0.7, stagger: 0.06, ease: "power2.out" }, 0);
      q(".sc__item").forEach((el) => {
        const id = (el as HTMLElement).dataset.id as TemplateId;
        tl.from(el.querySelector(".sc__pose"), { ...ENTER_FROM[id], opacity: 0, duration: 1.1, ease: "power3.out" }, id === "royal" ? 0.2 : 0.42);
      });
      tl.from(q(".sc__shadow"), { opacity: 0, scale: 0.7, duration: 1.0, ease: "power2.out" }, 0.45)
        .from(q(".sc__caption"), { opacity: 0, y: 10, stagger: 0.1, duration: 0.6, ease: "power2.out" }, 1.1);

      // Idle: tiny, unsynchronised float; paused while off screen.
      q(".sc__float").forEach((el, i) =>
        gsap.to(el, {
          y: [-4, -6, -3][i], rotation: [0.5, -0.3, -0.5][i], duration: [6.5, 8, 7.2][i], delay: i * 0.7,
          ease: "sine.inOut", yoyo: true, repeat: -1,
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
        }));
    });

    mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      // Pointer: lift, tilt toward the cursor, envelope and card drift apart for layered paper depth.
      const offs = q(".sc__open").map((btn) => {
        const lift = btn.querySelector(".sc__lift")!, env = btn.querySelector(".sc__env")!, card = btn.querySelector(".sc__card")!;
        const qt = (t: Element, p: string) => gsap.quickTo(t, p, { duration: 0.7, ease: "power3.out" });
        const ly = qt(lift, "y"), rx = qt(lift, "rotationX"), ry = qt(lift, "rotationY");
        const ex = qt(env, "x"), ey = qt(env, "y"), cx = qt(card, "x"), cy = qt(card, "y");
        const move = (e: Event) => {
          const p = e as PointerEvent, r = btn.getBoundingClientRect();
          const px = (p.clientX - r.left) / r.width - 0.5, py = (p.clientY - r.top) / r.height - 0.5;
          ly(-18); rx(-py * 8); ry(px * 10); ex(-px * 10); ey(-py * 6); cx(px * 6); cy(py * 4);
        };
        const leave = () => { ly(0); rx(0); ry(0); ex(0); ey(0); cx(0); cy(0); };
        btn.addEventListener("pointermove", move);
        btn.addEventListener("pointerleave", leave);
        return () => { btn.removeEventListener("pointermove", move); btn.removeEventListener("pointerleave", leave); };
      });
      return () => offs.forEach((off) => off());
    });
    return () => mm.revert();
  }, []);

  // Returning focus to the card that opened the dialog.
  const lastOpener = useRef<HTMLElement | null>(null);
  useEffect(() => { if (!open) lastOpener.current?.focus({ preventScroll: true }); }, [open]);

  return (
    <section id="showcase" ref={root} className={`section sc ${open ? "is-open" : ""}`} aria-labelledby="showcase-title">
      <img className="sc__corner" src={`${A}/hero/floral-corner-left.png`} alt="" loading="lazy" data-depth="-0.6" />
      <img className="sc__corner sc__corner--r" src={`${A}/hero/floral-corner-left.png`} alt="" loading="lazy" data-depth="-0.6" />
      <div className="section__head">
        <p className="eyebrow sc__word">{s.showcase.label}</p>
        <h2 id="showcase-title">{s.showcase.title.split(" ").map((w, i) => <Fragment key={i}>{i > 0 && " "}<span className="sc__word">{w}</span></Fragment>)}</h2>
      </div>
      <div className="sc__row">
        {items.map((t) => (
          <figure key={t.id} className={`sc__item sc__item--${t.id}`} data-id={t.id}>
            <button
              className="sc__open" type="button" aria-haspopup="dialog"
              onClick={(e) => { lastOpener.current = e.currentTarget; setOpen({ t, from: e.currentTarget.querySelector(".sc__card")! }); }}
            >
              <span className="sr-only">Open the {t.name} invitation for {t.couple}</span>
              <div className="sc__pose"><div className="sc__float"><div className="sc__lift">
                <div className="sc__shadow" />
                <div className="sc__env" aria-hidden="true"><span className="sc__env-mono">{t.initials.join("")}</span></div>
                <div className="sc__card"><Invite t={t} /></div>
                <span className="sc__hint" aria-hidden="true">View invitation ↗</span>
              </div></div></div>
            </button>
            <figcaption className="sc__caption">
              <span className="sc__mono">{t.initials.join("&")}</span> {t.couple} · {t.date}
              <span className="sc__palette" aria-label={`${t.name} palette`}>
                {PALETTE[t.id].map((c) => <i key={c} style={{ background: c }} />)}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {open && (
        <Opened
          t={open.t} from={open.from}
          onClose={() => setOpen(null)}
          onChoose={() => { setOpen(null); choose(open.t.id); }}
        />
      )}
    </section>
  );
}
