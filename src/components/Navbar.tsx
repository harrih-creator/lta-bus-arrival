import React from 'react';

interface NavbarProps {
  onOpenDirectory: () => void;
  onOpenFavorites: () => void;
  onOpenRouteRadar: () => void;
  onOpenBackendModal: () => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDirectory,
  onOpenFavorites,
  onOpenRouteRadar,
  onOpenBackendModal,
  favoritesCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          SG Bus Arrival
        </a>

        {/* Zone 2: 4 clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onOpenDirectory}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Bus Stops
          </button>
          <button
            onClick={onOpenRouteRadar}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Route Radar
          </button>
          <button
            onClick={onOpenFavorites}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Saved Stops {favoritesCount > 0 ? `(${favoritesCount})` : ''}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenBackendModal}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-blue-500/20"
          >
            Backend API
          </button>
        </div>
      </div>
    </header>
  );
};
