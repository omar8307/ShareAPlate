import React from 'react';
import { MAP_IMAGES } from '../data/initialData';
import { ResilientImage } from '../components/ResilientImage';
import { NavRoute, SurplusListing } from '../types';

interface PublicPortalViewProps {
  listings: SurplusListing[];
  onNavigate: (route: NavRoute) => void;
}

export const PublicPortalView: React.FC<PublicPortalViewProps> = ({ listings, onNavigate }) => {
  const totalMealsLive = listings.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col w-full pb-8 gap-6">
      <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 flex flex-col gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
            Bengaluru Metropolitan Food Rescue Grid
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Zero-Waste Surplus Redistribution Across Bengaluru
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed max-w-2xl">
            ShareAMeal connects FSSAI-certified commercial kitchens, banquet halls, and corporate cafeterias directly with verified NGO shelters and EV volunteer couriers in under 34 minutes.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('dispatch-control')}
              className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap"
            >
              Open Admin Dispatch
            </button>
            <button
              type="button"
              onClick={() => onNavigate('surplus-manifest')}
              className="bg-surface-container-high hover:bg-surface-container-highest text-primary px-5 py-2.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              Donor Food Listing
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ngo-directory')}
              className="bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container px-5 py-2.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              NGO Smart Claiming
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-56 rounded-xl overflow-hidden relative shadow-inner">
          <ResilientImage
            src={MAP_IMAGES.ngoRoute}
            alt="Bengaluru live food rescue corridor map"
            className="w-full h-full object-cover"
            fallbackIcon="hub"
            fallbackTitle="Bengaluru Rescue Network"
          />
          <div className="absolute bottom-3 left-3 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-primary shadow-sm tabular-nums">
            Live Grid: {totalMealsLive} portions &amp; kg tracked right now
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Rescues', value: '1,420', note: '↑ 18.4% vs last month' },
          { label: 'Cold-Chain Compliance', value: '99.4%', note: 'FSSAI Grade A audited' },
          { label: 'Active Volunteer Riders', value: '314', note: 'EV mopeds & thermal vans' },
          { label: 'Avg Turnaround Time', value: '28 min', note: 'Pickup to shelter handover' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <span className="text-xs font-medium text-on-surface-variant">{stat.label}</span>
            <div className="font-headline text-3xl font-extrabold text-primary mt-2 tabular-nums">
              {stat.value}
            </div>
            <span className="text-[11px] font-semibold text-secondary mt-1 block">{stat.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
