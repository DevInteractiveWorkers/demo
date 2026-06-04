"use client";

import CreateCandidate from "@/components/admin/create-candidate";
import CreatePosition from "@/components/admin/create-position";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState<"positions" | "candidates">(
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
    <section className="p-4 grid md:grid-cols-[20%_80%] h-svh gap-4">
      <aside className="border-r border-[#292929]">
        <Link href={"/"}>
          <Image
            src="/logo/01_Primary_Logo/Primary_Logo-05.png"
            className="w-[200px] cursor-pointer"
            width={1080}
            height={1080}
            alt="logo"
          />
        </Link>
        <ul className="space-y-2">
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
      <main>
        <p className="cursor-default">Welcome back, {user.email}</p>
        <div className="mt-8">
          {selected === "positions" && <CreatePosition />}
          {selected === "candidates" && <CreateCandidate />}
        </div>
      </main>
    </section>
  );
}
