// All Shubh Studio copy, prices and links live here. Prices must match the business exactly.
export const WHATSAPP = "919548813404";
export const WHATSAPP_DISPLAY = "+91 95488 13404";

export type TemplateId = "royal" | "floral" | "minimal";

export const studio = {
  nav: [
    { href: "#templates", label: "Templates" },
    { href: "#how", label: "How it works" },
    { href: "#packages", label: "Packages" },
    { href: "#partners", label: "Partners" },
  ],

  hero: {
    label: "Wedding season 2026–27",
    title: ["Your wedding invite,", "website & RSVPs,", "ready in 48 hours"],
    text: "Animated e-invites, a wedding website with events, maps and WhatsApp RSVP, and a monogram that ties it all together. One link for every guest, from Delhi to Dallas.",
    trust: ["48 hrs delivery", "2 free revisions", "Hindi + English in every package"],
  },

  // Sample couples (fictional) used on the mockups.
  templates: [
    {
      id: "royal" as TemplateId, name: "Royal", couple: "Aanya & Kabir", initials: ["A", "K"], date: "14 · 02 · 2027",
      style: "Royal · maroon & gold", description: "Palace weddings, traditional ceremonies, big families.",
      demo: "https://shubhstudio.in/wedding/index.html#royal",
    },
    {
      id: "floral" as TemplateId, name: "Floral", couple: "Riya & Sahil", initials: ["R", "S"], date: "12 · 01 · 2027",
      style: "Floral · blush & sage", description: "Day weddings, mehendi-first celebrations, destination beaches.",
      demo: "https://shubhstudio.in/wedding/index.html#floral",
    },
    {
      id: "minimal" as TemplateId, name: "Minimal", couple: "Meher & Jai", initials: ["M", "J"], date: "08 · 03 · 2027",
      style: "Minimal · ivory & ink", description: "Court weddings, intimate gatherings, modern couples abroad.",
      demo: "https://shubhstudio.in/wedding/index.html#minimal",
    },
  ],

  showcase: {
    label: "Sample invitations",
    title: "Three ways to say you're invited.",
  },

  how: {
    title: "A beautiful invite. Three simple steps.",
    subtitle: "No calls needed. Everything happens on WhatsApp.",
    steps: [
      { title: "Pick a template", text: "Choose Royal, Floral or Minimal and open the live demo to see exactly what guests will see." },
      { title: "Send your details", text: "Names, events, venues and a photo. We send a short form and you fill it in 5 minutes." },
      { title: "Share your link", text: "Get your invite and website in 48 hours. Two revision rounds are included." },
    ],
  },

  templatesSection: {
    title: "Made for your kind of celebration.",
    subtitle: "Every template works as a wedding website and as a matching e-invite. Tap “Live demo” to try it, RSVP included.",
  },

  monogram: {
    eyebrow: "A little something, before you say yes.",
    title: "Free monogram for your wedding",
    text: "Tell us your names and we'll design your wedding monogram for free and send it on WhatsApp within 24 hours. No payment, no catch.",
    cta: "Get my free monogram",
  },

  packagesSection: {
    title: "Choose the way you want to tell your story.",
    subtitle: "50% to start, 50% on delivery. All prices in ₹. Pay by UPI, card or netbanking.",
  },

  packages: [
    { id: "e-invite", name: "E-Invite", price: "₹1,499", subtitle: "Shareable on WhatsApp",
      features: ["Animated invite video (15–20s)", "Static invite image", "Matching monogram", "Hindi + English"] },
    { id: "website", name: "Wedding Website", price: "₹3,999", subtitle: "One link for all guests",
      features: ["All events, maps & dress codes", "WhatsApp RSVP", "Countdown & love story", "Live for 12 months", "Hindi + English"] },
    { id: "kit", name: "Complete Kit", price: "₹7,999", subtitle: "Everything, perfectly matched", featured: true,
      features: ["Website + animated e-invite", "Custom monogram", "Instagram story & hashtag set", "Save-the-date + thank-you card", "24h rush delivery", "Hindi + English"] },
    { id: "vendor", name: "Vendor Brand Kit", price: "₹6,999", subtitle: "For wedding businesses",
      features: ["Logo + brand colours", "Instagram highlight covers", "One-page booking site", "WhatsApp enquiry button", "Hindi + English"] },
  ],

  order: {
    title: "Let's create your wedding invitation.",
    text: "Fill this in and tap the button. WhatsApp opens with your order ready to send.",
    cta: "Send order on WhatsApp",
  },

  payment: {
    url: "https://razorpay.me/@shubhstudiobyakhileshraje",
    note: "UPI, card or netbanking via Razorpay · 50% to start, 50% on delivery",
    cta: "Pay securely",
  },

  partners: {
    audience: "For planners, photographers & makeup artists",
    title: "Earn 15% on every couple you refer",
    text: "Your clients ask you about invites all the time. Send them to us and earn 15% of every order, paid by UPI the day they pay. We also build vendor logos and booking pages.",
    cta: "Become a partner",
    message: "Hi Shubh Studio, I'm a wedding vendor and I'd like to join your 15% partner programme.",
  },

  // Answers come from the owner's Shubh Studio spec ("prices and promises match the current business"). Edit here if a policy changes.
  faq: {
    title: "A few things you might want to know.",
    items: [
      { q: "How fast is delivery?", a: "48 hours after we receive your details and the 50% advance. The Complete Kit includes 24-hour rush delivery." },
      { q: "Can guests RSVP?", a: "Yes. With the Wedding Website and the Complete Kit, guests RSVP in one tap, and their reply arrives on your WhatsApp with their names, guest count and events." },
      { q: "Can I change details later?", a: "Two rounds of changes are included in every package. Small fixes after that are free during your wedding month." },
      { q: "Do you work with families abroad?", a: "Yes. One link works for guests anywhere, event times show correctly in each guest's time zone, and pricing in US dollars is available." },
      { q: "Which languages?", a: "Hindi, English or both, in every package." },
    ],
  },

  footer: {
    instagram: { handle: "@shubhstudio", url: "https://www.instagram.com/shubhstudio" },
    links: [
      { label: "Terms", url: "https://shubhstudio.in/terms.html" },
      { label: "Privacy", url: "https://shubhstudio.in/privacy.html" },
      { label: "Refund & Cancellation", url: "https://shubhstudio.in/refund.html" },
      { label: "Contact", url: "https://shubhstudio.in/contact.html" },
    ],
    copyright: "© 2026 Shubh Studio",
  },
};

export type PackageId = (typeof studio.packages)[number]["id"];
