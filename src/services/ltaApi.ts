import { BusServiceArrival, BusStop, LtaApiConfig, NextBusInfo, BusLoad, BusType } from '../types/bus';
import { SINGAPORE_BUS_STOPS } from '../data/singaporeBuses';
import { generateArrivalPredictionsForStop } from '../utils/predictionEngine';

const CONFIG_STORAGE_KEY = 'sg_bus_lta_api_config';

export const DEFAULT_CONFIG: LtaApiConfig = {
  backendUrl: '',
  apiKey: '',
  useBackend: true // Default to true so it automatically queries /api/busarrival
};

export function loadLtaConfig(): LtaApiConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading LTA config:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveLtaConfig(config: LtaApiConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving LTA config:', e);
  }
}

/**
 * Normalizes an LTA DataMall NextBus object to our client NextBusInfo interface.
 */
function normalizeLtaNextBus(raw: any): NextBusInfo | null {
  if (!raw || !raw.EstimatedArrival) return null;

  const estDate = new Date(raw.EstimatedArrival);
  const now = Date.now();
  const diffMinutes = Math.round((estDate.getTime() - now) / 60000);
  const minutesUntilArrival = isNaN(diffMinutes) ? 0 : Math.max(0, diffMinutes);

  const lat = typeof raw.Latitude === 'string' ? parseFloat(raw.Latitude) : Number(raw.Latitude || 0);
  const lng = typeof raw.Longitude === 'string' ? parseFloat(raw.Longitude) : Number(raw.Longitude || 0);

  return {
    OriginCode: raw.OriginCode || '',
    DestinationCode: raw.DestinationCode || '',
    EstimatedArrival: raw.EstimatedArrival,
    Latitude: lat,
    Longitude: lng,
    VisitNumber: String(raw.VisitNumber || '1'),
    Load: (raw.Load || 'SEA') as BusLoad,
    Feature: raw.Feature === 'WAB' ? 'WAB' : '',
    Type: (raw.Type || 'SD') as BusType,
    MinutesUntilArrival: minutesUntilArrival,
    Speed: raw.Speed ? Number(raw.Speed) : undefined,
    PredictionConfidence: minutesUntilArrival <= 2 ? 'high' : 'medium'
  };
}

/**
 * Fetch real-time bus arrivals for a bus stop.
 * Queries the /api/busarrival serverless endpoint first.
 * If no key is set yet or endpoint is unreachable, falls back to the high-precision simulation engine.
 */
export async function getBusArrivals(
  busStopCode: string,
  config: LtaApiConfig = loadLtaConfig()
): Promise<{ arrivals: BusServiceArrival[]; source: 'backend' | 'simulation'; message?: string }> {
  // If backend is enabled, try the serverless endpoint
  if (config.useBackend) {
    try {
      const baseUrl = config.backendUrl.trim().replace(/\/$/, '');
      const endpoint = baseUrl ? `${baseUrl}/api/busarrival` : '/api/busarrival';
      const url = `${endpoint}?BusStopCode=${encodeURIComponent(busStopCode)}`;
      
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };

      if (config.apiKey.trim()) {
        headers['AccountKey'] = config.apiKey.trim();
      }

      const response = await fetch(url, { headers });
      
      if (response.ok) {
        const data = await response.json();
        const rawServices = data.Services || data.services || (Array.isArray(data) ? data : []);

        if (Array.isArray(rawServices) && rawServices.length > 0) {
          const formatted: BusServiceArrival[] = rawServices.map((svc: any) => ({
            ServiceNo: svc.ServiceNo || svc.serviceNo,
            Operator: svc.Operator || svc.operator || 'SBST',
            NextBus: normalizeLtaNextBus(svc.NextBus || svc.nextBus),
            NextBus2: normalizeLtaNextBus(svc.NextBus2 || svc.nextBus2),
            NextBus3: normalizeLtaNextBus(svc.NextBus3 || svc.nextBus3)
          }));

          return { arrivals: formatted, source: 'backend' };
        }
      } else {
        const errJson = await response.json().catch(() => null);
        console.info('[LTA Service] Serverless endpoint response:', response.status, errJson);
      }
    } catch (err) {
      console.warn('[LTA Service] Could not reach serverless endpoint, falling back to local simulation:', err);
    }
  }

  // Fallback: Real-time simulation engine
  const simulated = generateArrivalPredictionsForStop(busStopCode);
  return { arrivals: simulated, source: 'simulation' };
}

/**
 * Test serverless health check endpoint
 */
export async function checkServerlessHealth(backendUrl: string = ''): Promise<{ healthy: boolean; keyConfigured: boolean; data?: any }> {
  try {
    const url = backendUrl ? `${backendUrl.replace(/\/$/, '')}/api/health` : '/api/health';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return { healthy: true, keyConfigured: Boolean(data.ltaKeyConfigured), data };
    }
  } catch (err) {
    console.warn('Health check failed:', err);
  }
  return { healthy: false, keyConfigured: false };
}

/**
 * Search bus stops by code, road name, or description
 */
export function searchBusStops(query: string, stops: BusStop[] = SINGAPORE_BUS_STOPS): BusStop[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return stops;

  return stops.filter(stop => {
    return (
      stop.BusStopCode.toLowerCase().includes(clean) ||
      stop.Description.toLowerCase().includes(clean) ||
      stop.RoadName.toLowerCase().includes(clean) ||
      stop.Services.some(svc => svc.toLowerCase() === clean)
    );
  });
}
