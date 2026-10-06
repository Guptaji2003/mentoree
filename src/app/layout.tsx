import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import StoreProvider from "@/providers/StoreProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sp!k | Verified Expert Mentorship Marketplace",
  description: "Connect college students and early-career engineers with verified professionals at Google, Stripe, Microsoft, OpenAI, Apple & Uber for paid 1:1 career consultations, DSA roadmaps, mock interviews, and structured post-session action plans.",
  keywords: "mentorship, verified experts, placement preparation, mock interview, system design, DSA roadmap, tech careers, Razorpay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-[#f8f9fb] text-[#1e293b] selection:bg-purple-100 selection:text-purple-700`}>
        <StoreProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
