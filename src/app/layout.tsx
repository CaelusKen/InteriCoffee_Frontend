import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({subsets: ['latin']});

export const metadata: Metadata = {
  title: "InteriCoffee - Home",
  description: "Build your interior, your own way!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={outfit.className}
      >
        {children}
      </body>
    </html>
  );
}
