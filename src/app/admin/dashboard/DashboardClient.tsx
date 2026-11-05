"use client";

import { LoadingPage } from "@/components/loading";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function DashboardClient() {
  const { user, loading } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();

  const selected =
    (searchParams.get("c") as "positions" | "candidates" | null) ?? "";

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin");
    }
  }, [user, loading, router]);

  if (loading) return <LoadingPage />;

  if (!user) return null;

  const DashboardLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    return (
      <Link href={"/admin/dashboard" + href}>
        <code className="bg-white/10 px-1 hover:bg-white text-[#191919] transition-all duration-100">
          {children}
        </code>
      </Link>
    );
  };

  return (
    <section className="h-dvh">
      {selected === "" && (
        <div className="h-full flex flex-col items-center justify-center">
          <Image
            src={"/logo/03_Logo_Mark/03_Logo_Mark-01.png"}
            alt={"InteractiveWorkers"}
            width={1080}
            height={1080}
            className="max-w-40 h-auto aspect-square object-contain animate-loading-flip relative p-4 top-0"
          />
          <p className="cursor-default md:text-4xl text-2xl">
            Welcome back,{" "}
            <strong className="font-semibold">
              {user.email!.split("@")[0]}
            </strong>
          </p>
          <p className="text-white/50">
            Add <DashboardLink href="/candidates">candidates</DashboardLink>
            . <br className="md:hidden" />
            Update your{" "}
            <DashboardLink href="/positions">positions</DashboardLink>.
          </p>
          <button
            className="p-4 hover:opacity-50 transition-all duration-150 cursor-pointer"
            onClick={() => logout()}
          >
            Log Out
          </button>
        </div>
      )}
    </section>
  );
}
