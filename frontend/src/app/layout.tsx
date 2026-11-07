import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pragya — Rajasthan Technical Education Portal & AI Chatbot",
  description: "Department of Technical Education (DTE), Government of Rajasthan - Multilingual Student Assistance Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

