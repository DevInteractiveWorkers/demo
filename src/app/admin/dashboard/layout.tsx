import type { Metadata } from "next";
import Navigation from "@/components/admin/dashboard/navigation";
import TutorialSteps from "@/components/admin/tutorial-steps";

export const metadata: Metadata = {
  title: "Demo - Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TutorialSteps />
      <main className="grid xl:grid-cols-[20%_60%_20%] md:grid-cols-[15%_85%] h-svh relative">
        <Navigation />
        <div className="h-full p-4 lg:border-r border-[#292929] max-md:overflow-x-hidden">
          {children}
        </div>
      </main>
    </>
  );
}
