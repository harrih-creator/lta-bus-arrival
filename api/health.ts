import type { Request, Response } from 'express';

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptime: number;
  service: string;
  ltaKeyConfigured: boolean;
  endpoints: {
    busArrival: string;
    health: string;
  };
}

/**
 * Health check handler for serverless functions and Express servers.
 * Tests server availability and reports whether LTA DataMall AccountKey is configured in environment.
 */
export default async function handler(req: Request | any, res?: Response | any) {
  const isKeyConfigured = Boolean(
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_DATAMALL_KEY ||
    process.env.ACCOUNT_KEY
  );

  const payload: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    service: 'lta-bus-arrival-api',
    ltaKeyConfigured: isKeyConfigured,
    endpoints: {
      busArrival: '/api/busarrival?BusStopCode=:code',
      health: '/api/health'
    }
  };

  // Express / Node.js standard response
  if (res && typeof res.status === 'function') {
    return res.status(200).json(payload);
  }

  // Web Standards / Edge Runtime response
  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

// Named export for Web Fetch / Next.js / Edge Serverless
export async function GET(request?: any) {
  return handler(request);
}
