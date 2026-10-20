import { BicepsFlexed, PackageCheck, RotateCcw } from "lucide-react";

const benefits = [
  { icon: PackageCheck, title: "Made to move", copy: "Compact equipment that earns its space in your bag." },
  { icon: BicepsFlexed, title: "Built for progress", copy: "Simple gear designed to grow with your routine." },
  { icon: RotateCcw, title: "30-day reset", copy: "Try it at home. Send it back if it is not your fit." },
];

export function Benefits() {
  return <section className="benefits" aria-label="Why MoveKit">{benefits.map(({ icon: Icon, title, copy }, index) => <article key={title}><span>0{index + 1}</span><Icon /><h3>{title}</h3><p>{copy}</p></article>)}</section>;
}
