import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Info } from "@/components/common/Info";

export const metadata: Metadata = {
  title: "RPG",
  description: "Are you ready to level up?",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className = "bg-dark">
        <Info className = "absolute right-4 sm:right-10 top-4 sm:top-10 flex-col sm:flex-row"/>
            <div className = "*:min-h-screen max-h-full bg-dark bg-[url(/bg.svg)] *:p-12 *:md:p-24 *:sm:p-30 inset-shadow-black vignette z-20">
            {children}
            </div>
        </body>
      </SessionProvider>
    </html>
  );
}
