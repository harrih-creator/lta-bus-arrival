import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BusStop, LiveVehicle } from '../types/bus';
import { SINGAPORE_BUS_ROUTES } from '../data/singaporeBuses';
import { getLoadDetails, getBusTypeLabel } from '../utils/predictionEngine';

interface LiveTransitMapProps {
  stops: BusStop[];
  selectedStop: BusStop | null;
  onSelectStop: (stop: BusStop) => void;
  vehicles: LiveVehicle[];
  activeServiceNo: string | null;
  onSelectService?: (serviceNo: string) => void;
  userCoords: { lat: number; lng: number } | null;
}

export const LiveTransitMap: React.FC<LiveTransitMapProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  vehicles,
  activeServiceNo,
  onSelectService,
  userCoords
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const stopMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const vehicleMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center of Singapore (around Orchard / City Hall)
    const initialLat = selectedStop ? selectedStop.Latitude : 1.3000;
    const initialLng = selectedStop ? selectedStop.Longitude : 103.8500;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Dark transit CartoDB tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update stops markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous stop markers that aren't in current list
    const currentStopCodes = new Set(stops.map(s => s.BusStopCode));
    stopMarkersRef.current.forEach((marker, code) => {
      if (!currentStopCodes.has(code)) {
        marker.remove();
        stopMarkersRef.current.delete(code);
      }
    });

    stops.forEach(stop => {
      const isSelected = selectedStop?.BusStopCode === stop.BusStopCode;
      let marker = stopMarkersRef.current.get(stop.BusStopCode);

      // Create custom HTML icon for stop
      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          ${isSelected ? '<span class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></span>' : ''}
          <div class="w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
            isSelected 
              ? 'bg-emerald-500 text-white ring-2 ring-white shadow-emerald-500/50' 
              : 'bg-slate-900 text-white ring-1 ring-slate-700/60'
          }">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
            </svg>
          </div>
          <span class="absolute -bottom-5 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-tight whitespace-nowrap shadow-sm pointer-events-none ${
            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-900/90 text-slate-200 border border-slate-700/80'
          }">
            ${stop.BusStopCode}
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'bus-stop-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      if (!marker) {
        marker = L.marker([stop.Latitude, stop.Longitude], { icon: customIcon });
        marker.on('click', () => {
          onSelectStop(stop);
        });
        marker.addTo(map);
        stopMarkersRef.current.set(stop.BusStopCode, marker);
      } else {
        marker.setLatLng([stop.Latitude, stop.Longitude]);
        marker.setIcon(customIcon);
      }
    });
  }, [stops, selectedStop, onSelectStop]);

  // Pan to selected stop smoothly
  useEffect(() => {
    if (selectedStop && mapRef.current) {
      mapRef.current.flyTo([selectedStop.Latitude, selectedStop.Longitude], 16, {
        duration: 0.8
      });
    }
  }, [selectedStop?.BusStopCode]);

  // Render and update live moving bus vehicles
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Filter vehicles if a specific service is highlighted
    const displayVehicles = activeServiceNo
      ? vehicles.filter(v => v.serviceNo === activeServiceNo)
      : vehicles;

    const currentVehicleIds = new Set(displayVehicles.map(v => v.id));
    vehicleMarkersRef.current.forEach((marker, id) => {
      if (!currentVehicleIds.has(id)) {
        marker.remove();
        vehicleMarkersRef.current.delete(id);
      }
    });

    displayVehicles.forEach(vehicle => {
      const loadInfo = getLoadDetails(vehicle.load);
      const isFiltered = activeServiceNo === vehicle.serviceNo;

      const vehicleHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-all duration-300 ${isFiltered ? 'scale-125 z-40' : 'hover:scale-110'}">
          <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-full shadow-lg border text-white font-mono text-[11px] font-bold ${
            isFiltered ? 'bg-blue-600 border-white ring-2 ring-blue-400/50' : 'bg-slate-900 border-slate-700'
          }">
            <span class="w-2 h-2 rounded-full ${loadInfo.dotClass}"></span>
            <span>${vehicle.serviceNo}</span>
            <span class="text-[9px] px-1 rounded bg-black/40 text-slate-300">${vehicle.type}</span>
          </div>
        </div>
      `;

      const vehicleIcon = L.divIcon({
        html: vehicleHtml,
        className: 'live-bus-marker',
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });

      let marker = vehicleMarkersRef.current.get(vehicle.id);
      if (!marker) {
        marker = L.marker([vehicle.lat, vehicle.lng], { icon: vehicleIcon });
        marker.bindPopup(`
          <div class="p-1 text-slate-900">
            <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-1 mb-1.5">
              <span class="text-xs font-bold font-mono text-slate-900">Bus ${vehicle.serviceNo}</span>
              <span class="text-[10px] text-slate-500 font-medium">${vehicle.operator} · ${getBusTypeLabel(vehicle.type)}</span>
            </div>
            <div class="text-[11px] text-slate-600 space-y-0.5">
              <div>To: <span class="font-medium text-slate-800">${vehicle.destination}</span></div>
              <div>Speed: <span class="font-mono text-slate-800">${vehicle.speed} km/h</span></div>
              <div>Load: <span class="font-medium ${loadInfo.textClass}">${loadInfo.label}</span></div>
            </div>
          </div>
        `);
        marker.addTo(map);
        vehicleMarkersRef.current.set(vehicle.id, marker);
      } else {
        marker.setLatLng([vehicle.lat, vehicle.lng]);
        marker.setIcon(vehicleIcon);
      }
    });
  }, [vehicles, activeServiceNo]);

  // Draw Route Polyline if activeServiceNo is selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (activeServiceNo) {
      const routeDef = SINGAPORE_BUS_ROUTES.find(r => r.serviceNo === activeServiceNo);
      if (routeDef && routeDef.stopCodes.length >= 2) {
        const polyCoords: [number, number][] = routeDef.stopCodes
          .map(code => stops.find(s => s.BusStopCode === code))
          .filter((s): s is BusStop => !!s)
          .map(s => [s.Latitude, s.Longitude]);

        if (polyCoords.length >= 2) {
          routePolylineRef.current = L.polyline(polyCoords, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 8'
          }).addTo(map);

          // Fit bounds to show entire route with padding
          map.fitBounds(routePolylineRef.current.getBounds(), { padding: [50, 50] });
        }
      }
    }
  }, [activeServiceNo, stops]);

  // User location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userCoords) return;

    const userHtml = `
      <div class="relative flex items-center justify-center">
        <span class="absolute w-6 h-6 rounded-full bg-blue-500/30 animate-ping"></span>
        <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: 'user-location-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .bindTooltip('Your Location', { direction: 'top', offset: [0, -10] })
        .addTo(map);
    } else {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    }
  }, [userCoords]);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Map Legend & Control Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-lg pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-[11px]">Seats</span>
        </div>
        <span className="text-slate-600" aria-hidden="true">·</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-[11px]">Standing</span>
        </div>
        <span className="text-slate-600" aria-hidden="true">·</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-[11px]">Limited</span>
        </div>
        <span className="text-slate-600" aria-hidden="true">·</span>
        <span className="font-mono text-[11px] text-slate-400">{vehicles.length} live buses</span>
      </div>

      {activeServiceNo && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-500/40 text-xs shadow-lg">
          <span className="text-blue-400 font-medium">Tracking Route {activeServiceNo}</span>
          {onSelectService && (
            <button
              onClick={() => onSelectService('')}
              className="text-slate-400 hover:text-white ml-1 text-xs"
              title="Clear Route Filter"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};
