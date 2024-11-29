import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 400 700 900",
});

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "AI Chatbot by yao-tx",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
