
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    return NextResponse.next()
}

// export { default } from "next-auth/middleware"