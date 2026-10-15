import React from 'react';
import { SINGAPORE_HUBS, SingaporeHub } from '../data/singaporeBuses';
import { Navigation, LocateFixed } from 'lucide-react';

interface NearbyHubSelectorProps {
  onSelectHub: (hub: SingaporeHub) => void;
  activeHubName: string;
  onRequestGeolocation: () => void;
  isLocating: boolean;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const NearbyHubSelector: React.FC<NearbyHubSelectorProps> = ({
  onSelectHub,
  activeHubName,
  onRequestGeolocation,
  isLocating,
  selectedRegion,
  onSelectRegion
}) => {
  const regions = ['All', 'Central', 'East', 'West', 'North', 'North-East'];

  return (
    <div className="space-y-3">
      {/* Region Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {regions.map(region => (
          <button
            key={region}
            onClick={() => onSelectRegion(region)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedRegion === region
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {region}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-800 mx-1 shrink-0" />

        {/* GPS trigger */}
        <button
          onClick={onRequestGeolocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 shrink-0"
        >
          <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
        </button>
      </div>

      {/* Hub Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
        {SINGAPORE_HUBS.map(hub => {
          const isActive = activeHubName === hub.name;
          return (
            <button
              key={hub.name}
              onClick={() => onSelectHub(hub)}
              className={`p-2.5 rounded-xl border text-left whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-slate-800 border-blue-500/50 ring-1 ring-blue-500/30 shadow-md'
                  : 'bg-slate-900/60 border-slate-800/90 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="text-xs font-bold text-white tracking-tight">{hub.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{hub.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
