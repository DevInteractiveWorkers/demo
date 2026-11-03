"use client";

import { useCallback, useEffect, useState } from "react";
import { GridViewOptions } from "@/components/admin/dashboard/select-grid";

export const GRID_VIEW_STORAGE_KEY = "dashboard-grid-view";

export const DEFAULT_GRID_VIEW: GridViewOptions = "grid-large";

/* -------------------------------------------------------------------------- */
/*                              Generic Helpers                               */
/* -------------------------------------------------------------------------- */

function isBrowser() {
  return typeof window !== "undefined";
}

export function getLocalStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  try {
    const value = localStorage.getItem(key);

    if (value === null) return fallback;

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function setLocalStorage<T>(key: string, value: T) {
  if (!isBrowser()) return;

  localStorage.setItem(key, JSON.stringify(value));

  window.dispatchEvent(
    new CustomEvent("local-storage-update", {
      detail: { key },
    }),
  );
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() =>
    getLocalStorage(key, defaultValue),
  );

  useEffect(() => {
    if (!isBrowser()) return;

    const reload = () => {
      setValue(getLocalStorage(key, defaultValue));
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        reload();
      }
    };

    const onCustomStorage = (event: Event) => {
      const custom = event as CustomEvent<{ key: string }>;

      if (custom.detail?.key === key) {
        reload();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("local-storage-update", onCustomStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("local-storage-update", onCustomStorage);
    };
  }, [key]);

  const updateValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const value =
          typeof next === "function" ? (next as (prev: T) => T)(prev) : next;

        setLocalStorage(key, value);

        return value;
      });
    },
    [key],
  );

  return [value, updateValue] as const;
}

/* -------------------------------------------------------------------------- */
/*                                  Grid View                                  */
/* -------------------------------------------------------------------------- */

export function useGridView() {
  const [view, setView] = useLocalStorage<GridViewOptions>(
    GRID_VIEW_STORAGE_KEY,
    DEFAULT_GRID_VIEW,
  );

  return {
    view,
    setView,
  };
}
