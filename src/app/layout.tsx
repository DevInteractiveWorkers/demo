import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Import from the built-in module
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Demo InteractiveWorkers",
  description:
    "We are a group of remote workers that fill positions for companies all over the world, we cover any requirement, anywhere.",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Choose the weights you need
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.className} bg-[#191919]`}>
      <body className={`bg-cover bg-no-repeat md:bg-top-right bg-top-left`}>
        {children}
      </body>
    </html>
  );
}
