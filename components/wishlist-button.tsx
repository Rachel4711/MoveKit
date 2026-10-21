"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const KEY = "movekit-wishlist";

function readWishlist() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[]; } catch { return []; }
}

export function WishlistButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setSaved(readWishlist().includes(slug)), 0);
    return () => window.clearTimeout(timer);
  }, [slug]);

  function toggle() {
    const current = readWishlist();
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    localStorage.setItem(KEY, JSON.stringify(next));
    setSaved(next.includes(slug));
    window.dispatchEvent(new Event("movekit-wishlist"));
  }

  return <button
    type="button"
    className={compact ? `wishlist-icon ${saved ? "is-saved" : ""}` : `button wishlist-button ${saved ? "is-saved" : ""}`}
    onClick={toggle}
    aria-pressed={saved}
    aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
  ><Heart size={compact ? 18 : 17} fill={saved ? "currentColor" : "none"} />{!compact && (saved ? "Saved" : "Save for later")}</button>;
}
