import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoveKit — Your workout. Anywhere.",
  description: "Portable fitness essentials for training at home, outdoors, or on the move.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en"><body><CartProvider><Header />{children}<Footer /></CartProvider></body></html>;
}
