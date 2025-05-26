import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo afecta al home
  if (pathname === "/") {
    const version = request.cookies.get("version");

    // Si no hay cookie, asignamos una versión
    if (!version) {
      const random = Math.random();
      const response = NextResponse.next();

      // Cambiá este valor para aumentar el rollout (ej: 0.05 = 5%)
      const rolloutPercentage = 0.1;

      if (random < rolloutPercentage) {
        response.cookies.set("version", "new", {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
        return NextResponse.redirect(new URL("/new", request.url));
      } else {
        response.cookies.set("version", "stable", {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
        return response;
      }
    }

    // Si ya hay cookie, respetamos la asignación
    if (version.value === "new") {
      return NextResponse.redirect(new URL("/new", request.url));
    }
  }

  return NextResponse.next();
}
