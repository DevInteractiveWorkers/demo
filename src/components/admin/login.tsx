"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Input from "./input/input";
import Button from "./button";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(email, password);

      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error(err);

      switch (err.code) {
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;

        default:
          setError("Unable to sign in.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="md:p-10 px- py-10 w-full md:max-w-xl sm:max-w-9/12 max-w-11/12 mx-2 grid justify-items-center gap-4
        border rounded-2xl border-[#292929] absolute z-10
        bg-linear-0 from-[#191919] to-[#292929] inset-shadow-[0_-10px_10px_5px_#191919] backdrop-blur-2xl"
    >
      <h1 className="text-2xl font-medium">Welcome Back</h1>
      <p className="text-sm text-white/50 text-center">
        Access is restricted to authorized accounts.
        <br />
        Registration is not available.
      </p>
      <Input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder={"Email"}
        required
        example={"username@interactiveworkers.com"}
      />
      <Input
        onChange={(e) => setPassword(e.target.value)}
        placeholder={"Password"}
        type="password"
        secret
        required
        example={"********"}
      />
      {error && (
        <p className="text-[#C2272D] text-sm cursor-default">{error}</p>
      )}
      <Button>{loading ? "Signing In..." : "Sign In"}</Button>
      <p className="text-center cursor-default">
        Don't have an account or having trouble logging in?
        <br />
        <a className="text-[#C2272D] hover:cursor-pointer hover: group relative">
          Contact Support for assistance.
          <span className="absolute bg-[currentColor] h-px w-0 group-hover:w-full top-full left-1/2 group-hover:left-0 transition-all duration-200" />
        </a>
      </p>
    </form>
  );
}
