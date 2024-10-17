import ConsultantHeader from "@/components/custom/sections/sub-header/consultant-header";
import ConsultantSidebar from "@/components/custom/sidebar/consultant-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "InteriCoffee - Consultant",
    description: "Build your interior, your own way!",
};

export default function ConsultantLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='flex h-screen'>
          <ConsultantSidebar />
          <section className='flex-1 overflow-hidden bg-white dark:bg-gray-900'>
            <ConsultantHeader />
            <ScrollArea className="h-[calc(100vh-5rem)] p-6">
              {children}
            </ScrollArea>
          </section>
        </main>
    )
}
