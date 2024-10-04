import Footer from "@/components/custom/sections/footer";
import Header from "@/components/custom/sections/header";

export default function FurnitureLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return(
        <body>
            <Header />
            {children}
            <Footer />
        </body>
    )
}