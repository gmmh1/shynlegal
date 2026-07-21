import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const [, password] = atob(authHeader.slice(6)).split(":");
    if (password === adminKey) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Shyn Legal Admin"' },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
