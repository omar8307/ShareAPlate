import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Donation, User } from '../../types';
import { MapPin, Navigation, Layers, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

interface FoodRescueMapProps {
  donations: Donation[];
  users: User[];
  onSelectDonation?: (donation: Donation) => void;
  selectedDonationId?: string;
}

export const FoodRescueMap: React.FC<FoodRescueMapProps> = ({
  donations,
  users,
  onSelectDonation,
  selectedDonationId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'available' | 'ngos'>('all');
  const [activeItem, setActiveItem] = useState<{ type: 'donation' | 'ngo'; data: any } | null>(null);

  // Bengaluru center
  const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946];
  const DEFAULT_ZOOM = 12;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Fix leaflet default icon asset paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | ShareAPlate Bengaluru',
        maxZoom: 18,
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when donations, users, or filterType changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // Custom HTML marker creators
    const createDonationIcon = (status: string) => {
      const bgColor = status === 'Available' ? '#2E7D32' : '#F4A261';
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: ${bgColor}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); color: white; font-size: 14px; font-weight: bold;">🍽️</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
    };

    const createNgoIcon = () => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: #1B4332; width: 30px; height: 30px; border-radius: 50%; border: 2px solid #74C69D; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); color: white; font-size: 14px; font-weight: bold;">🏢</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    };

    // Add Donation Markers
    if (filterType === 'all' || filterType === 'available') {
      donations.forEach((d) => {
        if (filterType === 'available' && d.status !== 'Available') return;

        const marker = L.marker([d.pickupLocation.lat, d.pickupLocation.lng], {
          icon: createDonationIcon(d.status),
        });

        marker.on('click', () => {
          setActiveItem({ type: 'donation', data: d });
        });

        marker.bindTooltip(
          `<strong>${d.foodName}</strong><br/>${d.quantity} ${d.unit} (${d.status})<br/>${d.pickupLocation.area}`,
          { direction: 'top', offset: [0, -10] }
        );

        marker.addTo(group);
      });
    }

    // Add NGO Markers
    if (filterType === 'all' || filterType === 'ngos') {
      const ngos = users.filter((u) => u.role === 'ngo');
      ngos.forEach((ngo) => {
        const marker = L.marker([ngo.location.lat, ngo.location.lng], {
          icon: createNgoIcon(),
        });

        marker.on('click', () => {
          setActiveItem({ type: 'ngo', data: ngo });
        });

        marker.bindTooltip(
          `<strong>${ngo.name}</strong><br/>${ngo.isVerified ? '✅ Verified NGO' : '⏳ Pending'}<br/>Cap: ~${ngo.beneficiaryCount || 100} daily`,
          { direction: 'top', offset: [0, -10] }
        );

        marker.addTo(group);
      });
    }

    // If specific donation selected, pan to it
    if (selectedDonationId) {
      const found = donations.find((d) => d.id === selectedDonationId);
      if (found) {
        map.setView([found.pickupLocation.lat, found.pickupLocation.lng], 14, { animate: true });
        setActiveItem({ type: 'donation', data: found });
      }
    }
  }, [donations, users, filterType, selectedDonationId]);

  return (
    <div className="py-10 bg-[#F7FAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight">
              Live Food Rescue Map
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Real-time geospatial distribution of surplus food donations and verified NGO kitchens across Bengaluru.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Pins
            </button>
            <button
              onClick={() => setFilterType('available')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterType === 'available' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Surplus Food Only
            </button>
            <button
              onClick={() => setFilterType('ngos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterType === 'ngos' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Verified NGOs Only
            </button>
          </div>
        </div>

        {/* Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Leaflet Map Viewport: 8 Cols */}
          <div className="lg:col-span-8 bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-md relative">
            <div
              ref={mapContainerRef}
              className="w-full h-[540px] z-10"
              style={{ minHeight: '480px' }}
            />

            {/* Floating Map Legend */}
            <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-neutral-200 shadow-sm text-xs text-neutral-700 space-y-1.5 pointer-events-auto">
              <div className="font-bold text-[11px] text-neutral-900 uppercase tracking-wider mb-1">Map Legend</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2E7D32] inline-block" />
                <span>Available Surplus Food</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F4A261] inline-block" />
                <span>Claimed / In Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1B4332] inline-block" />
                <span>Verified NGO Relief Shelter</span>
              </div>
            </div>
          </div>

          {/* Side Inspector Panel: 4 Cols */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-[#1B4332] flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#2E7D32]" /> Location Inspector
              </h3>
              <span className="text-xs text-neutral-400">Click any map pin</span>
            </div>

            {activeItem ? (
              activeItem.type === 'donation' ? (
                <div className="space-y-4 text-xs">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100">
                    <img
                      src={activeItem.data.imageUrl}
                      alt={activeItem.data.foodName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-[#2E7D32] text-white font-bold px-2 py-0.5 rounded text-[10px]">
                      {activeItem.data.status}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-neutral-500 font-medium">{activeItem.data.category}</span>
                    <h4 className="text-base font-bold text-[#1B4332] mt-0.5">{activeItem.data.foodName}</h4>
                    <p className="text-neutral-600 mt-1 leading-relaxed">{activeItem.data.description}</p>
                  </div>

                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Quantity:</span>
                      <strong className="text-neutral-900">{activeItem.data.quantity} {activeItem.data.unit} (~{activeItem.data.estimatedMeals} plates)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Area:</span>
                      <strong className="text-neutral-900">{activeItem.data.pickupLocation.area}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Donor:</span>
                      <strong className="text-neutral-900">{activeItem.data.donorName}</strong>
                    </div>
                  </div>

                  {onSelectDonation && (
                    <button
                      onClick={() => onSelectDonation(activeItem.data)}
                      className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      View Full Donation Dossier
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified NGO Center
                    </div>
                    <h4 className="text-base font-bold text-[#1B4332]">{activeItem.data.name}</h4>
                    <p className="text-neutral-600 mt-1">{activeItem.data.address}</p>
                  </div>

                  <div className="space-y-2 text-neutral-700">
                    <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                      <span>Daily Beneficiaries:</span>
                      <strong className="font-mono text-neutral-900">~{activeItem.data.beneficiaryCount || 200} people</strong>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                      <span>Contact Phone:</span>
                      <span className="font-mono text-neutral-900">{activeItem.data.phone}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                      <span>Verification:</span>
                      <span className="text-emerald-700 font-semibold">80G & Darpan Approved</span>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="py-12 text-center text-neutral-400 space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-neutral-300" />
                <p className="text-xs">Select any marker on the map to inspect pickup details, food volume, or NGO capacity.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
