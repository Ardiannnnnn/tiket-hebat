// app/providers.tsx - Production Ready
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ Data freshness
        staleTime: 5 * 60 * 1000, // 5 menit fresh
        gcTime: 10 * 60 * 1000, // 10 menit di cache sebelum dihapus
        
        // ✅ Retry strategy
        retry: (failureCount, error: any) => {
          // Jangan retry untuk 4xx errors
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // ✅ Refetch behavior
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        
        // ✅ Error handling
        throwOnError: false, // Jangan throw error ke error boundary
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}