import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import UserInit from "@/components/UserInit";
import ReactQueryProvider from "@/components/ReactQueryProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next.js Firebase Starter",
  description: "Starter template for Next.js + Firebase (client-only auth)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} antialiased pattern`}>
        <ReactQueryProvider>
          <UserInit />
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
