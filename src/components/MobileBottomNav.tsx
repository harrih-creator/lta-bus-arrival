import React from 'react';
import { Map, Search, Bus, Star, Server } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'map' | 'directory' | 'radar' | 'favorites' | 'backend';
  onTabChange: (tab: 'map' | 'directory' | 'radar' | 'favorites' | 'backend') => void;
  favoritesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  favoritesCount
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1">
      <div className="grid grid-cols-4 items-center h-14">
        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'map' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Map & Arrivals"
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">Arrivals</span>
        </button>

        <button
          onClick={() => onTabChange('directory')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'directory' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Stops Directory"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">All Stops</span>
        </button>

        <button
          onClick={() => onTabChange('radar')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'radar' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Route Radar"
        >
          <Bus className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">Radar</span>
        </button>

        <button
          onClick={() => onTabChange('favorites')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'favorites' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Saved Stops"
        >
          <Star className={`w-5 h-5 ${activeTab === 'favorites' ? 'fill-amber-400' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">
            Saved {favoritesCount > 0 ? `(${favoritesCount})` : ''}
          </span>
        </button>
      </div>
    </nav>
  );
};
