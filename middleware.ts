import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit, RateLimitType } from './lib/rate-limit';

export async function middleware(request: NextRequest) {
  // Skip non API routes for ratelimiting, this may want to be changed
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  let rateLimitType: RateLimitType = 'default';
  const path = request.nextUrl.pathname;

  if (path.startsWith('/api/auth')) {
    rateLimitType = 'auth';
  } else if (path.startsWith('/api/admin')) {
    rateLimitType = 'admin';
  } else if (path.startsWith('/api/battle')) {
    rateLimitType = 'battle';
    
    if (path.includes('/battle/start')) {
      rateLimitType = 'battleStart';
    } else if (path.includes('/battle/end')) {
      rateLimitType = 'battleEnd';
    } else if (path.includes('/battle/pause')) {
      rateLimitType = 'battlePause';
    } else if (path.includes('/battle/resume')) {
      rateLimitType = 'battleResume';
    } else if (path.includes('/battle/status')) {
      rateLimitType = 'battleStatus';
    }
  } else if (
    path.startsWith('/api/inventory') ||
    path.startsWith('/api/project') ||
    path.startsWith('/api/boss') ||
    path.startsWith('/api/public')
  ) {
    rateLimitType = 'query';
  }

  const rateLimitResult = await rateLimit(request, rateLimitType);
  
  if (rateLimitResult) {
    return rateLimitResult;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 