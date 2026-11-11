import type { Metadata, Viewport } from "next";
import { DM_Mono, Jost } from "next/font/google";
import { LogoSprite } from "@/brand/Logo";
import { OG_IMAGE } from "@/lib/seo";
import { site } from "@content/site";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

/** Technical labels only: dimensions, floor numbers, sheet numbers. */
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const TITLE = "Sri Skanda Constructions | Home and commercial builders based in Pondicherry";
const DESCRIPTION =
  "Residential and commercial builders based in Saram, Pondicherry. Custom homes, villas, apartments, offices and showrooms, planned with Vastu and built from foundation to finishing.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: TITLE, template: `%s | ${site.name}` },
  description: DESCRIPTION,
  applicationName: site.name,
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#1a2340",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jost.variable} ${dmMono.variable} antialiased`}>
      <body>
        <LogoSprite />
        {children}
      </body>
    </html>
  );
}
