"use client";

import { useEffect, useState } from "react";
import { GridViewOptions } from "@/components/admin/dashboard/select-grid";

export const GRID_VIEW_STORAGE_KEY = "dashboard-grid-view";

export const DEFAULT_GRID_VIEW: GridViewOptions = "grid-large";

export function getGridView(): GridViewOptions {
  if (typeof window === "undefined") {
    return DEFAULT_GRID_VIEW;
  }

  const stored = localStorage.getItem(GRID_VIEW_STORAGE_KEY);

  switch (stored) {
    case "grid-small":
    case "grid-large":
    case "list":
      return stored;

    default:
      return DEFAULT_GRID_VIEW;
  }
}

export function saveGridView(view: GridViewOptions) {
  if (typeof window === "undefined") return;

  localStorage.setItem(GRID_VIEW_STORAGE_KEY, view);

  window.dispatchEvent(new Event("grid-view-update"));
}

export function useGridView() {
  const [view, setView] = useState<GridViewOptions>(DEFAULT_GRID_VIEW);

  useEffect(() => {
    const load = () => {
      setView(getGridView());
    };

    load();

    window.addEventListener("storage", load);
    window.addEventListener("grid-view-update", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("grid-view-update", load);
    };
  }, []);

  const updateView = (
    value: GridViewOptions | ((prev: GridViewOptions) => GridViewOptions),
  ) => {
    const next = typeof value === "function" ? value(view) : value;

    setView(next);
    saveGridView(next);
  };

  return {
    view,
    setView: updateView,
  };
}
