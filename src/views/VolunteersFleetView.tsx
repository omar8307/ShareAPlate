import React, { useState } from 'react';
import { MAP_IMAGES } from '../data/initialData';
import { ResilientImage } from '../components/ResilientImage';
import { SurplusListing } from '../types';

interface VolunteersFleetViewProps {
  listings: SurplusListing[];
  onShowToast: (msg: string, tone?: 'info' | 'success' | 'warning') => void;
}

const FLEET_ROSTER = [
  {
    id: 'vol-manoj',
    name: 'Manoj Kumar',
    vehicle: 'EV Moped #KA-03-HM-4109',
    zone: 'Church St → Wilson Garden',
    status: 'On Active Run (#BFR-8891)',
    rating: '4.97',
    rescues: 64,
    speed: '32 km/h',
  },
  {
    id: 'vol-karthik',
    name: 'Karthik R.',
    vehicle: 'Hero Electric Nyx • 60L Box',
    zone: 'Indiranagar → Halasuru',
    status: 'In Transit (SAM-8942)',
    rating: '4.95',
    rescues: 48,
    speed: '28 km/h',
  },
  {
    id: 'vol-arun',
    name: 'Arun V.',
    vehicle: 'EV Fleet #14 • Thermal Van',
    zone: '100ft Rd → Asha Sadan',
    status: 'En Route (MNF-2024-0982)',
    rating: '4.92',
    rescues: 81,
    speed: '35 km/h',
  },
  {
    id: 'vol-meera',
    name: 'Meera Nair',
    vehicle: 'Ather 450X • Insulated Tote',
    zone: 'Koramangala Cluster',
    status: 'Standby Ready',
    rating: '4.99',
    rescues: 112,
    speed: '0 km/h',
  },
];

export const VolunteersFleetView: React.FC<VolunteersFleetViewProps> = ({
  listings,
  onShowToast,
}) => {
  const [selectedVolId, setSelectedVolId] = useState(FLEET_ROSTER[0].id);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'standby'>('all');

  const filteredFleet = FLEET_ROSTER.filter((v) => {
    if (statusFilter === 'active') return !v.status.includes('Standby');
    if (statusFilter === 'standby') return v.status.includes('Standby');
    return true;
  });

  const activeVolunteer = FLEET_ROSTER.find((v) => v.id === selectedVolId) || FLEET_ROSTER[0];
  const openPickups = listings.filter((l) => l.status === 'awaiting_claim');

  return (
    <div className="flex flex-col w-full pb-8 gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
            Bengaluru Active Mobility Grid
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary">
            Volunteers on Duty &amp; EV Fleet Roster
          </h1>
          <p className="text-sm text-on-surface-variant">
            314 active rescue couriers across Indiranagar, Koramangala, Whitefield, and Wilson Garden
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-lg self-start">
          {(
            [
              { id: 'all', label: 'All Couriers (4)' },
              { id: 'active', label: 'In Transit (3)' },
              { id: 'standby', label: 'Standby (1)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-3">
          {filteredFleet.map((vol) => {
            const isSelected = vol.id === activeVolunteer.id;
            return (
              <button
                key={vol.id}
                type="button"
                onClick={() => setSelectedVolId(vol.id)}
                className={`text-left p-4 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-surface-container-lowest ring-2 ring-primary/30 shadow-md'
                    : 'bg-surface-container-lowest shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline font-bold shrink-0">
                    {vol.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-base font-semibold text-primary truncate">
                        {vol.name}
                      </span>
                      <span className="text-[11px] text-secondary font-bold tabular-nums">
                        {vol.rating} ★
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate">{vol.vehicle}</p>
                    <span className="text-[11px] text-outline block mt-0.5">{vol.zone}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                      vol.status.includes('Standby')
                        ? 'bg-surface-container text-on-surface-variant'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}
                  >
                    {vol.status}
                  </span>
                  <span className="text-[11px] text-outline tabular-nums">
                    {vol.rescues} rescues • {vol.speed}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-lg font-semibold text-primary">
              Courier Telemetry: {activeVolunteer.name}
            </h2>
            <span className="text-[11px] font-bold text-secondary bg-secondary-container px-2.5 py-0.5 rounded-full">
              GPS Verified
            </span>
          </div>

          <div className="relative h-52 rounded-xl overflow-hidden shadow-inner">
            <ResilientImage
              src={MAP_IMAGES.dispatchTelemetry}
              alt="Bengaluru live volunteer courier telemetry map"
              className="w-full h-full object-cover"
              fallbackIcon="electric_moped"
              fallbackTitle={activeVolunteer.zone}
            />
            <div className="absolute bottom-3 left-3 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-primary shadow-sm tabular-nums">
              {activeVolunteer.zone} • {activeVolunteer.speed}
            </div>
          </div>

          <div className="bg-surface-container-low p-3.5 rounded-lg space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-outline">Assigned Hardware</span>
              <span className="font-semibold text-on-surface">{activeVolunteer.vehicle}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-outline">Pending Nearby Pickups</span>
              <span className="font-semibold text-secondary tabular-nums">
                {openPickups.length} active drops
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onShowToast(
                `Priority dispatch ping sent to ${activeVolunteer.name} (${activeVolunteer.vehicle}).`,
                'success'
              )
            }
            className="w-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Assign Nearest Unclaimed Surplus
          </button>
        </div>
      </div>
    </div>
  );
};
