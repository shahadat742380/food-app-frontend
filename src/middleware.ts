import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "./config/env";

type Session = typeof auth.$Infer.Session;

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of paths that do not require authentication
  const publicPaths = ["/login"];

  // Allow API authentication endpoints without session validation
  const apiAuthPaths = ["/api/auth/", "/api/auth/**"];

  // Skip middleware for public paths or API authentication paths
  if (
    publicPaths.some((path) => pathname.startsWith(path)) ||
    apiAuthPaths.some((path) => pathname.startsWith(path.replace("**", "")))
  ) {
    return NextResponse.next(); // No session validation for these paths
  }

  // Fetch session for all other paths
  const { data: session } = await betterFetch<Session>(
    `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/get-session`,
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Pass cookies from the request
      },
    }
  );

  // Redirect to the login page if the session is invalid
  if (!session) {
    if (!pathname.startsWith("/login")) {
      // Prevent redirect loop for /login
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Allow access if the session is valid
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
