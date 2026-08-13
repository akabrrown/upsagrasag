import type { Metadata } from 'next';
import './globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import ConditionalFooter from '@/components/ConditionalFooter';

export const metadata: Metadata = {
  title: "GRASAG-UPSA Portal | Graduate Students' Association of Ghana, UPSA",
  description:
    "The official digital platform of the Graduate Students' Association of Ghana, University of Professional Studies, Accra (UPSA). Access academics, past questions, welfare, and careers.",
  openGraph: {
    title: "GRASAG-UPSA Portal",
    description: "The official digital platform for UPSA graduate students.",
    url: "https://grasag-upsa.edu.gh",
    siteName: "GRASAG-UPSA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GRASAG-UPSA Portal",
    description: "The official digital platform for UPSA graduate students.",
  },
};

import { AxiomWebVitals } from 'next-axiom';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased font-sans" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground">
        <AxiomWebVitals />
        <ConditionalNavbar />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
