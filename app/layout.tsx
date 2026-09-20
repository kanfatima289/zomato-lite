import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zomato Lite",
  description: "Ludhiana Burrito — read and write reviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-10 border-b border-neutral-200 bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-[560px] items-center gap-2.5 px-6 py-3">
            <Link href="/" className="grid h-7 w-7 place-items-center rounded-lg bg-zred text-sm font-bold text-white">
              z
            </Link>
            <span className="text-sm font-semibold tracking-tight">zomato·lite</span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
