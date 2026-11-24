import { studio as s } from "./content";

export type Template = (typeof s.templates)[number];

// Typographic invitation mockup (paper, border, monogram, names, date); colours per template in studio.css.
export default function Invite({ t }: { t: Template }) {
  return (
    <div className={`invite invite--${t.id}`} role="img" aria-label={`${t.name} invitation sample for ${t.couple}`}>
      <div className="invite__inner">
        {t.id === "royal" && <p className="invite__blessing" lang="hi">॥ शुभ विवाह ॥</p>}
        {t.id === "floral" && <p className="invite__blessing">together with their families</p>}
        <p className="invite__initials">{t.initials[0]}<span>&amp;</span>{t.initials[1]}</p>
        <p className="invite__names">{t.couple}</p>
        <p className="invite__date">{t.date}</p>
      </div>
    </div>
  );
}
