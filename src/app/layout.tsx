import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
