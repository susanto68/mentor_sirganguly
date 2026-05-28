import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  title: "GrowthVerse — Life Roadmap & Career Ecosystem for Indian Students",
  description: "Explore the possibilities of your future. GrowthVerse is a futuristic, highly interactive, AI-powered life roadmap ecosystem vetted by Sir Ganguly for Indian students, parents, teachers, and job seekers.",
  keywords: ["career roadmap", "student direction", "indian students", "sir ganguly", "parent psychology", "career ecosystem"],
  authors: [{ name: "Sir Ganguly" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
    </html>
  );
}
