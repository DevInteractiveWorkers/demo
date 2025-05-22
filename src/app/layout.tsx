import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Demo InteractiveWorkers",
  description:
    "We are a group of remote workers that fill positions for companies all over the world, we cover any requirement, anywhere.",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.className} bg-[#181621]`}>
      <body
        className={`bg-[url(/main-banner.png)] bg-cover bg-no-repeat md:bg-top-right bg-top-left`}
      >
        <main className="flex flex-col h-dvh overflow-y-hidden">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
