//  ** Import core packages **
import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

const url = "https://beta.food-app.peacockindia.in/";
export const metadata: Metadata = {
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  title: "Bhojanam",
  description: "Order delicious food online with Bhojanam",
  keywords: ["Bhojanam", "Food delivery", "Online food", "Indian cuisine"],
  openGraph: {
    title: "Bhojanam - Order Food Online",
    description: "Order delicious food online with Bhojanam",
    url,
    type: "website",
    images: [
      {
        url: `${url}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Bhojanam banner",
      },
    ],
    siteName: "Bhojanam",
  },
  alternates: {
    canonical: url,
  },
  twitter: {
    card: "summary_large_image",
    site: "@bhojanam",
    description: "Order delicious food online with Bhojanam",
    images: [`${url}/logo.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Main Content */}
        <main className="min-h-screen max-w-[400px] mx-auto">{children}</main>
        <Toaster position="bottom-center" richColors duration={2000} />
      </body>
    </html>
  );
}
