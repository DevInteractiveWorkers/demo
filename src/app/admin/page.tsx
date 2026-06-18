"use client";
import LoginForm from "@/components/admin/login";
import Image from "next/image";

export default function AdminPage() {
  return (
    <main className="flex items-center justify-center h-svh w-full p-10">
      <Image
        src="/logo/01_Primary_Logo/Primary_Logo-05.png"
        className="md:max-w-xl p-10 absolute top-0"
        width={1080}
        height={1080}
        alt="logo"
      />
      <LoginForm />
    </main>
  );
}
