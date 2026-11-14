import React from 'react';
import { ArrowRight, Utensils, HeartHandshake, Truck, MapPin } from 'lucide-react';
import type { ImpactStats } from '../../types';

interface HeroProps {
  stats?: ImpactStats;
  onExploreFood: () => void;
  onDonateFood: () => void;
  onJoinVolunteer: () => void;
  onOpenMap: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  stats,
  onExploreFood,
  onDonateFood,
  onJoinVolunteer,
  onOpenMap,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#F7FAF7] pt-8 pb-12 lg:pt-14 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Split: Editorial Copy Left, Photographic Proof Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#2E7D32] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              Smart Community Food Rescue & Redistribution · Bengaluru
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B4332] tracking-tight leading-[1.15] text-balance">
              Don't Waste Food. <br />
              <span className="text-[#2E7D32]">Share Hope.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#263238]/85 leading-relaxed max-w-2xl">
              Every day, surplus nutritious food goes to waste while local communities go hungry. ShareAPlate intelligently connects restaurants, hotels, bakeries, and households with verified NGOs and rapid-courier volunteers across Bengaluru.
            </p>

            {/* CTA Cluster */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onDonateFood}
                className="px-6 py-3 text-sm font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Utensils className="w-4 h-4" /> Donate Food
              </button>

              <button
                onClick={onExploreFood}
                className="px-5 py-3 text-sm font-semibold text-[#1B4332] bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                Find Surplus Food <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onJoinVolunteer}
                className="px-4 py-3 text-sm font-semibold text-[#F4A261] hover:text-[#e7924d] hover:bg-[#F4A261]/10 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" /> Become a Volunteer
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-neutral-600 border-t border-neutral-200/80">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#2E7D32]" />
                <span>Smart NGO Proximity Routing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#2E7D32]" />
                <span>Bengaluru Ward Coverage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#2E7D32]">QR & OTP</span>
                <span>Verified Deliveries</span>
              </div>
            </div>
          </div>

          {/* Right Column: 5 Cols High-Fidelity Hero Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-neutral-100">
              <img
                src="/src/assets/images/hero_food_rescue_1794072150460.jpg"
                alt="Community food rescue meal packages prepared with care"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <div className="text-white">
                  <p className="text-xs font-semibold text-[#74C69D] uppercase tracking-wider">Live Community Rescue</p>
                  <p className="text-sm font-medium mt-0.5">Freshly packed nutritious lunch boxes dispatched from Indiranagar</p>
                </div>
              </div>
            </div>

            {/* Quick Interactive Map Teaser Button */}
            <button
              onClick={onOpenMap}
              className="mt-3 w-full py-2 px-3 text-xs font-semibold text-[#1B4332] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 rounded-lg flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" /> View Live Food Rescue Map (OpenStreetMap)
              </span>
              <span className="text-[#2E7D32] font-bold">Explore Area →</span>
            </button>
          </div>
        </div>

        {/* 4-Column Live Metric Counter Strip */}
        <div className="mt-12 pt-8 border-t border-neutral-200/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-xl border border-neutral-200/60 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Total Food Rescued</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
              {stats?.totalFoodRescuedKg.toLocaleString() || '1,420'} <span className="text-sm font-sans font-medium text-neutral-500">kg</span>
            </p>
            <p className="text-[11px] text-[#2E7D32] mt-0.5">~{stats?.co2PreventedKg.toLocaleString() || '3,550'} kg CO2e prevented</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/60 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Meals Provided</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#2E7D32] font-mono tabular-nums mt-1">
              {stats?.totalMealsProvided.toLocaleString() || '3,550'} <span className="text-sm font-sans font-medium text-neutral-500">plates</span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">To shelters & community centers</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/60 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Verified NGO Partners</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
              {stats?.verifiedNgosCount || '5'} <span className="text-sm font-sans font-medium text-neutral-500">active</span>
            </p>
            <p className="text-[11px] text-[#2E7D32] mt-0.5">80G & Darpan vetted</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/60 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Volunteer Couriers</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F4A261] font-mono tabular-nums mt-1">
              {stats?.activeVolunteersCount || '10'} <span className="text-sm font-sans font-medium text-neutral-500">couriers</span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">96.4% on-time pickup rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};
