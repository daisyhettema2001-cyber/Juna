import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display", display: "swap" });

export const metadata: Metadata = {
  title: "Juna – sapjes op het ritme van je cyclus",
  description:
    "Juna geeft je elke fase van je cyclus het sapje of de smoothie die past – met uitleg waarom. Plus routines voor een stralende huid en sterk haar.",
  applicationName: "Juna",
  appleWebApp: {
    capable: true,
    title: "Juna",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF7F2",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
