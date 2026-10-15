import React from 'react';
import { BusStop, LiveVehicle, NextBusInfo } from '../types/bus';
import { SINGAPORE_BUS_ROUTES, SINGAPORE_BUS_STOPS } from '../data/singaporeBuses';
import { getLoadDetails, getBusTypeLabel, formatArrivalMinutes } from '../utils/predictionEngine';
import { X, Bus, MapPin, Gauge, Users, ChevronRight, Navigation } from 'lucide-react';

interface RouteRadarModalProps {
  serviceNo: string | null;
  onClose: () => void;
  selectedStopCode: string;
  onSelectStopCode: (code: string) => void;
  vehicles: LiveVehicle[];
}

export const RouteRadarModal: React.FC<RouteRadarModalProps> = ({
  serviceNo,
  onClose,
  selectedStopCode,
  onSelectStopCode,
  vehicles
}) => {
  if (!serviceNo) return null;

  const routeDef = SINGAPORE_BUS_ROUTES.find(r => r.serviceNo === serviceNo);
  const routeStops = (routeDef?.stopCodes || [])
    .map(code => SINGAPORE_BUS_STOPS.find(s => s.BusStopCode === code))
    .filter((s): s is BusStop => !!s);

  // Active vehicles on this route
  const activeBuses = vehicles.filter(v => v.serviceNo === serviceNo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-black text-white px-3 py-1 rounded-xl bg-blue-600 shadow-md shadow-blue-500/20">
              {serviceNo}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  {routeDef?.operator || 'LTA Operator'}
                </span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="text-xs text-blue-400 font-mono">
                  {activeBuses.length} buses en route
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span>{routeDef?.origin || 'Origin'}</span>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{routeDef?.destination || 'Destination'}</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close route radar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Active Buses Telemetry Summary */}
        <div className="p-3 sm:p-4 bg-slate-950/40 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {activeBuses.map((bus, idx) => {
            const loadInfo = getLoadDetails(bus.load);
            return (
              <div
                key={bus.id}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Bus className="w-4 h-4 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-200">Bus #{idx + 1}</span>
                    <span className="text-[10px] font-mono text-slate-400">{bus.speed} km/h</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${loadInfo.dotClass}`} />
                    <span className={`text-[10px] truncate ${loadInfo.textClass}`}>
                      {loadInfo.label}
                    </span>
                    <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-300 font-mono">
                      {bus.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vertical Route Progression Line & Sequential Stops */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-0">
          <div className="text-xs font-semibold text-slate-400 mb-4 px-1">
            Route Progression & Stop Sequence ({routeStops.length} stops in sequence)
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-blue-400 before:to-slate-700">
            {routeStops.map((stop, index) => {
              const isSelected = stop.BusStopCode === selectedStopCode;
              
              // Check if any active bus is approaching this stop
              const approachingBus = activeBuses.find(b => b.nextStopCode === stop.BusStopCode);

              return (
                <div
                  key={stop.BusStopCode}
                  onClick={() => onSelectStopCode(stop.BusStopCode)}
                  className={`relative group cursor-pointer p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  {/* Sequence Node Dot on timeline */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-5 -translate-x-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-transform ${
                      isSelected
                        ? 'bg-blue-500 border-white ring-4 ring-blue-500/30 scale-125'
                        : 'bg-slate-900 border-slate-600 group-hover:border-blue-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>

                  {/* Approaching bus alert chip */}
                  {approachingBus && (
                    <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-semibold animate-pulse">
                      <Bus className="w-3 h-3" />
                      <span>Bus approaching ({approachingBus.speed} km/h)</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-bold text-slate-300">
                          {stop.BusStopCode}
                        </span>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-xs text-slate-400">{stop.RoadName}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {stop.Description}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-500 font-mono block">Stop #{index + 1}</span>
                      {isSelected && (
                        <span className="text-[10px] font-medium text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                          Current Stop
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Click any stop in the sequence to switch view</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close Radar
          </button>
        </div>
      </div>
    </div>
  );
};
