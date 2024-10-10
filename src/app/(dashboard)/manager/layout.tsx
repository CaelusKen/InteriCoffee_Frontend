import ManagerHeader from "@/components/custom/sections/sub-header/manager-header";
import ManagerSidebar from "@/components/custom/sidebar/manager-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "InteriCoffee - Merchant",
    description: "Build your interior, your own way!",
};

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='flex h-screen'>
          <ManagerSidebar />
          <section className='flex-1 overflow-hidden bg-white dark:bg-gray-900'>
            <ManagerHeader />
            <ScrollArea className="h-[calc(100vh-5rem)] p-6">
              {children}
            </ScrollArea>
          </section>
        </main>
    )
}
