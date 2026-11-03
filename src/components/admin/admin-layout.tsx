"use client";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";

// The floating admin widget (and the candidate editor behind it) is only
// needed for signed-in admins, so keep it out of the public pages' bundle.
const AdminSettings = dynamic(() => import("./admin-settings"), {
  ssr: false,
});

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  if (loading) {
    return <>{children}</>;
  }
  return (
    <>
      {user && <AdminSettings />}
      {children}
    </>
  );
}
