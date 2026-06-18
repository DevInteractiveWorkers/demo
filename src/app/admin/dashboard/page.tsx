import { Suspense } from "react";
import DashboardClient from "./DashboardClient";
import { LoadingPage } from "@/components/loading";

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <DashboardClient />
    </Suspense>
  );
}
