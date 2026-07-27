"use client";

import { Suspense } from "react";
import { LoadingPage } from "@/components/loading";
import EditCandidatePageContent from "./edit-candidate-page-content";

export default function EditCandidatePage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <EditCandidatePageContent />
    </Suspense>
  );
}
