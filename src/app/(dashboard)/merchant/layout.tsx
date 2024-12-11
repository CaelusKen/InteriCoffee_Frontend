import MerchantHeader from "@/components/custom/sections/sub-header/merchant-header";
import MerchantSidebar from "@/components/custom/sidebar/merchant-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "InteriCoffee - Merchant",
    description: "Build your interior, your own way!",
};

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='flex h-screen'>
          <MerchantSidebar />
          <section className='flex-1 overflow-hidden bg-white dark:bg-gray-900'>
            <MerchantHeader />
            <ScrollArea className="h-[calc(100vh-5rem)] p-2">
              {children}
            </ScrollArea>
          </section>
        </main>
    )
}
