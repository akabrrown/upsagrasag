import type { Metadata } from 'next';
import './globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import ConditionalFooter from '@/components/ConditionalFooter';

export const metadata: Metadata = {
  metadataBase: new URL("https://grasag.upsa.edu.gh"),
  title: "GRASAG-UPSA",
  description:
    "The official digital platform of the Graduate Students' Association of Ghana, University of Professional Studies, Accra (UPSA). Access academics, past questions, welfare, and careers.",
  keywords: ["GRASAG", "UPSA", "Ghana", "Graduate Students", "University of Professional Studies Accra", "Student Portal", "Past Questions", "Postgraduate"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "GRASAG-UPSA",
    description: "The official digital platform for UPSA graduate students.",
    url: "https://grasag.upsa.edu.gh",
    siteName: "GRASAG-UPSA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GRASAG-UPSA",
    description: "The official digital platform for UPSA graduate students.",
  },
  icons: { icon: '/favicon.png' },
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
