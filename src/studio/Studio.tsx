import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { studio as s, WHATSAPP_DISPLAY, type PackageId, type TemplateId } from "./content";
import { useSiteMotion } from "../useSiteMotion";
import PalaceHero from "./PalaceHero";
import Showcase from "./Showcase";
import Invite from "./Invite";
import { formatDate, initialsOf, isPastDate, isPhone, openWhatsApp, waLink } from "./whatsapp";

const A = "/assets/wedding";
type Choice = { template: TemplateId | "unsure" | ""; pkg: PackageId | "" };

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const goTo = (id: string) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  el?.focus({ preventScroll: true });
};

/* ---------- Form field ---------- */
function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: boolean; children: ReactNode }) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={id}>{label}{optional && <span className="field__opt"> (optional)</span>}</label>
      {children}
      {error && <p className="field__error" id={`${id}-err`}>{error}</p>}
    </div>
  );
}
const aria = (id: string, error?: string) => ({ id, "aria-invalid": !!error, "aria-describedby": error ? `${id}-err` : undefined });
const focusFirstError = (form: HTMLFormElement) => (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();

/* ---------- 01 Nav ---------- */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const close = () => setOpen(false);
  return (
    <header className={`nav ${solid || open ? "nav--solid" : ""}`}>
      <a className="nav__brand" href="#top" data-intro>Shubh Studio</a>
      <button className="nav__toggle" aria-expanded={open} aria-controls="nav-menu" onClick={() => setOpen(!open)}>
        {open ? "Close" : "Menu"}
      </button>
      <nav id="nav-menu" className={`nav__menu ${open ? "is-open" : ""}`} aria-label="Main">
        {s.nav.map((l) => <a key={l.href} href={l.href} onClick={close}>{l.label}</a>)}
        <a className="button button--solid nav__cta" href="#order" onClick={close}>Book now</a>
      </nav>
    </header>
  );
}

