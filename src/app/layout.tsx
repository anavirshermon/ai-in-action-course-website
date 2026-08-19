import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI in Action — UT Dallas",
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
      className={`${instrumentSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NavBar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
