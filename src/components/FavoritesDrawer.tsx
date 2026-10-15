import React from 'react';
import { BusStop, BusServiceArrival } from '../types/bus';
import { SINGAPORE_BUS_STOPS } from '../data/singaporeBuses';
import { generateArrivalPredictionsForStop, formatArrivalMinutes, getLoadDetails } from '../utils/predictionEngine';
import { X, Star, Trash2, ArrowRight, Bus } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteCodes: string[];
  onRemoveFavorite: (code: string) => void;
  onSelectStop: (stop: BusStop) => void;
  selectedStopCode: string;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoriteCodes,
  onRemoveFavorite,
  onSelectStop,
  selectedStopCode
}) => {
  if (!isOpen) return null;

  const favoriteStops = favoriteCodes
    .map(code => SINGAPORE_BUS_STOPS.find(s => s.BusStopCode === code))
    .filter((s): s is BusStop => !!s);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Saved Bus Stops</h3>
              <p className="text-xs text-slate-400">{favoriteCodes.length} bookmarked stops</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Favorites with Quick Arrivals */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favoriteStops.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <Star className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium">No saved stops yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Tap the star icon on any bus stop to bookmark your frequent daily commute stops!
              </p>
            </div>
          ) : (
            favoriteStops.map(stop => {
              const arrivals = generateArrivalPredictionsForStop(stop.BusStopCode);
              const isSelected = stop.BusStopCode === selectedStopCode;

              return (
                <div
                  key={stop.BusStopCode}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-blue-500/10 border-blue-500/40'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      className="cursor-pointer min-w-0"
                      onClick={() => {
                        onSelectStop(stop);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-bold text-blue-400 px-1.5 py-0.2 rounded bg-blue-500/10 border border-blue-500/20">
                          {stop.BusStopCode}
                        </span>
                        <span className="text-xs text-slate-400 truncate">{stop.RoadName}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white hover:text-blue-400 transition-colors truncate">
                        {stop.Description}
                      </h4>
                    </div>

                    <button
                      onClick={() => onRemoveFavorite(stop.BusStopCode)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick arrivals preview for top 4 services */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
                    {arrivals.slice(0, 4).map(arr => {
                      const next = arr.NextBus;
                      const time = next ? formatArrivalMinutes(next.MinutesUntilArrival) : null;
                      const load = next ? getLoadDetails(next.Load) : null;

                      return (
                        <div
                          key={arr.ServiceNo}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono"
                        >
                          <span className="font-bold text-slate-200">{arr.ServiceNo}</span>
                          {time ? (
                            <span className={`font-semibold ${time.isImminent ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {time.text}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      onSelectStop(stop);
                      onClose();
                    }}
                    className="w-full mt-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center justify-center gap-1 font-medium transition-colors"
                  >
                    <span>View full arrival board</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
