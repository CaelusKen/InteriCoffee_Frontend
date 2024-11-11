'use client'

import { ReactNode, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from '@/components/providers/session-provider';
import { CartProvider } from "@/components/custom/cart/cart-context";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider as ToastProviderPrimitive } from "@/components/ui/toast"

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
        <ToastProviderPrimitive>
          <CartProvider>
            <SessionProvider>
              {children}
            </SessionProvider>
          </CartProvider>
        </ToastProviderPrimitive>
      </QueryClientProvider>
    </ThemeProvider>
  );
}