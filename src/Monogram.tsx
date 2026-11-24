import { content } from "./content";

export default function Monogram({ className = "" }: { className?: string }) {
  return (
    <div className={`monogram ${className}`} aria-hidden="true">
      <img src="/assets/wedding/ornaments/monogram-frame.png" alt="" />
      <span>{content.initials[0]}<i>&amp;</i>{content.initials[1]}</span>
    </div>
  );
}
