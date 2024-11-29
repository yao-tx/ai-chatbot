import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

const publicPaths = ["/login"];
const authenticatedPaths = ["/"];

export default async function middleware(
  request: NextRequest
) {
  const path: string = request.nextUrl.pathname;
  const session = await auth();

  try {
    if (!session) {
      if (publicPaths.includes(path)) {
        return NextResponse.next();
      }

      if (authenticatedPaths.includes(path)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      return notFound();
    }

    if (path === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api/|images/|clients/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
