'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // 1. O dado só será considerado "velho" após 1 hora
        staleTime: 1000 * 60 * 60, 
        // 2. Mantém no cache por 24 horas
        gcTime: 1000 * 60 * 60 * 24,
        // 3. DESATIVA buscar dados toda vez que você clica na aba do navegador
        refetchOnWindowFocus: false,
        // 4. Se a requisição falhar, tenta apenas 1 vez (evita loops de erro)
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
