import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function KitBuilder() {
  return <section className="kit-builder" id="kit">
    <div className="kit-image"><div className="kit-sticker">Ready<br />when<br />you are.</div></div>
    <div className="kit-copy"><span className="eyebrow">Start simple</span><h2>Build a kit that fits your life.</h2><p>Tell us where you train and what you want to improve. We’ll narrow the gear down to a focused three-piece setup.</p><ul><li><Check /> Under two minutes</li><li><Check /> Beginner friendly</li><li><Check /> No account needed</li></ul><Link href="#shop" className="button button-light">Explore starter gear <ArrowRight size={18} /></Link></div>
  </section>;
}
