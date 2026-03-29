import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured, skip auth middleware entirely
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set(name, value);
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set(name, value, options as Record<string, string>);
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set(name, "");
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set(name, "", options as Record<string, string>);
        },
      },
    });

    // Refresh the session so it doesn't expire
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect /account — redirect to sign-in if not authenticated
    if (request.nextUrl.pathname.startsWith("/account") && !user) {
      const signinUrl = request.nextUrl.clone();
      signinUrl.pathname = "/auth/signin";
      signinUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(signinUrl);
    }
  } catch (err) {
    console.error("[middleware] Supabase auth error:", err);
    // Don't block the request — let it through without auth
  }

  return response;
}

export const config = {
  matcher: [
    "/account/:path*",
    "/coach/:path*",
    "/auth/:path*",
  ],
};
