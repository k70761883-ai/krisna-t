import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataProvider } from './src/contexts/DataContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './src/index.css';
import './app/index.css';

const queryClient = new QueryClient();

// Disable console.log only in production (keep for debugging in dev)
if (typeof window !== 'undefined' && typeof console !== 'undefined' && import.meta.env.PROD) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  console.log = () => {};
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <App />
      </DataProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
