import type { Metadata } from "next";
import { Instrument_Serif, Schibsted_Grotesk, Spline_Sans_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_NAME, SITE_URL } from "@/lib/paths";
import "./globals.css";

const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Solve Spreadsheet Problems Faster`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Find, fix, explain, and copy tested Excel and Google Sheets formulas for real work — with plain-English explanations and sample data.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
