import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ENTP 6314 — AI in Action",
  description:
    "Building Products, Ventures, and Competitive Advantage. UT Dallas, Fall 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="site-texture flex min-h-full flex-col">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
