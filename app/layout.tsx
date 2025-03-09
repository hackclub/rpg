import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "RPG",
  description: "Description!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className = "bg-dark overscroll-none">
            <div className = "*:min-h-screen max-h-full bg-dark bg-[url(/bg.svg)] *:p-16 *:md:p-24 *:sm:p-30 inset-shadow-black vignette z-20">
            {children}
            </div>
        </body>
      </SessionProvider>
    </html>
  );
}
