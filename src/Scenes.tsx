import { useState, type FormEvent } from "react";
import { content as c } from "./content";
import Monogram from "./Monogram";
import "./styles/scenes.css";

const A = "/assets/wedding";
const Divider = () => <img loading="lazy" decoding="async" className="divider" src={`${A}/ornaments/divider-gold.png`} alt="" />;

// Water band with floating lotuses (Scenes 03 and 05).
function Water({ lotus }: { lotus: number[] }) {
  return (
    <div className="water" data-depth="0.2">
      <img loading="lazy" decoding="async" className="water__img" src={`${A}/palace/water.png`} alt="" data-drift />
      {lotus.map((left) => (
        <img loading="lazy" decoding="async" key={left} className="water__lotus" style={{ left: `${left}%` }} src={`${A}/florals/lotus-single.png`} alt="" data-float />
      ))}
    </div>
  );
}

// Scene 02: the invitation card, sealed. The seal lifts away as you scroll on.
function Invitation() {
  return (
    <section id="invitation" className="scene invitation" tabIndex={-1} aria-labelledby="inv-names">
      <div className="invitation__card" data-reveal>
        <img loading="lazy" decoding="async" className="invitation__seal" src={`${A}/hero/wax-seal.png`} alt="" data-seal />
        <div data-stagger>
          <p className="invitation__blessing" lang="hi">{c.blessing}</p>
          <p className="label">{c.together}</p>
          <h2 id="inv-names" className="invitation__names">{c.names[0]} <span>&amp;</span> {c.names[1]}</h2>
          <p className="invitation__families">{c.families[0]} · {c.families[1]}</p>
          <Divider />
          <p>{c.invitationLine}</p>
          <p className="label invitation__when">{c.date} · {c.place}</p>
        </div>
      </div>
    </section>
  );
}

// Scene 03: layered palace, far to near.
function Palace() {
  return (
    <section className="scene palace" aria-labelledby="palace-title">
      <img loading="lazy" decoding="async" className="palace__sky" src={`${A}/backgrounds/sky-pale.webp`} alt="" data-depth="1.6" />
      <div className="palace__title" data-stagger>
        <p className="label">{c.palace.label}</p>
        <h2 id="palace-title">{c.palace.title}</h2>
      </div>
      <img loading="lazy" decoding="async" className="palace__hills" src={`${A}/backgrounds/hills-distant.png`} alt="" data-depth="1.2" />
      <div className="palace__layer palace__chhatris" data-depth="0.9">
        <div data-stagger>
          <img loading="lazy" decoding="async" className="palace__chhatri" src={`${A}/palace/chhatri-tall.png`} alt="" />
          <img loading="lazy" decoding="async" className="palace__chhatri palace__chhatri--right" src={`${A}/palace/chhatri-tall.png`} alt="" />
        </div>
      </div>
      <div className="palace__layer palace__main" data-depth="0.7">
        <img loading="lazy" decoding="async" src={`${A}/palace/palace-main.png`} alt="An ivory palace with a central dome and blue floral inlay" data-reveal />
      </div>
      <Water lotus={[22, 46, 71]} />
      <div className="palace__garden" data-depth="0.4" /> {/* in front of the water's misty top edge, which would wash it out */}
      <div className="palace__layer palace__peacocks" data-depth="0.1">
        <div data-stagger>
          <img loading="lazy" decoding="async" className="palace__peacock" src={`${A}/peacocks/peacock-left.png`} alt="" />
          <img loading="lazy" decoding="async" className="palace__peacock palace__peacock--right" src={`${A}/peacocks/peacock-left.png`} alt="" />
        </div>
      </div>
    </section>
  );
}

