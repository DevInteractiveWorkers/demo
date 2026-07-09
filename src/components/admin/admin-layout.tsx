"use client";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "../icons/icon";
import { useEffect, useRef, useState } from "react";
import { handleShare } from "@/lib/useShare";
import EditCandidate from "./data/edit-candidate";
import { usePathname } from "next/navigation";
import { getCandidate } from "@/lib/firestore";
import Link from "next/link";
import { logout } from "@/lib/auth";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  if (loading) {
    return <>{children}</>;
  }
  return (
    <>
      {user && <AdminSettings />}
      {children}
    </>
  );
}

type Corner = 1 | 2 | 3 | 4;

// Distance from the screen edge the widget snaps to. Combined with
// env(safe-area-inset-*) so it clears notches / home indicators on iOS.
const INSET = 16;

// Kept deliberately modest (well below typical modal/toast z-indices like
// z-50/z-[9999]) so the widget sits above page content without ever
// competing with other fixed overlays the app might render.
const WIDGET_Z = "z-1000";

function cornerStyle(corner: Corner): React.CSSProperties {
  const top = `calc(${INSET}px + env(safe-area-inset-top, 0px))`;
  const bottom = `calc(${INSET}px + env(safe-area-inset-bottom, 0px))`;
  const left = `calc(${INSET}px + env(safe-area-inset-left, 0px))`;
  const right = `calc(${INSET}px + env(safe-area-inset-right, 0px))`;

  switch (corner) {
    case 1:
      return { top, left };
    case 2:
      return { top, right };
    case 3:
      return { bottom, left };
    case 4:
    default:
      return { bottom, right };
  }
}

function AdminSettings() {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [corner, setCorner] = useState<Corner>(2);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  const offset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    setIsTouch(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        moved.current = true;
      }

      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width ?? 0;
      const height = rect?.height ?? 0;

      // Constrain the drag to the viewport so the widget can never be
      // dragged off-screen or under another app menu.
      const nextX = Math.max(
        0,
        Math.min(e.clientX - offset.current.x, window.innerWidth - width),
      );
      const nextY = Math.max(
        0,
        Math.min(e.clientY - offset.current.y, window.innerHeight - height),
      );
      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging) return;

      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;
      if (e.clientX < halfWidth && e.clientY < halfHeight) {
        setCorner(1);
      } else if (e.clientX >= halfWidth && e.clientY < halfHeight) {
        setCorner(2);
      } else if (e.clientX < halfWidth && e.clientY >= halfHeight) {
        setCorner(3);
      } else {
        setCorner(4);
      }
      setIsDragging(false);

      // On touch, a tap (pointerdown -> pointerup with negligible movement)
      // toggles the menu instead of relying on hover, which never fires.
      if (isTouch && !moved.current) {
        setOpen((o) => !o);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, isTouch]);

  // Tap-outside-to-close on touch devices.
  useEffect(() => {
    if (!isTouch || !open) return;
    const handleOutside = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [isTouch, open]);

  const snappedStyle = cornerStyle(corner);
  const style: React.CSSProperties = isDragging
    ? {
        top: position.y,
        left: position.x,
        transition: "none",
      }
    : {
        ...snappedStyle,
        // Subtle snap animation once dragging ends; disabled mid-drag so
        // the widget tracks the finger/cursor instantly.
        transition:
          "top 300ms ease-out, left 300ms ease-out, right 300ms ease-out, bottom 300ms ease-out",
      };

  const opensRight = corner === 1 || corner === 3;
  const opensUp = corner === 3 || corner === 4;

  const pathname = usePathname();
  const segments = pathname.split("/");
  const [candidate, setCandidate] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      const candidate = await getCandidate(segments[segments.length - 1]);
      setCandidate(candidate);
    };
    fetchCandidate();
  }, [segments]);

  const showMenu = open && !isDragging;

  return (
    <>
      <div
        ref={containerRef}
        style={style}
        className={`fixed ${WIDGET_Z} p-4 flex items-center w-max`}
        onMouseEnter={isTouch ? undefined : () => setOpen(true)}
        onMouseLeave={
          isTouch
            ? undefined
            : () => {
                if (!isDragging) setOpen(false);
              }
        }
      >
        <span
          className={`
          relative
          rounded-full
          border border-white/20
          bg-black/80
          text-xs
          font-medium
          backdrop-blur-sm
          flex items-center
          transition-all duration-150
          ${isDragging ? "cursor-grabbing scale-105 -translate-1/2" : ""}
        `}
        >
          <span
            className="aspect-square flex items-center cursor-grab justify-center p-2 touch-none"
            ref={ref}
            onPointerDown={(e) => {
              if (!ref.current) return;
              const rect = ref.current.getBoundingClientRect();
              offset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              };
              dragStart.current = { x: e.clientX, y: e.clientY };
              moved.current = false;
              setIsDragging(true);
              // Menu opening is deferred: on desktop hover already handles
              // it, and on touch we don't want it to flash open mid-drag —
              // it only opens on pointerup if this turns out to be a tap.
            }}
          >
            <Icon
              icon="admin"
              filled
              stroke={0}
              width="30px"
              height="30px"
              viewBox="-2 1 24 24"
            />
          </span>
          <span
            className={`
            absolute
            ${opensRight ? "left-full ml-2 flex-row-reverse" : "right-full mr-2"}
            ${opensUp ? "bottom-0" : "top-0"}
            flex gap-2
            rounded-full
            border border-white/20
            bg-black/80
            text-xs
            px-4 py-2
            whitespace-nowrap
            max-w-[min(90vw,26rem)]
            overflow-x-auto
            transition-all duration-150
            ${
              showMenu
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }
          `}
          >
            <Link
              href={"/admin/dashboard"}
              className={`border-white/20 ${opensRight ? "pl-2 border-l" : "pr-2 border-r"}
                hover:underline hover:opacity-50 transition-all duration-150 cursor-pointer`}
            >
              Admin Panel
            </Link>
            <ul className="flex gap-4">
              <li>
                <button
                  className="hover:underline hover:opacity-50 transition-all duration-150 cursor-pointer"
                  onClick={() => logout()}
                >
                  Logout
                </button>
              </li>
              <li>
                <button
                  className="hover:underline hover:opacity-50 transition-all duration-150 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare({ url: window.location.href });
                  }}
                >
                  Share
                </button>
              </li>
              <li>
                <button
                  className="hover:underline hover:opacity-50 transition-all duration-150 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                >
                  Edit
                </button>
              </li>
            </ul>
          </span>
        </span>
      </div>
      {candidate && (
        <EditCandidate
          candidate={candidate}
          isOpen={isEditing}
          toggleClose={() => {
            setIsEditing(false);
          }}
        />
      )}
    </>
  );
}
