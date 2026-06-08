"use client";

import CreateCandidate from "@/components/admin/create-candidate";
import CreatePosition from "@/components/admin/create-position";
import Candidates from "@/components/admin/dashboard/candidates";
import Positions from "@/components/admin/dashboard/positions";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState<"positions" | "candidates" | "">("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;

  if (!user) return null;

  return (
    <section className="grid lg:grid-cols-[20%_60%_20%] sm:grid-cols-[20%_80%] h-svh">
      <aside className="border-r border-[#292929] p-4 flex flex-col items-center gap-4">
        <Link href={"/"}>
          <Image
            src="/logo/01_Primary_Logo/Primary_Logo-05.png"
            className="w-50 cursor-pointer"
            width={1080}
            height={1080}
            alt="logo"
          />
        </Link>
        <ul className="space-y-2 w-full">
          <li
            onClick={() => setSelected("positions")}
            className="cursor-pointer"
          >
            Positions
          </li>

          <li
            onClick={() => setSelected("candidates")}
            className="cursor-pointer"
          >
            Candidates
          </li>
        </ul>
      </aside>
      <main className="p-4">
        <div className="h-full">
          {selected === "" && (
            <div className="flex flex-col h-full justify-center">
              <p className="cursor-default text-5xl">
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