/* ---------- 04 How it works ---------- */
function How() {
  return (
    <section id="how" className="section how" aria-labelledby="how-title">
      <div className="section__head" data-stagger>
        <h2 id="how-title">{s.how.title}</h2>
        <p className="section__sub">{s.how.subtitle}</p>
      </div>
      <ol className="how__steps">
        {s.how.steps.map((step, i) => (
          <li key={step.title} className="how__step" data-reveal>
            <span className="how__num" aria-hidden="true">0{i + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- 05 Templates ---------- */
function Templates({ choose }: { choose: (c: Partial<Choice>) => void }) {
  return (
    <section id="templates" className="section templates" aria-labelledby="templates-title">
      <div className="section__head" data-stagger>
        <h2 id="templates-title">{s.templatesSection.title}</h2>
        <p className="section__sub">{s.templatesSection.subtitle}</p>
      </div>
      <div className="templates__grid" data-stagger>
        {s.templates.map((t, i) => (
          <article key={t.id} className="tcard">
            <div className="tcard__art"><Invite t={t} /></div>
            <p className="eyebrow">Template 0{i + 1} · {t.name}</p>
            <h3>{t.couple}</h3>
            <p className="tcard__style">{t.style}</p>
            <p>{t.description}</p>
            <div className="tcard__ctas">
              <a className="button" href={t.demo} target="_blank" rel="noopener noreferrer">Live demo<span className="sr-only"> of the {t.name} template (opens in a new tab)</span></a>
              <button className="button button--solid" type="button" onClick={() => choose({ template: t.id })}>Choose<span className="sr-only"> {t.name}</span></button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- 06 Free monogram ---------- */
function Monogram() {
  const [v, setV] = useState({ names: "", phone: "", date: "", city: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value });
  const initials = initialsOf(v.names);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const n: Record<string, string> = {};
    if (!v.names.trim()) n.names = "Please add both your names, e.g. Riya & Sahil";
    if (!isPhone(v.phone)) n.phone = "Please enter a WhatsApp number, with country code if outside India";
    if (!v.date) n.date = "Please choose your wedding date";
    else if (isPastDate(v.date)) n.date = "That date has already passed. Please choose a future date";
    if (!v.city.trim()) n.city = "Please add your city";
    setErr(n);
    const form = e.currentTarget; // React clears currentTarget after the handler returns
    if (Object.keys(n).length) { setTimeout(() => focusFirstError(form)); return; }
    openWhatsApp(
      `Hi Shubh Studio! I'd like my free wedding monogram.\n\nNames: ${v.names.trim()}\nWhatsApp: ${v.phone.trim()}\nWedding date: ${formatDate(v.date)}\nCity: ${v.city.trim()}`,
    );
  };

  return (
    <section id="monogram" className="section freemono" aria-labelledby="monogram-title">
      <img className="freemono__corner" src={`${A}/hero/floral-corner-left.png`} alt="" loading="lazy" data-depth="-0.5" />
      <div className="freemono__preview" data-reveal aria-hidden="true">
        <div className="freemono__frame">
          <img src={`${A}/ornaments/monogram-frame.png`} alt="" loading="lazy" />
          <span>{initials[0] ?? "R"}<i>&amp;</i>{initials[1] ?? "S"}</span>
        </div>
        <p className="freemono__caption">{initials.length ? "Your initials, in our hand" : "Type your names to preview"}</p>
      </div>
      <div className="freemono__body">
        <div data-stagger>
          <p className="eyebrow">{s.monogram.eyebrow}</p>
          <h2 id="monogram-title">{s.monogram.title}</h2>
          <p>{s.monogram.text}</p>
        </div>
        <form className="form" onSubmit={submit} noValidate>
          <Field id="m-names" label="Your names" error={err.names}>
            <input {...aria("m-names", err.names)} value={v.names} onChange={set("names")} placeholder="Riya & Sahil" autoComplete="off" />
          </Field>
          <Field id="m-phone" label="WhatsApp number" error={err.phone}>
            <input {...aria("m-phone", err.phone)} value={v.phone} onChange={set("phone")} type="tel" inputMode="tel" placeholder="+91 98765 43210" autoComplete="tel" />
          </Field>
          <div className="form__row">
            <Field id="m-date" label="Wedding date" error={err.date}>
              <input {...aria("m-date", err.date)} value={v.date} onChange={set("date")} type="date" />
            </Field>
            <Field id="m-city" label="City" error={err.city}>
              <input {...aria("m-city", err.city)} value={v.city} onChange={set("city")} autoComplete="address-level2" />
            </Field>
          </div>
          <button className="button button--solid" type="submit">{s.monogram.cta}</button>
          <p className="form__note">Opens WhatsApp with your details ready to send. Nothing is sent until you tap send there.</p>
        </form>
      </div>
    </section>
  );
}

/* ---------- 07 Packages ---------- */
function Packages({ choose }: { choose: (c: Partial<Choice>) => void }) {
  return (
    <section id="packages" className="section packages" aria-labelledby="packages-title">
      <div className="section__head" data-stagger>
        <h2 id="packages-title">{s.packagesSection.title}</h2>
        <p className="section__sub">{s.packagesSection.subtitle}</p>
      </div>
      <div className="packages__grid" data-stagger>
        {s.packages.map((p) => (
          <article key={p.id} className={`pkg ${p.featured ? "pkg--featured" : ""}`}>
            {p.featured && <p className="pkg__badge">Recommended</p>}
            <h3>{p.name}</h3>
            <p className="pkg__sub">{p.subtitle}</p>
            <p className="pkg__price">{p.price}</p>
            <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
            <button className={`button ${p.featured ? "button--solid" : ""}`} type="button" onClick={() => choose({ pkg: p.id })}>
              Choose<span className="sr-only"> {p.name}</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- 08 Order ---------- */
function Order({ choice, setChoice }: { choice: Choice; setChoice: (c: Choice) => void }) {
  const [v, setV] = useState({ names: "", date: "", city: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const n: Record<string, string> = {};
    if (!v.names.trim()) n.names = "Please add the couple's names";
    if (!v.date) n.date = "Please choose your wedding date";
    else if (isPastDate(v.date)) n.date = "That date has already passed. Please choose a future date";
    if (!choice.template) n.template = "Please pick a template, or choose “Not sure yet”";
    if (!choice.pkg) n.pkg = "Please choose a package";
    setErr(n);
    const form = e.currentTarget; // React clears currentTarget after the handler returns
    if (Object.keys(n).length) { setTimeout(() => focusFirstError(form)); return; }
    const t = s.templates.find((x) => x.id === choice.template)?.name ?? "Not sure yet";
    const p = s.packages.find((x) => x.id === choice.pkg)!;
    openWhatsApp(
      `Hi Shubh Studio! I'd like to place an order.\n\nCouple: ${v.names.trim()}\nWedding date: ${formatDate(v.date)}\nTemplate: ${t}\nPackage: ${p.name} · ${p.price}` +
        (v.city.trim() ? `\nCity / venue: ${v.city.trim()}` : ""),
    );
  };
  return (
    <section id="order" className="section order" tabIndex={-1} aria-labelledby="order-title">
      <div className="order__intro" data-stagger>
        <h2 id="order-title">{s.order.title}</h2>
        <p>{s.order.text}</p>
        <div className="order__pay">
          <p className="eyebrow">Payment</p>
          <p>{s.payment.note}</p>
          <a className="button" href={s.payment.url} target="_blank" rel="noopener noreferrer">{s.payment.cta}<span className="sr-only"> on Razorpay (opens in a new tab)</span></a>
        </div>
      </div>
      <form className="form order__form" onSubmit={submit} noValidate>
        <Field id="o-names" label="Couple names" error={err.names}>
          <input {...aria("o-names", err.names)} value={v.names} onChange={(e) => setV({ ...v, names: e.target.value })} placeholder="Aanya & Kabir" autoComplete="off" />
        </Field>
        <Field id="o-date" label="Wedding date" error={err.date}>
          <input {...aria("o-date", err.date)} type="date" value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} />
        </Field>
        <Field id="o-template" label="Template" error={err.template}>
          <select {...aria("o-template", err.template)} value={choice.template} onChange={(e) => setChoice({ ...choice, template: e.target.value as Choice["template"] })}>
            <option value="" disabled>Select a template</option>
            {s.templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            <option value="unsure">Not sure yet</option>
          </select>
        </Field>
        <Field id="o-pkg" label="Package" error={err.pkg}>
          <select {...aria("o-pkg", err.pkg)} value={choice.pkg} onChange={(e) => setChoice({ ...choice, pkg: e.target.value as PackageId })}>
            <option value="" disabled>Select a package</option>
            {s.packages.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.price}</option>)}
          </select>
        </Field>
        <Field id="o-city" label="City / venue" optional>
          <input id="o-city" value={v.city} onChange={(e) => setV({ ...v, city: e.target.value })} autoComplete="address-level2" />
        </Field>
        <button className="button button--solid" type="submit">{s.order.cta}</button>
        <p className="form__note">WhatsApp {WHATSAPP_DISPLAY}. Nothing is sent until you tap send in WhatsApp.</p>
      </form>
    </section>
  );
}

/* ---------- 09 Partners ---------- */
function Partners() {
  return (
    <section id="partners" className="partners" aria-labelledby="partners-title">
      <div className="partners__inner">
        <div data-stagger>
          <p className="eyebrow">{s.partners.audience}</p>
          <h2 id="partners-title">{s.partners.title}</h2>
        </div>
        <div className="partners__body" data-stagger>
          <p>{s.partners.text}</p>
          <a className="button button--light" href={waLink(s.partners.message)} target="_blank" rel="noopener noreferrer">{s.partners.cta}</a>
        </div>
      </div>
    </section>
  );
}

/* ---------- 10 FAQ ---------- */
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="section__head" data-stagger><h2 id="faq-title">{s.faq.title}</h2></div>
      <div className="faq__list" data-stagger>
        {s.faq.items.map((item, i) => (
          <div key={item.q} className={`faq__item ${open === i ? "is-open" : ""}`}>
            <h3>
              <button type="button" id={`faq-q${i}`} aria-expanded={open === i} aria-controls={`faq-a${i}`} onClick={() => setOpen(open === i ? null : i)}>
                {item.q}<span className="faq__icon" aria-hidden="true" />
              </button>
            </h3>
            <div id={`faq-a${i}`} role="region" aria-labelledby={`faq-q${i}`} className="faq__answer" hidden={open !== i}>
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 11 Footer ---------- */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner" data-stagger>
        <p className="footer__brand">Shubh Studio</p>
        <p>
          <a href={s.footer.instagram.url} target="_blank" rel="noopener noreferrer">Instagram {s.footer.instagram.handle}</a>
          <span aria-hidden="true"> · </span>
          <a href={waLink("Hi Shubh Studio! I'd like to know more about wedding invites.")} target="_blank" rel="noopener noreferrer">WhatsApp {WHATSAPP_DISPLAY}</a>
        </p>
        <nav aria-label="Policies" className="footer__links">
          {s.footer.links.map((l) => <a key={l.url} href={l.url}>{l.label}</a>)}
        </nav>
        <p className="footer__copy">{s.footer.copyright}</p>
      </div>
    </footer>
  );
}

export default function Studio() {
  const root = useRef<HTMLDivElement>(null);
  useSiteMotion(root);
  const [choice, setChoice] = useState<Choice>({ template: "", pkg: "" });
  // Deep links (e.g. /#packages): the browser tries to jump before React has rendered, so jump once we have.
  useEffect(() => {
    const jump = () => { if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView(); };
    jump();
    window.addEventListener("load", jump, { once: true }); // again once fonts/images have settled the layout
    return () => window.removeEventListener("load", jump);
  }, []);
  // Choose buttons (templates, packages) preselect the order form and bring the visitor to it.
  const choose = (c: Partial<Choice>) => { setChoice((prev) => ({ ...prev, ...c })); goTo("order"); };
  return (
    <div ref={root}>
      <a className="skip" href="#order">Skip to order form</a>
      <Nav />
      <main>
        <PalaceHero />
        <Showcase choose={(template) => choose({ template })} />
        <How />
        <Templates choose={choose} />
        <Monogram />
        <Packages choose={choose} />
        <Order choice={choice} setChoice={setChoice} />
        <Partners />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
