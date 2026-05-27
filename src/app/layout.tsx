import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Mrs_Saint_Delafield } from "next/font/google";
import "./globals.css";
import GlobalBackgroundLines from "@/components/ui/global-background-lines";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const signature = Mrs_Saint_Delafield({
  subsets: ["latin"],
  variable: "--font-signature",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Awards Universitaires 2026",
  description: "Experience de vote premium pour la ceremonie du 13 Juin 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${cormorant.variable} ${signature.variable} font-sans antialiased`}>
        <AuthProvider>
          <GlobalBackgroundLines />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
