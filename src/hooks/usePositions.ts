// hooks/usePositions.ts
import { useEffect, useState } from "react";
import { getPositions } from "@/lib/firestore";

export type PositionOption = { name: string; value: string };

/** All positions as `{ name, value: id }` options for `<Input type="select">`. */
export function usePositions() {
  const [positions, setPositions] = useState<PositionOption[]>([]);

  useEffect(() => {
    getPositions().then((data) => {
      setPositions(
        data.map((position) => ({
          name: position.name,
          value: position.id,
        })),
      );
    });
  }, []);

  return positions;
}
