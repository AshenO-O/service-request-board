import type { Metadata } from "next";
import './globals.css';
import Footer from "./components/Footer";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "TradeConnect - Service Request Board",
  description: "Connect with qualified local tradespeople",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans flex flex-col min-h-screen">
        <AuthProvider>
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}