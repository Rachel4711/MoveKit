import Link from "next/link";
import { ArrowDownRight, Play } from "lucide-react"; //lucide-react is an icon library that provides ready-made React icon components.

export function Hero() {
  return <section className="hero">
    <div className="hero-copy">
      <span className="eyebrow hero-eyebrow">Portable gear. Zero excuses.</span>
      <h1>Your workout.<br /><em>Anywhere.</em></h1>
      <p>Compact fitness essentials made for real life—at home, outside, or wherever the day takes you.</p>
      <div className="hero-actions"><Link className="button button-primary" href="#shop">Shop equipment <ArrowDownRight size={18} /></Link><Link className="text-link" href="#kit"><span><Play size={14} fill="currentColor" /></span> Build your kit</Link></div>
      <div className="hero-stats"><div><strong>12</strong><span>portable essentials</span></div><div><strong>4</strong><span>ways to move</span></div><div><strong>1</strong><span>stronger routine</span></div></div>
    </div>
    <div className="hero-visual" role="img" aria-label="Athlete training with portable fitness equipment outdoors"><div className="hero-label label-top">Move freely</div><div className="hero-label label-bottom">No gym required</div><div className="orbit orbit-one" /><div className="orbit orbit-two" /></div>
  </section>;
}
