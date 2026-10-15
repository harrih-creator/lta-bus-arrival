import type { Request, Response } from 'express';

const LTA_BUS_ARRIVAL_V3_URL = 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival';

/**
 * Serverless handler for Singapore LTA DataMall v3 Bus Arrival API.
 * 
 * Target Endpoint:
 * GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
 * Headers:
 * AccountKey: <Your_LTA_AccountKey>
 * accept: application/json
 * 
 * Key configuration:
 * Set LTA_ACCOUNT_KEY in your environment variables, or pass AccountKey via request headers.
 */
export default async function handler(req: Request | any, res?: Response | any) {
  // CORS Preflight handling
  if (req.method === 'OPTIONS') {
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey, x-account-key, Authorization');
      return res.status(204).end();
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, AccountKey, x-account-key, Authorization'
      }
    });
  }

  // Set standard CORS headers for responses
  if (res && typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey, x-account-key, Authorization');
  }

  // Parse query parameters from Express or Web Request URL
  let busStopCode = '';
  let serviceNo = '';
  let requestHeaders: Record<string, string> = {};

  if (req.query) {
    // Express req.query
    busStopCode = (req.query.BusStopCode || req.query.busStopCode || req.query.busstopcode || '') as string;
    serviceNo = (req.query.ServiceNo || req.query.serviceNo || req.query.serviceno || '') as string;
    requestHeaders = (req.headers || {}) as Record<string, string>;
  } else if (req.url) {
    // Web Standards Request
    try {
      const url = new URL(req.url, 'http://localhost');
      busStopCode = url.searchParams.get('BusStopCode') || url.searchParams.get('busStopCode') || '';
      serviceNo = url.searchParams.get('ServiceNo') || url.searchParams.get('serviceNo') || '';
      if (req.headers && typeof req.headers.get === 'function') {
        req.headers.forEach((value: string, key: string) => {
          requestHeaders[key.toLowerCase()] = value;
        });
      }
    } catch {
      // Fallback
    }
  }

  // Validate required BusStopCode
  if (!busStopCode || !busStopCode.trim()) {
    const errorPayload = {
      error: 'Missing required parameter: BusStopCode',
      message: 'Please provide a valid 5-digit Singapore bus stop code (e.g. /api/busarrival?BusStopCode=83139 or 08057).',
      example: '/api/busarrival?BusStopCode=83139'
    };

    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorPayload);
    }
    return new Response(JSON.stringify(errorPayload), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  // Retrieve LTA AccountKey from environment or request headers (never hardcoded)
  const accountKey = (
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_DATAMALL_KEY ||
    process.env.ACCOUNT_KEY ||
    requestHeaders['accountkey'] ||
    requestHeaders['x-account-key'] ||
    requestHeaders['authorization']?.replace(/^Bearer\s+/i, '') ||
    (req.query?.AccountKey as string) ||
    ''
  ).trim();

  // If AccountKey is not set yet, return an informative response explaining how to configure it
  if (!accountKey) {
    const missingKeyPayload = {
      error: 'LTA DataMall AccountKey is not configured',
      message: 'The serverless backend requires an LTA DataMall AccountKey. Please configure the LTA_ACCOUNT_KEY environment variable in your server environment, or pass it via the AccountKey header.',
      busStopCode: busStopCode.trim(),
      howToConfigure: [
        '1. Request a free API key at https://datamall.lta.gov.sg/content/datamall/en/request-api.html',
        '2. Set the environment variable LTA_ACCOUNT_KEY=<Your_Key>',
        '3. Alternatively, pass the key via request header: "AccountKey: <Your_Key>"'
      ]
    };

    if (res && typeof res.status === 'function') {
      return res.status(401).json(missingKeyPayload);
    }
    return new Response(JSON.stringify(missingKeyPayload), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    // Construct LTA DataMall v3 URL
    const queryParams = new URLSearchParams({
      BusStopCode: busStopCode.trim()
    });

    if (serviceNo && serviceNo.trim()) {
      queryParams.set('ServiceNo', serviceNo.trim());
    }

    const targetUrl = `${LTA_BUS_ARRIVAL_V3_URL}?${queryParams.toString()}`;

    // Call official LTA DataMall v3 API
    const ltaResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'AccountKey': accountKey,
        'accept': 'application/json'
      }
    });

    const ltaData = await ltaResponse.json().catch(() => null);

    if (!ltaResponse.ok) {
      const errorMsg = {
        error: 'LTA DataMall API error',
        statusCode: ltaResponse.status,
        statusText: ltaResponse.statusText,
        details: ltaData || 'Unable to parse LTA response'
      };

      if (res && typeof res.status === 'function') {
        return res.status(ltaResponse.status).json(errorMsg);
      }
      return new Response(JSON.stringify(errorMsg), {
        status: ltaResponse.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Forward the authentic LTA DataMall payload to client
    if (res && typeof res.json === 'function') {
      return res.status(200).json(ltaData);
    }

    return new Response(JSON.stringify(ltaData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=15'
      }
    });
  } catch (error: any) {
    const failurePayload = {
      error: 'Failed to fetch from LTA DataMall',
      message: error.message || 'Unknown network error',
      busStopCode
    };

    if (res && typeof res.status === 'function') {
      return res.status(502).json(failurePayload);
    }

    return new Response(JSON.stringify(failurePayload), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// Named export for Web Fetch / Edge Serverless / Next.js
export async function GET(request: any) {
  return handler(request);
}

export async function OPTIONS(request: any) {
  return handler(request);
}
