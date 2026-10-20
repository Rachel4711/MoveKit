//1. Product type
//Defines what information every product must contain and which fields are optional.
export type Product = {
  slug: string;
  name: string;
  category: "Strength" | "Mobility" | "Cardio" | "Recovery";
  price: number;
  description: string;
  image: string;
  accent: string;
  badge?: string;
  variants: string[];
  inventory: number;
  featured: boolean;
};

//2. Products array
//This seed is used to initialize D1 and keeps local development usable before a database is attached.
export const seedProducts: Product[] = [
  { slug: "core-resistance-kit", name: "Core resistance kit", category: "Strength", price: 38, description: "Five progressive bands, door anchor, handles, and a travel pouch.", image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=1000&q=85", accent: "lime", badge: "Bestseller", variants: ["Light", "Medium", "Strong"], inventory: 32, featured: true },
  { slug: "flow-training-mat", name: "Flow training mat", category: "Mobility", price: 46, description: "A grippy, cushioned mat that rolls down small and stays flat.", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=1000&q=85", accent: "orange", badge: "New", variants: ["Graphite", "Electric lime", "Orange"], inventory: 18, featured: true },
  { slug: "speed-rope-pro", name: "Speed rope pro", category: "Cardio", price: 24, description: "Fast bearings and an adjustable cable for compact cardio sessions.", image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1000&q=85", accent: "blue", variants: ["2.4 m", "2.8 m", "3.1 m"], inventory: 40, featured: true },
  { slug: "reset-foam-roller", name: "Reset foam roller", category: "Recovery", price: 32, description: "A firm, textured roller for post-workout mobility and recovery.", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=85", accent: "violet", variants: ["Standard", "Firm"], inventory: 25, featured: false },
  { slug: "power-pushup-board", name: "Power push-up board", category: "Strength", price: 52, description: "Color-coded positions target chest, shoulders, back, and triceps.", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=85", accent: "orange", variants: ["Standard"], inventory: 14, featured: false },
  { slug: "move-bottle", name: "Move bottle 750", category: "Recovery", price: 28, description: "Double-wall hydration with an easy-carry loop and bold finish.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85", accent: "lime", variants: ["Black", "Lime", "Orange"], inventory: 48, featured: false },
];

export const categories = [
  { name: "Strength", number: "01", copy: "Build power anywhere." },
  { name: "Mobility", number: "02", copy: "Move freely every day." },
  { name: "Cardio", number: "03", copy: "Raise the pace." },
  { name: "Recovery", number: "04", copy: "Reset. Recharge. Repeat." },
] as const; //as const makes the array readonly and infers the types of the elements as their literal types instead of general types.

