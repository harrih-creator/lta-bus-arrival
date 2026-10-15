import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BusStop, BusServiceArrival, LiveVehicle, LtaApiConfig } from './types/bus';
import { SINGAPORE_BUS_STOPS, SINGAPORE_HUBS, SingaporeHub, SINGAPORE_BUS_ROUTES } from './data/singaporeBuses';
import { getBusArrivals, loadLtaConfig, saveLtaConfig } from './services/ltaApi';
import { generateLiveVehicles, getDistanceFromLatLonInKm } from './utils/predictionEngine';
import { Navbar } from './components/Navbar';
import { LiveTransitMap } from './components/LiveTransitMap';
import { StopArrivalCard } from './components/StopArrivalCard';
import { NearbyHubSelector } from './components/NearbyHubSelector';
import { StopDirectoryModal } from './components/StopDirectoryModal';
import { RouteRadarModal } from './components/RouteRadarModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { BackendConnectorModal } from './components/BackendConnectorModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Bus, Clock, ShieldCheck, MapPin, Radio, Compass, ArrowUpRight } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'sg_bus_favorites';
const DEFAULT_AUTO_REFRESH_INTERVAL = 15; // 15 seconds

export default function App() {
  // App state
  const [stops] = useState<BusStop[]>(SINGAPORE_BUS_STOPS);
  const [selectedStop, setSelectedStop] = useState<BusStop>(() => {
    // Default to Dhoby Ghaut / Orchard Stn
    return SINGAPORE_BUS_STOPS.find(s => s.BusStopCode === '08057') || SINGAPORE_BUS_STOPS[0];
  });
  const [arrivals, setArrivals] = useState<BusServiceArrival[]>([]);
  const [isLoadingArrivals, setIsLoadingArrivals] = useState(false);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(DEFAULT_AUTO_REFRESH_INTERVAL);
  const [vehicles, setVehicles] = useState<LiveVehicle[]>(() => generateLiveVehicles());
  const [activeServiceNo, setActiveServiceNo] = useState<string | null>(null);
  const [activeHubName, setActiveHubName] = useState<string>('Orchard Rd / Dhoby Ghaut');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Configuration & Modals
  const [ltaConfig, setLtaConfig] = useState<LtaApiConfig>(() => loadLtaConfig());
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['08057', '09048', '03539'];
    } catch {
      return ['08057', '09048'];
    }
  });

  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'map' | 'directory' | 'radar' | 'favorites' | 'backend'>('map');

  // Filter stops by selected region
  const filteredStops = useMemo(() => {
    if (selectedRegion === 'All') return stops;
    return stops.filter(s => s.Region === selectedRegion);
  }, [stops, selectedRegion]);

  // Load arrivals for currently selected stop
  const refreshArrivals = useCallback(async () => {
    if (!selectedStop) return;
    setIsLoadingArrivals(true);
    try {
      const { arrivals: data } = await getBusArrivals(selectedStop.BusStopCode, ltaConfig);
      setArrivals(data);
    } catch (err) {
      console.error('Failed to load arrivals:', err);
    } finally {
      setIsLoadingArrivals(false);
      setSecondsUntilRefresh(DEFAULT_AUTO_REFRESH_INTERVAL);
    }
  }, [selectedStop, ltaConfig]);

  // Initial load & when stop changes
  useEffect(() => {
    refreshArrivals();
  }, [refreshArrivals]);

  // Countdown timer & live vehicle movement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsUntilRefresh(prev => {
        if (prev <= 1) {
          refreshArrivals();
          return DEFAULT_AUTO_REFRESH_INTERVAL;
        }
        return prev - 1;
      });

      // Periodically update live vehicle positions along roads
      setVehicles(generateLiveVehicles(Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshArrivals]);

  // Toggle favorite
  const handleToggleFavorite = (stopCode: string) => {
    setFavorites(prev => {
      const next = prev.includes(stopCode)
        ? prev.filter(c => c !== stopCode)
        : [...prev, stopCode];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Select a Singapore transit hub
  const handleSelectHub = (hub: SingaporeHub) => {
    setActiveHubName(hub.name);
    const stop = stops.find(s => s.BusStopCode === hub.defaultStopCode);
    if (stop) {
      setSelectedStop(stop);
    }
  };

  // Request browser geolocation
  const handleRequestGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setIsLocating(false);

        // Find nearest stop
        let nearestStop = stops[0];
        let minDistance = Infinity;
        stops.forEach(s => {
          const dist = getDistanceFromLatLonInKm(coords.lat, coords.lng, s.Latitude, s.Longitude);
          if (dist < minDistance) {
            minDistance = dist;
            nearestStop = s;
          }
        });

        if (nearestStop) {
          setSelectedStop(nearestStop);
          setActiveHubName(`Nearby (${minDistance.toFixed(1)}km)`);
        }
      },
      err => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        // Fall back gracefully to Central Orchard hub
        handleSelectHub(SINGAPORE_HUBS[0]);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Service selection (opens Route Radar and filters vehicle pins)
  const handleSelectService = (serviceNo: string) => {
    if (!serviceNo) {
      setActiveServiceNo(null);
      return;
    }
    setActiveServiceNo(serviceNo);
    setIsRadarOpen(true);
  };

  // Calculate distance from user to selected stop if user coordinates exist
  const distanceKm = userCoords
    ? getDistanceFromLatLonInKm(userCoords.lat, userCoords.lng, selectedStop.Latitude, selectedStop.Longitude)
    : undefined;

  // Handle Mobile Bottom Nav switching
  const handleMobileTabChange = (tab: 'map' | 'directory' | 'radar' | 'favorites' | 'backend') => {
    setMobileTab(tab);
    if (tab === 'directory') setIsDirectoryOpen(true);
    if (tab === 'radar') {
      if (!activeServiceNo && selectedStop.Services.length > 0) {
        setActiveServiceNo(selectedStop.Services[0]);
      }
      setIsRadarOpen(true);
    }
    if (tab === 'favorites') setIsFavoritesOpen(true);
    if (tab === 'backend') setIsBackendModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0c111d] text-slate-100 flex flex-col pb-16 md:pb-6">
      {/* Top Navigation Bar with Top Bar Contract */}
      <Navbar
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenRouteRadar={() => {
          if (!activeServiceNo && selectedStop.Services.length > 0) {
            setActiveServiceNo(selectedStop.Services[0]);
          }
          setIsRadarOpen(true);
        }}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Workspace */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex-1 flex flex-col space-y-4">
        {/* Regional Hub Selector Bar */}
        <section aria-label="Transit Hubs & Region Filter">
          <NearbyHubSelector
            onSelectHub={handleSelectHub}
            activeHubName={activeHubName}
            onRequestGeolocation={handleRequestGeolocation}
            isLocating={isLocating}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />
        </section>

        {/* 2-Column Split Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">
          {/* Left Column: Live Interactive Map & Fleet Telemetry (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-[420px] lg:min-h-[580px] space-y-3">
            <div className="flex-1 min-h-[380px] relative">
              <LiveTransitMap
                stops={filteredStops}
                selectedStop={selectedStop}
                onSelectStop={stop => {
                  setSelectedStop(stop);
                  setActiveHubName(stop.Description);
                }}
                vehicles={vehicles}
                activeServiceNo={activeServiceNo}
                onSelectService={handleSelectService}
                userCoords={userCoords}
              />
            </div>

            {/* Quick Live Bus Corridors Strip */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-200">Active Bus Radar:</span>
                <span className="text-slate-400 hidden sm:inline">
                  Click any service to view vehicle telemetry
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[260px] sm:max-w-none">
                {SINGAPORE_BUS_ROUTES.slice(0, 6).map(r => (
                  <button
                    key={r.serviceNo}
                    onClick={() => handleSelectService(r.serviceNo)}
                    className={`font-mono px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      activeServiceNo === r.serviceNo
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {r.serviceNo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Stop Arrival Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col min-h-[500px]">
            <StopArrivalCard
              stop={selectedStop}
              arrivals={arrivals}
              isLoading={isLoadingArrivals}
              onRefresh={refreshArrivals}
              secondsUntilAutoRefresh={secondsUntilRefresh}
              isFavorite={favorites.includes(selectedStop.BusStopCode)}
              onToggleFavorite={handleToggleFavorite}
              onSelectService={handleSelectService}
              userCoords={userCoords}
              distanceKm={distanceKm}
            />
          </div>
        </div>

        {/* Informational Proof Strip */}
        <section className="pt-2 pb-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Accurate LTA Crowd Load Predictions (Seats / Standing / Limited)</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-blue-400" />
              <span>Real Double Deck & Wheelchair Access Detection</span>
            </span>
          </div>

          <button
            onClick={() => setIsBackendModalOpen(true)}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            <span>Connect Custom Backend Endpoint</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </section>
      </main>

      {/* Modals and Drawers */}
      <StopDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        stops={stops}
        onSelectStop={stop => {
          setSelectedStop(stop);
          setActiveHubName(stop.Description);
        }}
        selectedStopCode={selectedStop.BusStopCode}
      />

      <RouteRadarModal
        serviceNo={activeServiceNo}
        onClose={() => {
          setIsRadarOpen(false);
          setActiveServiceNo(null);
        }}
        selectedStopCode={selectedStop.BusStopCode}
        onSelectStopCode={code => {
          const s = stops.find(stop => stop.BusStopCode === code);
          if (s) {
            setSelectedStop(s);
            setActiveHubName(s.Description);
          }
        }}
        vehicles={vehicles}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteCodes={favorites}
        onRemoveFavorite={handleToggleFavorite}
        onSelectStop={stop => {
          setSelectedStop(stop);
          setActiveHubName(stop.Description);
        }}
        selectedStopCode={selectedStop.BusStopCode}
      />

      <BackendConnectorModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        config={ltaConfig}
        onSaveConfig={cfg => {
          setLtaConfig(cfg);
          refreshArrivals();
        }}
      />

      {/* Mobile Bottom Tab Navigation */}
      <MobileBottomNav
        activeTab={mobileTab}
        onTabChange={handleMobileTabChange}
        favoritesCount={favorites.length}
      />
    </div>
  );
}
