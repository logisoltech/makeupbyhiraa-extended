import { Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata = {
  title: "Makeup By Hiraa | Melbourne Makeup & Hair Artist",
  description:
    "Certified makeup artist and hairstylist creating elegant bridal, formal, and special occasion looks across Melbourne.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${greatVibes.variable} ${cormorant.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
