import Link from "next/link";

export function Footer() {
  return <footer><div className="footer-logo">MOVE<span>KIT</span></div><div className="footer-links"><div><strong>Shop</strong><Link href="/#strength">Strength</Link><Link href="/#mobility">Mobility</Link><Link href="/#cardio">Cardio</Link></div><div><strong>MoveKit</strong><Link href="/#kit">Our approach</Link><Link href="/#shop">Starter kits</Link><Link href="/#shop">Support</Link></div></div><p>Portfolio demonstration. Products and offers are illustrative.</p><div className="footer-bottom"><span>© 2026 MoveKit</span><span>Your workout. Anywhere.</span></div></footer>;
}
