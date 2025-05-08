import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { url } from "inspector";

export const metadata: Metadata = {
  title: "InteractiveWorkers",
  description:
    "We are a group of remote workers that fill positions for companies all over the world, we cover any requirement, anywhere.",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const homeStyle: React.CSSProperties = {
  backgroundImage: `url(/main-banner.png)`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center top",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <main className="flex h-lvh items-center" style={homeStyle}>
          {children}
        </main>
      </body>
    </html>
  );
}
