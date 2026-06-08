"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import Home from "../../page";

export default function Page() {
  const { position } = useParams();
  const positionId = position as string;

  useEffect(() => {
    if (positionId) return;
  });

  return <Home />;
}
