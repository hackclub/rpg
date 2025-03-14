import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Info } from "@/components/common/Info";

export const metadata: Metadata = {
  title: "RPG",
  description: "Description!",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className = "bg-dark">
          <Info/>
            <div className = "*:min-h-screen max-h-full bg-dark bg-[url(/bg.svg)] *:p-12 *:md:p-24 *:sm:p-30 inset-shadow-black vignette z-20">
            {children}
            </div>
        </body>
      </SessionProvider>
    </html>
  );
}
