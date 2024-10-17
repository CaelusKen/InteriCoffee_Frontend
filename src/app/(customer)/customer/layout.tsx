import Footer from "@/components/custom/sections/footer";
import Header from "@/components/custom/sections/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "InteriCoffee - Customer",
    description: "Customer's InteriCoffee!",
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return(
        <main>
            <Header />
            <section className="min-h-screen">
                {children}
            </section>
            <Footer />
        </main>
    )
}