import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { LogoSprite } from "@/brand/Logo";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "Sri Skanda Constructions | Builders & Developers | Pondicherry",
  description:
    "Sri Skanda Constructions - Trusted builders and developers in Pondicherry offering residential & commercial construction, Vastu consultation, and turnkey project solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LogoSprite />
        {children}
      </body>
    </html>
  );
}
