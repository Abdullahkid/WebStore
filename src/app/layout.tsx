import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Downxtown - Social Commerce Platform",
  description: "Discover amazing products from local stores on Downxtown",
  keywords: ["social commerce", "local stores", "online shopping", "downxtown"],
  authors: [{ name: "Downxtown" }],
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
