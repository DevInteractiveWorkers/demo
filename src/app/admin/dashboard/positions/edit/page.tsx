"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import EditPosition from "@/components/admin/data/edit-position";
import { LoadingPage } from "@/components/loading";
import { getPosition } from "@/lib/firestore";
import { Position } from "@/lib/type";

function EditPositionPageContent() {
  const positionId = useSearchParams().get("p");

  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!positionId) {
      setLoading(false);
      return;
    }

    getPosition(positionId)
      .then(setPosition)
      .finally(() => setLoading(false));
  }, [positionId]);

  if (loading) return <LoadingPage />;

  if (!position)
    return (
      <div className="py-4">
        Position <code>{positionId}</code> Not Found
        <br />
        <Link
          href="/admin/dashboard/positions"
          className="hover:underline hover:opacity-70"
        >
          Click here to go back to dashboard
        </Link>
      </div>
    );

  return <EditPosition key={position.id} position={position} />;
}

export default function EditPositionPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <EditPositionPageContent />
    </Suspense>
  );
}
