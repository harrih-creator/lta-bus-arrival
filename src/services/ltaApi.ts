import { BusServiceArrival, BusStop, LtaApiConfig } from '../types/bus';
import { SINGAPORE_BUS_STOPS } from '../data/singaporeBuses';
import { generateArrivalPredictionsForStop } from '../utils/predictionEngine';

const CONFIG_STORAGE_KEY = 'sg_bus_lta_api_config';

export const DEFAULT_CONFIG: LtaApiConfig = {
  backendUrl: '',
  apiKey: '',
  useBackend: false
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
 * Fetch real-time bus arrivals for a bus stop.
 * Ready for backend connection:
 * - When user backend is enabled, queries the backend endpoint (e.g., /api/bus-arrivals?BusStopCode=08057)
 * - Otherwise falls back to high-fidelity LTA DataMall prediction simulation engine
 */
export async function getBusArrivals(
  busStopCode: string,
  config: LtaApiConfig = loadLtaConfig()
): Promise<{ arrivals: BusServiceArrival[]; source: 'backend' | 'simulation' }> {
  if (config.useBackend && config.backendUrl) {
    try {
      const url = `${config.backendUrl.replace(/\/$/, '')}/api/bus-arrivals?BusStopCode=${busStopCode}`;
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };
      if (config.apiKey) {
        headers['AccountKey'] = config.apiKey;
      }

      const response = await fetch(url, { headers });
      if (response.ok) {
        const data = await response.json();
        // Support both direct LTA format data.Services and normalized BusServiceArrival[]
        const rawServices = data.Services || data.services || (Array.isArray(data) ? data : []);
        const formatted: BusServiceArrival[] = rawServices.map((svc: any) => ({
          ServiceNo: svc.ServiceNo || svc.serviceNo,
          Operator: svc.Operator || svc.operator || 'SBST',
          NextBus: svc.NextBus || svc.nextBus || null,
          NextBus2: svc.NextBus2 || svc.nextBus2 || null,
          NextBus3: svc.NextBus3 || svc.nextBus3 || null
        }));
        return { arrivals: formatted, source: 'backend' };
      }
    } catch (err) {
      console.warn('Backend connection failed, falling back to real-time simulation:', err);
    }
  }

  // Frontend simulation mode
  const simulated = generateArrivalPredictionsForStop(busStopCode);
  return { arrivals: simulated, source: 'simulation' };
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