// Scene 04: our story, between flowering branches.
function Story() {
  return (
    <section id="story" className="scene story" aria-labelledby="story-title">
      <img loading="lazy" decoding="async" className="story__branch" src={`${A}/florals/branch-side-left.png`} alt="" data-depth="0.3" />
      <img loading="lazy" decoding="async" className="story__branch story__branch--right" src={`${A}/florals/branch-side-left.png`} alt="" data-depth="0.3" />
      <div className="story__text" data-exit>
        <div data-stagger>
          <p className="label">Our story</p>
          <h2 id="story-title">{c.story.title}</h2>
          <Divider />
          {c.story.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}

// Scene 05: the mandap by the water.
function Mandap() {
  return (
    <section id="mandap" className="scene mandap" aria-labelledby="mandap-title">
      <div className="mandap__art" data-reveal>
        <img loading="lazy" decoding="async" src={`${A}/mandap/mandap-structure.png`} alt="A wedding mandap with gold pillars, ivory drapes, blue and ivory flower garlands and two seats" />
      </div>
      <div className="mandap__text" data-exit>
        <div data-stagger>
          <p className="label">The ceremony</p>
          <h2 id="mandap-title">{c.ceremony.title}</h2>
          <p className="label mandap__when">{c.ceremony.when}</p>
          <p>{c.ceremony.note}</p>
        </div>
      </div>
      <Water lotus={[12, 84]} />
    </section>
  );
}

// Scene 06: one card per event. Card artwork is pending; text is HTML in the card's lower 60%.
function Events() {
  return (
    <section id="events" className="scene events" aria-labelledby="events-title">
      <div data-stagger>
        <p className="label">The celebrations</p>
        <h2 id="events-title">Four days of joy</h2>
      </div>
      <div className="events__grid" data-stagger>
        {c.events.map((ev) => (
          <article key={ev.key} className="event">
            <img loading="lazy" decoding="async" className="event__card" src={`${A}/events/card-${ev.key}.webp`} alt="" />
            <div className="event__text">
              <h3>{ev.name}</h3>
              <p className="label">{ev.date}</p>
              <p>{ev.time} · {ev.venue}</p>
              <p className="event__dress">Dress code: {ev.dress}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// Scene 07: venue photo in a cream frame.
function Venue() {
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.venue.mapQuery)}`;
  return (
    <section className="scene venue" aria-labelledby="venue-title">
      <figure className="venue__frame" data-mask>
        <img loading="lazy" decoding="async" src={`${A}/venue/venue-main.webp`} alt={c.venue.photoAlt} />
      </figure>
      <div data-stagger>
        <p className="label">{c.venue.label}</p>
        <h2 id="venue-title">{c.venue.name}</h2>
        <p>{c.venue.address}</p>
        <p><a className="venue__map" href={map} target="_blank" rel="noopener noreferrer">View on the map</a></p>
      </div>
    </section>
  );
}

// Scene 08: RSVP. Only the heading animates; the form is always visible and usable.
function Rsvp() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true); // shortcut: RSVP backend is an open decision (ART_DIRECTION, Phase 4); nothing is sent yet. Wire it before launch.
  };
  return (
    <section id="rsvp" className="scene rsvp" aria-labelledby="rsvp-title">
      <div className="rsvp__panel">
        <div className="rsvp__head" data-stagger>
          <p className="label">RSVP</p>
          <h2 id="rsvp-title">{c.rsvp.title}</h2>
          <p>{c.rsvp.deadline}</p>
        </div>
        <form onSubmit={submit}>
          <label>Your name<input name="name" required autoComplete="name" /></label>
          <label>Number of guests<input name="guests" type="number" min={1} max={10} defaultValue={1} required /></label>
          <fieldset>
            <legend>Events you will attend</legend>
            {c.events.map((ev) => (
              <label key={ev.key} className="check"><input type="checkbox" name="events" value={ev.key} defaultChecked /> {ev.name}</label>
            ))}
          </fieldset>
          <label>A message for the couple<textarea name="message" rows={3} /></label>
          <button className="button" type="submit">Send RSVP</button>
          {sent && <p className="rsvp__status" role="status">Thank you. (Preview only: RSVP delivery is not connected yet, so this response was not sent.)</p>}
        </form>
      </div>
    </section>
  );
}

// Scene 09: closing, resting on paper.
function Closing() {
  return (
    <section className="scene closing" aria-labelledby="closing-names">
      <img loading="lazy" decoding="async" className="closing__corner" src={`${A}/hero/floral-corner-left.png`} alt="" data-depth="-0.6" />
      <img loading="lazy" decoding="async" className="closing__corner closing__corner--right" src={`${A}/hero/floral-corner-left.png`} alt="" data-depth="-0.6" />
      <div className="closing__content" data-stagger>
        <Monogram className="closing__monogram" />
        <p className="label">{c.closing.line}</p>
        <h2 id="closing-names">{c.names[0]} <span>&amp;</span> {c.names[1]}</h2>
        <Divider />
        <p className="label">{c.date} · {c.place}</p>
        <p className="closing__from">{c.closing.from}</p>
      </div>
      <div className="closing__palace"><img loading="lazy" decoding="async" src={`${A}/palace/palace-main.png`} alt="" data-reveal /></div>
    </section>
  );
}

export default function Scenes() {
  return (
    <>
      <Invitation />
      <Palace />
      <Story />
      <Mandap />
      <Events />
      <Venue />
      <Rsvp />
      <Closing />
    </>
  );
}
