import type { Metadata, ResolvingMetadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({subsets: ['latin']});

type Props = {
  children: ReactNode
  params: { lang: string }
}

export const metadata: Metadata = {
  title: "InteriCoffee - Home",
  description: "Build your interior, your own way!",
};

//Uncomment this function once all APIS has been implemented

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   // Read route params
//   const lang = params.lang ?? 'en'

//   // Fetch data from an API or database
//   const pageData = await fetchPageData(lang)

//   // Optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || []

//   return {
//     title: pageData.title,
//     description: pageData.description,
//     openGraph: {
//       images: ['/some-specific-page-image.jpg', ...previousImages],
//     },
//   }
// }

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
