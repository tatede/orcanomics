import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect student routes
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
