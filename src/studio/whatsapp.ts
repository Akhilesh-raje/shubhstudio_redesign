import { WHATSAPP } from "./content";

export const waLink = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

// Opens WhatsApp in a new tab; falls back to this tab if a popup blocker refuses.
export function openWhatsApp(text: string) {
  const url = waLink(text);
  const w = window.open(url, "_blank");
  if (w) w.opener = null;
  else window.location.href = url;
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export const isPastDate = (iso: string) => new Date(`${iso}T23:59:59`) < new Date();

// Indian or international number: 10–15 digits, optional +, spaces or dashes.
export const isPhone = (v: string) => /^\+?[\d\s-]+$/.test(v.trim()) && v.replace(/\D/g, "").length >= 10 && v.replace(/\D/g, "").length <= 15;

// "Riya & Sahil" -> ["R", "S"]
export const initialsOf = (names: string) =>
  names.split(/\s*(?:&|\band\b|,|\+|\/)\s*/i).map((n) => n.trim()[0]?.toUpperCase()).filter(Boolean).slice(0, 2) as string[];

// Self-check (dev only): run in the browser console with import.meta.env.DEV.
if (import.meta.env.DEV) {
  console.assert(waLink("a & b\nc") === `https://wa.me/${WHATSAPP}?text=a%20%26%20b%0Ac`, "waLink encoding");
  console.assert(isPhone("+91 95488 13404") && isPhone("9548813404") && !isPhone("12345") && !isPhone("98abc76543"), "isPhone");
  console.assert(initialsOf("Riya & Sahil").join("") === "RS" && initialsOf("meher and jai").join("") === "MJ", "initialsOf");
}
