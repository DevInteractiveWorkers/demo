import type { Metadata } from "next";
import Navigation from "@/components/admin/dashboard/navigation";

export const metadata: Metadata = {
  title: "Demo - Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid lg:grid-cols-[20%_60%_20%] md:grid-cols-[20%_80%] h-svh relative">
      <Navigation />
      <div className="h-full p-4 lg:border-r border-[#292929] max-md:overflow-x-hidden">
        {children}
      </div>
    </main>
  );
}
