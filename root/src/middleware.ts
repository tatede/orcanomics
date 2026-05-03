import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip RSC requests, prefetches, and static files
  const isRSC = request.headers.get("rsc") === "1";
  const isPrefetch = request.headers.get("next-router-prefetch") === "1";
  const hasRscParam = request.nextUrl.searchParams.has("_rsc");

  if (isRSC || isPrefetch || hasRscParam) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/student/")) {
    const studentId = request.cookies.get("student_id")?.value;
    if (!studentId) {
      return NextResponse.redirect(new URL("/login/student", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*"],
};
