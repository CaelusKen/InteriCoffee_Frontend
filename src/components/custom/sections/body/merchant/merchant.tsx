'use client'

import React, { useState } from 'react'
import ProductHome from './products/product';
import StyleHome from './styles/style';
import Dashboard from './dashboard/dashboard';
import MessageHome from './message/message';
import SaleCampagign from './sale-campaigns/sale-campaigns';
import MerchantSidebar from '@/components/custom/sidebar/merchant-sidebar';
import MerchantHeader from '../../sub-header/merchant-header';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Merchant() {
    const [activeSection, setActiveSection] = useState<string>("dashboard");

    const renderContent = () => {
        switch (activeSection) {
        case "stocks":
            return <ProductHome />;
        case "styles":
            return <StyleHome />;
        case "messages":
            return <MessageHome />;
        case "campaigns":
            return <SaleCampagign />;
        default:
            return <Dashboard />;
        }
    };
    return (
        <main className='flex h-screen'>
            <MerchantSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            {/* Body */}
            <section className='flex-1 overflow-hidden bg-white dark:bg-gray-900'>
                {/* Header section */}
                <MerchantHeader />
                <ScrollArea className="h-[calc(100vh-5rem)] p-6">
                    {renderContent()}
                </ScrollArea>
            </section>
        </main>
    )
}