export type BusLoad = 'SEA' | 'SDA' | 'LSD'; // Seats Available | Standing Available | Limited Standing
export type BusType = 'SD' | 'DD' | 'BD'; // Single Deck | Double Deck | Bendy
export type BusOperator = 'SBST' | 'SMRT' | 'TTS' | 'GAS';

export interface NextBusInfo {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string; // ISO 8601 string or timestamp
  Latitude: number;
  Longitude: number;
  VisitNumber: string;
  Load: BusLoad;
  Feature: 'WAB' | '';
  Type: BusType;
  Speed?: number; // km/h
  DistanceMetres?: number;
  MinutesUntilArrival: number; // 0 = Arr, negative = Left, positive = minutes
  PredictionConfidence?: 'high' | 'medium' | 'estimated';
}

export interface BusServiceArrival {
  ServiceNo: string;
  Operator: BusOperator;
  NextBus: NextBusInfo | null;
  NextBus2: NextBusInfo | null;
  NextBus3: NextBusInfo | null;
}

export interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  Region: 'Central' | 'East' | 'West' | 'North' | 'North-East';
  Services: string[];
}

export interface BusRouteStop {
  ServiceNo: string;
  Direction: 1 | 2;
  StopSequence: number;
  BusStopCode: string;
  DistanceKm: number;
  EstimatedDurationMin: number;
}

export interface LiveVehicle {
  id: string;
  serviceNo: string;
  operator: BusOperator;
  lat: number;
  lng: number;
  bearing: number;
  speed: number;
  load: BusLoad;
  type: BusType;
  nextStopCode: string;
  destination: string;
  direction: 1 | 2;
}

export interface FavoriteItem {
  stopCode: string;
  pinnedServices?: string[];
  addedAt: number;
}

export interface LtaApiConfig {
  backendUrl: string;
  apiKey: string;
  useBackend: boolean;
}
