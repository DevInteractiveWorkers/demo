"use client";

import EditCandidate from "@/components/admin/data/edit-candidate";
import { LoadingPage } from "@/components/loading";
import { getCandidate } from "@/lib/firestore";
import { Candidate } from "@/lib/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCandidatePage() {
  const candidateId = useSearchParams().get("c");
  const [candidate, setCandidate] = useState<Candidate | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      if (!candidateId) return;
      setLoading(true);
      try {
        const data = await getCandidate(candidateId);
        setCandidate(data);
      } catch (e) {}
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return <LoadingPage />;

  if (!candidate)
    return (
      <div className="py-4">
        Candidate <code>{candidateId}</code> Not Found
        <br />
        <Link
          href={"/admin/dashboard/candidates"}
          className="hover:underline hover:opacity-70"
        >
          Click here to go back to dashboard
        </Link>
      </div>
    );

  return <EditCandidate candidate={candidate} />;
}
