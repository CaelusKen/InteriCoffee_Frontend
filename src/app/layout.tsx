import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

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
          <Providers>{children}</Providers>
      </body>
    </html>
  );
}
