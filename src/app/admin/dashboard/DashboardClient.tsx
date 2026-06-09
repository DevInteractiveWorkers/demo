"use client";

import { useAuth } from "@/context/AuthContext";
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

  if (loading) return <p>Loading...</p>;

  if (!user) return null;

  return (
    <section className="p-4">
      <div className="h-full">
        {selected === "" && (
          <div className="flex flex-col h-full md:justify-center">
            <p className="cursor-default md:text-4xl text-2xl">
              Welcome back,
              <br />
              <strong className="font-semibold">{user.email}</strong>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
