import { NextRequest, NextResponse } from "next/server";
import { getPosition } from "./lib/firestore";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/").filter(Boolean);

  const token = req.cookies.get("auth-token")?.value;

  // Public routes
  if (pathname === "/" || pathname === "/support" || pathname === "/admin") {
    return NextResponse.next();
  }

  /**
   * Protect /admin/*
   * Examples:
   * /admin/dashboard
   * /admin/users
   * /admin/settings
   */
  if (segments[0] === "admin" && segments.length > 1) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  }

  /**
   * Protect only /[position]
   *
   * Examples:
   * /general-va or /customer-service
   *
   * But NOT:
   * /general-va/john-doe
   */
  if (segments.length === 1) {
    const position = await getPosition(segments[0]);
    if (!position || !position.active) return;

    if (!token) {
      return NextResponse.redirect(
        new URL(`/api/position-redirect/${segments[0]}`, req.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
