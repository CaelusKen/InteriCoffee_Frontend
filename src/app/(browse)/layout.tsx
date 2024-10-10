import Header from "@/components/custom/sections/header";
import Footer from "@/components/custom/sections/footer";

export default function BrowseLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return(
        <>
            <Header />
            <main>
                {children}
            </main>
            <Footer/>
        </>
    )
}