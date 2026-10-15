import React, { useState } from 'react';
import { BusStop } from '../types/bus';
import { searchBusStops } from '../services/ltaApi';
import { X, Search, MapPin, Bus, ChevronRight } from 'lucide-react';

interface StopDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  selectedStopCode: string;
}

export const StopDirectoryModal: React.FC<StopDirectoryModalProps> = ({
  isOpen,
  onClose,
  stops,
  onSelectStop,
  selectedStopCode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  if (!isOpen) return null;

  const filteredStops = searchBusStops(searchQuery, stops).filter(stop => {
    if (selectedRegion === 'All') return true;
    return stop.Region === selectedRegion;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-white">Singapore LTA Bus Stop Directory</h3>
            <p className="text-xs text-slate-400">Search by 5-digit code, road name, or landmark</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Region Filter */}
        <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-950/30">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search e.g. 09048, Orchard, Bugis, Jurong, or Bus 190..."
              className="w-full pl-10 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Central', 'East', 'West', 'North', 'North-East'].map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedRegion === reg
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {reg}
              </button>
            ))}
            <span className="text-xs text-slate-500 ml-auto font-mono whitespace-nowrap">
              {filteredStops.length} stops found
            </span>
          </div>
        </div>

        {/* List of stops */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 sm:p-3">
          {filteredStops.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm">No bus stops found matching your search</p>
              <p className="text-xs text-slate-500 mt-1">Try entering a 5-digit stop code like "08057"</p>
            </div>
          ) : (
            filteredStops.map(stop => {
              const isSelected = stop.BusStopCode === selectedStopCode;
              return (
                <div
                  key={stop.BusStopCode}
                  onClick={() => {
                    onSelectStop(stop);
                    onClose();
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-500/15 border border-blue-500/30'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                        {stop.BusStopCode}
                      </span>
                      <span className="text-xs text-slate-400">{stop.RoadName}</span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="text-[11px] text-slate-500">{stop.Region}</span>
                    </div>
                    <div className="text-sm font-bold text-white truncate">
                      {stop.Description}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-500 font-medium">Buses:</span>
                      {stop.Services.slice(0, 8).map(svc => (
                        <span
                          key={svc}
                          className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300"
                        >
                          {svc}
                        </span>
                      ))}
                      {stop.Services.length > 8 && (
                        <span className="text-[10px] text-slate-500">
                          +{stop.Services.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
