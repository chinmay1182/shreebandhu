// app/layout.tsx
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { CartProvider } from '@/app/context/CartContext';
import { AuthProvider } from '@/app/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shreebandhu',
  description: 'Shreebandhu | Shop for Powders, Spices and many more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <CartProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  fontSize: '15px',
                },
                success: {
                  style: {
                    background: '#4BB543',
                    color: '#fff',
                  },
                },
                error: {
                  style: {
                    background: '#FF3333',
                    color: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}