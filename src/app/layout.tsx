import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "QuizStamp — Web3 Educational Assessment on Botchain Mainnet",
  description:
    "Answer technology and computing questions, view your score, and stamp your verified result directly onto the Botchain Mainnet blockchain.",
  keywords: ["QuizStamp", "Web3", "Botchain Mainnet", "Solidity", "Blockchain Quiz", "Crypto"],
  authors: [{ name: "QuizStamp Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-page text-mainText antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
