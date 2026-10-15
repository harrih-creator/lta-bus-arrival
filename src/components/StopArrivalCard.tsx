import React, { useState } from 'react';
import { BusStop, BusServiceArrival, NextBusInfo, BusLoad, BusType } from '../types/bus';
import { formatArrivalMinutes, getLoadDetails, getBusTypeLabel } from '../utils/predictionEngine';
import { 
  Star, 
  RefreshCw, 
  Search, 
  Navigation, 
  MapPin, 
  Accessibility, 
  Compass,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface StopArrivalCardProps {
  stop: BusStop;
  arrivals: BusServiceArrival[];
  isLoading: boolean;
  onRefresh: () => void;
  secondsUntilAutoRefresh: number;
  isFavorite: boolean;
  onToggleFavorite: (stopCode: string) => void;
  onSelectService: (serviceNo: string) => void;
  userCoords: { lat: number; lng: number } | null;
  distanceKm?: number;
}

export const StopArrivalCard: React.FC<StopArrivalCardProps> = ({
  stop,
  arrivals,
  isLoading,
  onRefresh,
  secondsUntilAutoRefresh,
  isFavorite,
  onToggleFavorite,
  onSelectService,
  distanceKm
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredArrivals = arrivals.filter(arr => 
    !filterQuery.trim() || arr.ServiceNo.toLowerCase().includes(filterQuery.trim().toLowerCase())
  );

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header with Bus Stop Code, Road, and Quick Actions */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {stop.BusStopCode}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {stop.RoadName}
              </span>
              {distanceKm !== undefined && (
                <span className="text-xs text-slate-400 font-mono">
                  · {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
              {stop.Description}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleFavorite(stop.BusStopCode)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite 
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative flex items-center justify-center disabled:opacity-50"
              title="Refresh arrivals"
              aria-label="Refresh arrivals"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
              <span className="sr-only">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Auto-Refresh Progress Indicator */}
        <div className="mt-3.5 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Filter bus service (e.g. 190, 65)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 whitespace-nowrap bg-slate-950/50 px-2.5 py-1.5 rounded-xl border border-slate-800/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Sync in {secondsUntilAutoRefresh}s</span>
          </div>
        </div>
      </div>

      {/* Services Arrival List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 sm:p-3 space-y-1.5">
        {filteredArrivals.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm">No services found matching "{filterQuery}"</p>
            <p className="text-xs text-slate-500 mt-1">This stop serves: {stop.Services.join(', ')}</p>
          </div>
        ) : (
          filteredArrivals.map(arrival => (
            <div
              key={arrival.ServiceNo}
              className="group p-3 rounded-xl bg-slate-950/40 hover:bg-slate-800/50 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
              onClick={() => onSelectService(arrival.ServiceNo)}
            >
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-lg font-black tracking-tight text-white px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 min-w-[54px] text-center shadow-sm">
                    {arrival.ServiceNo}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-300">
                        {arrival.Operator}
                      </span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[160px] sm:max-w-[220px]">
                        To {arrival.NextBus?.DestinationCode || 'Terminal'}
                      </span>
                    </div>
                    {arrival.NextBus?.DistanceMetres !== undefined && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        {(arrival.NextBus.DistanceMetres / 1000).toFixed(1)} km away · ~{arrival.NextBus.Speed} km/h
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-400 text-xs font-medium transition-colors">
                  <span className="hidden sm:inline">Track radar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* 3 Arrival Predictions Slots */}
              <div className="grid grid-cols-3 gap-2">
                <ArrivalSlot label="Next Bus" bus={arrival.NextBus} isPrimary={true} />
                <ArrivalSlot label="2nd Bus" bus={arrival.NextBus2} />
                <ArrivalSlot label="3rd Bus" bus={arrival.NextBus3} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>LTA DataMall v2 format</span>
        </span>
        <span>Tap any service to view live route radar</span>
      </div>
    </div>
  );
};

// Sub-component for individual bus arrival slot
interface ArrivalSlotProps {
  label: string;
  bus: NextBusInfo | null;
  isPrimary?: boolean;
}

const ArrivalSlot: React.FC<ArrivalSlotProps> = ({ label, bus, isPrimary }) => {
  if (!bus) {
    return (
      <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/70 text-center">
        <span className="text-[10px] text-slate-500 block mb-0.5">{label}</span>
        <span className="text-xs text-slate-600 font-mono">—</span>
      </div>
    );
  }

  const { text: timeText, isImminent } = formatArrivalMinutes(bus.MinutesUntilArrival);
  const loadInfo = getLoadDetails(bus.Load);

  return (
    <div
      className={`p-2 rounded-xl border text-center transition-all ${
        isPrimary 
          ? 'bg-slate-900/90 border-slate-700/80 shadow-sm' 
          : 'bg-slate-900/50 border-slate-800/70'
      }`}
    >
      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
        <span>{label}</span>
        <div className="flex items-center gap-1">
          {bus.Type === 'DD' && (
            <span className="px-1 rounded bg-slate-800 text-[9px] font-mono text-slate-300 font-semibold" title="Double Deck">
              DD
            </span>
          )}
          {bus.Feature === 'WAB' && (
            <span title="Wheelchair Accessible">
              <Accessibility className="w-2.5 h-2.5 text-blue-400" />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-center gap-1.5 my-0.5">
        <span
          className={`font-mono font-bold tracking-tight ${
            isImminent ? 'text-emerald-400 text-base sm:text-lg animate-pulse' : 'text-white text-sm sm:text-base'
          }`}
        >
          {timeText}
        </span>
      </div>

      {/* Crowding status indicator */}
      <div className="flex items-center justify-center gap-1 mt-1">
        <span className={`w-1.5 h-1.5 rounded-full ${loadInfo.dotClass}`} />
        <span className={`text-[9px] font-medium truncate ${loadInfo.textClass}`}>
          {loadInfo.label}
        </span>
      </div>
    </div>
  );
};
