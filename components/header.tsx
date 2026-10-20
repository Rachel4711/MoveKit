"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { useCart } from "@/components/cart-provider";

const links = ["Shop", "Strength", "Mobility", "Cardio"];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, setOpen } = useCart();
  return <>
    <div className="announcement">Free shipping on orders over $75 <span>•</span> Train anywhere</div>
    <header className="site-header">
      <Link href="/" className="logo" aria-label="MoveKit home">MOVE<span>KIT</span></Link>
      <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
        {links.map((link) => <Link key={link} href={link === "Shop" ? "/#shop" : `/#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{link}</Link>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button desktop-action" aria-label="Search"><Search size={20} /></button>
        <button className="icon-button desktop-action" aria-label="Account"><UserRound size={20} /></button>
        <button className="icon-button cart-button" aria-label={`Open cart with ${itemCount} items`} onClick={() => setOpen(true)}><ShoppingBag size={20} /><span>{itemCount}</span></button>
        <button className="icon-button menu-button" aria-label="Toggle menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>
    <CartDrawer />
  </>;
}
