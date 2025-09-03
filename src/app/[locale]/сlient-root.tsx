'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/context/ThemeProvider';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import '@/App.css';

export function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}
