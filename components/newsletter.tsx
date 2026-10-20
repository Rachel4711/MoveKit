"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  const [message, setMessage] = useState("");
  function subscribe(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage("You’re on the list. Let’s move!"); event.currentTarget.reset(); }
  return <section className="newsletter"><div><span className="eyebrow">Move better, weekly</span><h2>Join the movement.</h2></div><div><p>Short workouts, useful recovery tips, and first access to new gear.</p><form onSubmit={subscribe}><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="EMAIL ADDRESS" required /><button aria-label="Subscribe"><ArrowRight /></button></form><output aria-live="polite">{message}</output></div></section>;
}
