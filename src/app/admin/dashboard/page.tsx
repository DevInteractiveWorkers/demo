"use client";

import CreateCandidate from "@/components/admin/create-candidate";
import CreatePosition from "@/components/admin/create-position";
import Candidates from "@/components/admin/dashboard/candidates";
import Navigation from "@/components/admin/dashboard/navigation";
import Positions from "@/components/admin/dashboard/positions";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState<"positions" | "candidates" | "">(
    "positions",
  );
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;

  if (!user) return null;

  return (
    <section className="grid lg:grid-cols-[20%_60%_20%] md:grid-cols-[20%_80%] h-svh relative">
      <Navigation />
      <main className="p-4">
        <div className="h-full">
          {selected === "" && (
            <div className="flex flex-col h-full md:justify-center">
              <p className="cursor-default md:text-5xl">
                Welcome back,
                <br />
                <strong className="font-semibold">{user.email}</strong>
              </p>
            </div>
          )}
          {selected === "positions" && <Positions />}
          {selected === "candidates" && <Candidates />}
        </div>
      </main>
    </section>
  );
}
