"use client";

import { useAuth } from "@/context/AuthContext";
import { Icon } from "../icons/icon";
import {
  DOMAttributes,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
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

function AdminSettings() {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [corner, setCorner] = useState<Corner>(2);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const offset = useRef({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
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
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  const snappedStyle =
    corner === 1
      ? { top: 0, left: 0 }
      : corner === 2
        ? { top: 0, right: 0 }
        : corner === 3
          ? { bottom: 0, left: 0 }
          : { bottom: 0, right: 0 };

  const style = isDragging
    ? {
        top: position.y,
        left: position.x,
      }
    : snappedStyle;

  const opensRight = corner === 1 || corner === 3;

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

  return (
    <>
      <div
        style={style}
        className="fixed z-1000 p-4 flex items-center w-max"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          if (!isDragging) setOpen(false);
        }}
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
            className={
              "aspect-square flex items-center cursor-grab justify-center p-2"
            }
            ref={ref}
            onPointerDown={(e) => {
              if (!ref.current) return;

              const rect = ref.current.getBoundingClientRect();

              offset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              };

              setIsDragging(true);
              setOpen(true);
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
            top-1/2 -translate-y-1/2
            flex gap-2
            rounded-full
            border border-white/20
            bg-black/80
            text-xs
            px-4 py-2
            whitespace-nowrap
            transition-all duration-150
            ${
              open && !isDragging
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
