import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Admin panel protection (HTTP Basic Auth) ──────────────────────────────
  if (pathname.startsWith("/admin")) {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !isValidBasicAuth(authHeader)) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Solutto Admin"' },
      })
    }
  }

  return NextResponse.next()
}

function isValidBasicAuth(header: string): boolean {
  const [scheme, encoded] = header.split(" ")
  if (scheme !== "Basic" || !encoded) return false

  const decoded = Buffer.from(encoded, "base64").toString("utf-8")
  const colonIndex = decoded.indexOf(":")
  if (colonIndex === -1) return false

  const user = decoded.slice(0, colonIndex)
  const pass = decoded.slice(colonIndex + 1)

  // Timing-safe comparison to prevent timing attacks
  const validUser = process.env.ADMIN_USERNAME ?? ""
  const validPass = process.env.ADMIN_PASSWORD ?? ""

  const userMatch = user.length === validUser.length &&
    user.split("").every((c, i) => c === validUser[i])
  const passMatch = pass.length === validPass.length &&
    pass.split("").every((c, i) => c === validPass[i])

  return userMatch && passMatch
}

export const config = {
  matcher: ["/admin/:path*", "/(provider)/:path*"],
}
