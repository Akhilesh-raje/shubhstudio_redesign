import { useEffect, useRef } from "react";
import Hero from "./Hero";
import Scenes from "./Scenes";
import { useSiteMotion } from "./useSiteMotion";

export default function App() {
  const root = useRef<HTMLElement>(null);
  useSiteMotion(root);
  // Deep links (e.g. /palace/#events): jump once React has rendered.
  useEffect(() => {
    const jump = () => { if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView(); };
    jump();
    window.addEventListener("load", jump, { once: true }); // again once fonts/images have settled the layout
    return () => window.removeEventListener("load", jump);
  }, []);
  return (
    <main ref={root}>
      <Hero />
      <Scenes />
    </main>
  );
}
