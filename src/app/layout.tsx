import type { Metadata } from 'next';
import './globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import ConditionalFooter from '@/components/ConditionalFooter';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: "GRASAG-UPSA Portal | Graduate Students' Association of Ghana, UPSA",
  description:
    "The official digital platform of the Graduate Students' Association of Ghana, University of Professional Studies, Accra (UPSA). Access academics, past questions, welfare, and careers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased font-sans" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground">
        <ConditionalNavbar />
        <AuthProvider>
          <main className="flex-1">{children}</main>
        </AuthProvider>
        <ConditionalFooter />
      </body>
    </html>
  );
}
