"use client";

import EditPosition from "@/components/admin/data/edit-position";
import { Position } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function EditPositionPage() {
  const positionId = useSearchParams().get("p");
  const [candidate, setCandidate] = useState<Position | null>();
  const [loading, setLoading] = useState(false);
  return <EditPosition position={positionId} />;
}
