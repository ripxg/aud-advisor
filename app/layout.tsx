import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AUD Advisor - Australian Financial & Tax Advisory Tool",
  description: "Get your free Australian financial health check. Calculate taxes, project wealth, analyze net worth, and receive AI-powered financial insights based on ATO 2024-25 rates.",
  keywords: ["Australian tax calculator", "financial health check", "ATO 2024-25", "tax calculator Australia", "superannuation calculator", "net worth calculator"],
  authors: [{ name: "ripXG" }],
  openGraph: {
    title: "AUD Advisor - Your Free Australian Financial Health Check",
    description: "Calculate your taxes, project wealth growth, and get AI-powered financial insights based on ATO 2024-25 rates.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
