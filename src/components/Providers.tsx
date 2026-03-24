'use client'; // Obrigatório porque o Provider roda no navegador

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  // Criamos o cliente do React Query uma única vez
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 10, // Os dados ficam "frescos" por 10 minutos
        refetchOnWindowFocus: false, // Evita gastar API ao trocar de aba
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}