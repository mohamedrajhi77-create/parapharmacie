import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect admin routes (except the login page itself, otherwise infinite redirect loop)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminSession = req.cookies.get("admin-session");
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};
