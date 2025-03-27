import { RateLimiter } from 'limiter';
import { NextRequest, NextResponse } from 'next/server';

const ipLimiters: Map<string, Map<string, { limiter: RateLimiter, lastUsed: number }>> = new Map();

const CLEANUP_INTERVAL = 1000 * 60 * 60;
const LIMITER_TTL = 1000 * 60 * 60 * 24;

// Change values to what's needed, these are what I think are reasonable
const rateLimitConfigs = {
  default: { tokensPerInterval: 60, interval: 'minute' },
  
  auth: { tokensPerInterval: 10, interval: 'minute' },
  
  admin: { tokensPerInterval: 20, interval: 'minute' },
  
  battle: { tokensPerInterval: 30, interval: 'minute' },
  battleStart: { tokensPerInterval: 10, interval: 'minute' },
  battleEnd: { tokensPerInterval: 10, interval: 'minute' },
  battlePause: { tokensPerInterval: 15, interval: 'minute' },
  battleResume: { tokensPerInterval: 15, interval: 'minute' },
  battleStatus: { tokensPerInterval: 30, interval: 'minute' },
  
  query: { tokensPerInterval: 120, interval: 'minute' }
};

export type RateLimitType = 
  | 'default' 
  | 'auth' 
  | 'admin' 
  | 'battle' 
  | 'battleStart'
  | 'battleEnd'
  | 'battlePause'
  | 'battleResume'
  | 'battleStatus'
  | 'query';

if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now();
    
    for (const [ip, userLimiters] of ipLimiters.entries()) {
      for (const [key, entry] of userLimiters.entries()) {
        if (now - entry.lastUsed > LIMITER_TTL) {
          userLimiters.delete(key);
        }
      }
      
      if (userLimiters.size === 0) {
        ipLimiters.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL);
}

/**
 * Rate limit middleware for Next.js API routes
 * @param req Next.js request object
 * @param type Type of rate limit to apply
 * @returns NextResponse with 429 status if rate limit exceeded, or null if not
 */
export async function rateLimit(
  req: NextRequest,
  type: RateLimitType = 'default'
): Promise<NextResponse | null> {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown-ip';
  
  const path = req.nextUrl.pathname;
  const limiterKey = `${ip}:${path}`;
  
  if (!ipLimiters.has(ip)) {
    ipLimiters.set(ip, new Map());
  }
  
  const userLimiters = ipLimiters.get(ip)!;
  
  if (!userLimiters.has(limiterKey)) {
    const config = rateLimitConfigs[type];
    userLimiters.set(
      limiterKey,
      {
        limiter: new RateLimiter({
          tokensPerInterval: config.tokensPerInterval,
          interval: config.interval as 'second' | 'minute' | 'hour' | 'day'
        }),
        lastUsed: Date.now()
      }
    );
  } else {
    userLimiters.get(limiterKey)!.lastUsed = Date.now();
  }
  
  const limiter = userLimiters.get(limiterKey)!.limiter;
  
  const hasToken = await limiter.tryRemoveTokens(1);
  
  if (!hasToken) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429, headers: {
        'Retry-After': '60'
      }}
    );
  }
  
  return null;
} 