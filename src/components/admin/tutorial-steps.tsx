"use client";

import "@julscodes/react-spotlight-tour/styles.css";
import { Tutorial } from "@julscodes/react-spotlight-tour";
import { usePathname } from "next/navigation";
import { useGridView, useLocalStorage } from "@/lib/useLocalStorage";

export default function TutorialSteps() {
  const { view } = useGridView();

  const [completed, setCompleted] = useLocalStorage<Record<string, boolean>>(
    "demo-crm-tutorials",
    {},
  );
  const pathname = usePathname();
  const currentPath = pathname.split("/").filter(Boolean).at(-1) ?? "";
  const tutorialSteps = {
    dashboard: [
      {
        followId: "",
        title: "Welcome to Demo CRM",
        description: "Interactive Demo Guide: Mastering the Recruiting CRM.",
      },
      {
        followId: "navigation",
        title: "Orientation & Navigation",
        description:
          "A high-level view of how tabs and visual controls empower you to move quickly through jobs and candidate streams.",
      },
    ],

    positions: [
      {
        followId: "positions",
        title: "The Positions Tab",
        description:
          "Set up open requisitions. Build the descriptive baseline for new roles, define parameters, and align team expectations with just a single click.",
      },
      {
        followId: "add-positions",
        title: "Create your first job position.",
        description:
          "Every great hiring pipeline starts with a role. Head to the Positions tab, click and fill in the name and description. This establishes the foundation for your talent search and gives your candidates a target to aim for.",
      },
      {
        followId: "view-filter",
        title: "List vs. Grid Toggle",
        description:
          "Swap to a detailed, spreadsheet-like List view for quick data scrubbing, or use card-based Grid view to browse media assets.",
      },
      {
        followId: "search",
        title: "Fuzzy Search",
        description:
          "Instantly target candidate details or job descriptions via instant global text-matching fields.",
      },
    ],

    candidates: [
      {
        followId: "candidates",
        title: "The Candidates Tab",
        description:
          "Your action-oriented database. Centralizes names, corresponding roles, resumes, and video materials in a visual, collaborative workspace.",
      },
      {
        followId: "add-candidates",
        title: "Build your Talent Pool",
        description:
          "Bring your applicant pipeline to life. Input their name, assign them to an active position, and upload key assets—including their resume and a video introduction—to create a comprehensive candidate profile.",
      },
      {
        followId: "view-filter",
        title: "List vs. Grid Toggle",
        description:
          "Swap to a detailed, spreadsheet-like List view for quick data scrubbing, or use card-based Grid view to browse media assets.",
      },
      {
        followId: "search",
        title: "Fuzzy Search",
        description:
          "Instantly target candidate details or job descriptions via instant global text-matching fields.",
      },
      {
        followId: "filters",
        title: "Slice and Dice Your Data",
        description:
          "Don't waste time scrolling. Use the global search bar and smart filters on either the Positions or Candidates dashboards to instantly narrow down your list. Sort by role, name, or specific criteria in seconds.",
      },
      {
        followId: view === "list" ? "candidates-table" : "candidates-grid",
        title: `${view === "list" ? "Table" : "Grid"}`,
        description: "Hello",
      },
    ],
  };

  const steps = tutorialSteps[currentPath as keyof typeof tutorialSteps] ?? [];

  if (completed[currentPath]) {
    return null;
  }

  const handleClose = () => {
    setCompleted((prev) => ({
      ...prev,
      [currentPath]: true,
    }));
  };

  return null;

  return <Tutorial key={pathname} steps={steps} onClose={handleClose} />;
}
