"use client";
import LoginForm from "@/components/admin/login";
import { ParticlesComponent } from "iw-particles";
import Image from "next/image";

export default function AdminPage() {
  return (
    <main className="flex items-center justify-center h-svh w-full p-10">
      <div className="mask-linear-from-20% -mask-linear-135 mask-linear-to-60% w-full h-full max-h-svh top-0 left-0 absolute">
        <ParticlesComponent id={"bg"} color="#FFF" />
      </div>
      <div
        className={`fixed bg-[#C2272D] md:w-full w-[200%] h-auto aspect-square mask-radial-from-0 mask-radial-to-70% left-0 top-full -translate-x-1/2 -translate-y-1/3 overflow-hidden ${false ? "opacity-0 -translate-x-full" : ""} transition-all duration-2000`}
      >
        <ParticlesComponent id="gradient" color="#191919" />
      </div>
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
