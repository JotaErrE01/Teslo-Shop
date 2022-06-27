import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // console.log(token);

  if(!token) {
    const origin = req.nextUrl.origin;
    const requestedPage = req.nextUrl.pathname;
    const absouletePath = `${origin}/auth/login?p=${requestedPage}`;
    return NextResponse.redirect(absouletePath);
  }

  return NextResponse.next();
}
