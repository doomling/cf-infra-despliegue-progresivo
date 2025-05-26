import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const version = request.cookies.get("version");

    if (!version) {
      const random = Math.random();
      const rolloutPercentage = parseFloat(
        process.env.ROLLOUT_PERCENTAGE || "0.05"
      );

      if (random < rolloutPercentage) {
        const response = NextResponse.redirect(new URL("/new", request.url));
        response.cookies.set("version", "new", {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
        return response;
      } else {
        const response = NextResponse.redirect(new URL("/", request.url)); // redirige aunque sea al mismo lugar
        response.cookies.set("version", "stable", {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
        return response;
      }
    }

    if (version.value === "new") {
      return NextResponse.redirect(new URL("/new", request.url));
    }
  }

  return NextResponse.next();
}
