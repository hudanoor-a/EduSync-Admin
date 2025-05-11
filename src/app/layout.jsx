
import { Inter as Geist } from 'next/font/google'; // Using Inter as a placeholder for Geist Sans
import { Source_Code_Pro as Geist_Mono } from 'next/font/google'; // Using Source Code Pro as a placeholder for Geist Mono
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/components/Providers';
import { ToastProvider } from "@/components/ui/use-toast.jsx"; // .jsx extension


const geistSans = Geist({ 
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ 
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'EduCentral Admin',
  description: 'Admin panel for EduCentral University SaaS',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <Providers>
          <ToastProvider> {/* Wrap with ToastProvider */}
            {children}
            <Toaster />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}

