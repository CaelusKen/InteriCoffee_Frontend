'use client'

import { ReactNode, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from '@/components/providers/session-provider';
import { CartProvider } from "@/components/custom/cart/cart-context";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}