import c1 from "@/assets/cactus-1.jpg";
import c2 from "@/assets/cactus-2.jpg";
import c3 from "@/assets/cactus-3.jpg";
import c4 from "@/assets/cactus-4.jpg";
import c5 from "@/assets/cactus-5.jpg";
import c6 from "@/assets/cactus-6.jpg";
import c7 from "@/assets/cactus-7.jpg";
import c8 from "@/assets/cactus-8.jpg";

export type Category =
  | "cactus"
  | "indoor"
  | "succulents"
  | "air-purifying"
  | "pots"
  | "essentials";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  care: string;
}

export interface Faq {
  id: string;
  q: string;
  a: string;
}

export type CareIcon = "droplets" | "sun" | "sprout" | "repeat";

export interface CareTip {
  id: string;
  icon: CareIcon;
  title: string;
  desc: string;
}

export const careIcons: { id: CareIcon; label: string }[] = [
  { id: "droplets", label: "💧 Water" },
  { id: "sun", label: "☀️ Sun" },
  { id: "sprout", label: "🌱 Fertilizer" },
  { id: "repeat", label: "🔁 Repot" },
];

export const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "cactus", label: "Cactus", emoji: "🌵" },
  { id: "indoor", label: "Indoor Plants", emoji: "🪴" },
  { id: "succulents", label: "Succulents", emoji: "🌱" },
  { id: "air-purifying", label: "Air Purifying", emoji: "🍃" },
  { id: "pots", label: "Pots & Planters", emoji: "🏺" },
  { id: "essentials", label: "Gardening Essentials", emoji: "🌿" },
];

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const defaultProducts: Product[] = [
  {
    id: "golden-barrel",
    name: "Golden Barrel Cactus",
    category: "cactus",
    price: 499,
    image: c1,
    description:
      "A classic round cactus with golden spines that catch the light beautifully. Slow-growing and remarkably easy to care for.",
    care: "Bright sunlight, water every 10–14 days.",
  },
  {
    id: "san-pedro",
    name: "San Pedro Columnar",
    category: "cactus",
    price: 1299,
    image: c2,
    description:
      "Tall, sculptural cactus that brings a desert architectural feel to any room. Statement piece for modern interiors.",
    care: "Full sun, minimal watering once monthly.",
  },
  {
    id: "bunny-ears",
    name: "Bunny Ears Cactus",
    category: "cactus",
    price: 349,
    image: c3,
    description:
      "Adorable opuntia microdasys with paddle shaped pads that look like bunny ears. A playful favorite.",
    care: "Bright light, water sparingly.",
  },
  {
    id: "echeveria-blue",
    name: "Echeveria Pastel Rosette",
    category: "succulents",
    price: 299,
    image: c4,
    description:
      "Soft pastel-blue rosette succulent. Forms a perfect geometric flower shape that grows fuller over time.",
    care: "Bright indirect light, water when soil is dry.",
  },
  {
    id: "moon-cactus",
    name: "Pink Moon Cactus",
    category: "cactus",
    price: 699,
    image: c5,
    description:
      "Stunning grafted cactus with a vibrant pink crown and delicate blooms. A burst of color all year.",
    care: "Indirect light, water every 2 weeks.",
  },
  {
    id: "snake-plant",
    name: "Snake Plant",
    category: "air-purifying",
    price: 899,
    image: c6,
    description:
      "Hardy air-purifying plant with striking upright leaves. Thrives on neglect — perfect for busy people.",
    care: "Any light, water every 2–3 weeks.",
  },
  {
    id: "aloe-vera",
    name: "Aloe Vera",
    category: "indoor",
    price: 549,
    image: c7,
    description:
      "Healing aloe vera with thick, juicy leaves. Beautiful, useful, and impossible to kill.",
    care: "Bright light, water every 2 weeks.",
  },
  {
    id: "terracotta-trio",
    name: "Terracotta Pot Trio",
    category: "pots",
    price: 799,
    image: c8,
    description:
      "Set of three handmade terracotta pots in graduated sizes. Drainage holes included — ready to plant.",
    care: "Wipe clean. Lasts a lifetime.",
  },
];

export const defaultCareTips: CareTip[] = [
  { id: "ct1", icon: "droplets", title: "Water wisely", desc: "Only water when soil is fully dry. Most cacti thrive on neglect." },
  { id: "ct2", icon: "sun", title: "Bright light", desc: "Place near a sunny window. Indirect light works for most varieties." },
  { id: "ct3", icon: "sprout", title: "Right fertilizer", desc: "Feed with a cactus-specific fertilizer once a month in spring and summer." },
  { id: "ct4", icon: "repeat", title: "Repot when needed", desc: "Move to a slightly bigger pot every 2–3 years for healthy growth." },
];

export const defaultFaqs: Faq[] = [
  { id: "f1", q: "How often should I water my cactus?", a: "Once every 7–10 days in warmer months. In winter, water every 3–4 weeks. Always let the soil dry between waterings." },
  { id: "f2", q: "Does a cactus need sunlight?", a: "Yes — most cacti love bright indirect sunlight. A south or east-facing window is ideal." },
  { id: "f3", q: "Do you ship plants safely?", a: "Absolutely. Every plant is hand-packed in protective material to arrive in perfect condition." },
  { id: "f4", q: "What if my plant arrives damaged?", a: "Contact us within 48 hours with a photo and we'll replace it free of charge." },
  { id: "f5", q: "Can I return a plant?", a: "Live plants are non-returnable, but we guarantee healthy arrival and stand behind every shipment." },
];
