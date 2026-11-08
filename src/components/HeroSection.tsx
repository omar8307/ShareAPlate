import React from 'react';
import { RoleTabKey } from '../types/foodRescue';

interface HeroSectionProps {
  onSelectTab: (tab: RoleTabKey) => void;
  activeSurplusCount: number;
  totalRescuedKg: number;
  totalMealsServed: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectTab,
  activeSurplusCount,
  totalRescuedKg,
  totalMealsServed,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface pb-12 pt-6 px-4 md:px-8 border-b border-surface-container">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Badges & Live Status */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-[12px] font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span>Bengaluru City Live Grid: {activeSurplusCount} Urgent Surpluses Available Now</span>
          </div>

          <div className="flex items-center gap-3 text-[12px] font-medium text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              FSSAI Certified Network
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">alarm</span>
              Avg. Rescue Time: 28 mins
            </span>
          </div>
        </div>

        {/* Main Headline & Subheading Mosaic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="inline-block">
              <span className="text-[13px] text-primary font-bold tracking-wider uppercase px-3 py-1 bg-surface-container rounded-lg">
                Zero Food Waste Collective
              </span>
            </div>

            <h1 className="text-[34px] sm:text-[44px] lg:text-[48px] font-extrabold text-on-surface tracking-tight leading-[1.15]">
              Don't Waste Food. <br />
              <span className="text-primary-container">Share Hope.</span>
            </h1>

            <p className="text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl leading-relaxed">
              Every day, thousands of kilograms of wholesome food go to waste while local communities go hungry.{' '}
              <strong className="text-on-surface font-semibold">ShareAPlate</strong> connects surplus meals
              from caterers, restaurants, and IT cafeterias directly to verified Bengaluru shelters with intelligent AI matching and verified volunteer dispatch.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('donor-hub')}
                className="px-6 py-3.5 rounded-xl bg-primary text-on-primary text-[14px] font-bold hover:bg-surface-tint shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span>Donate Surplus Food</span>
              </button>

              <button
                onClick={() => onSelectTab('marketplace')}
                className="px-6 py-3.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-[14px] font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">explore</span>
                <span>Explore Live Marketplace</span>
              </button>

              <button
                onClick={() => onSelectTab('ngo-portal')}
                className="px-5 py-3.5 rounded-xl bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed text-[14px] font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                <span>Claim as Verified NGO</span>
              </button>
            </div>
          </div>

          {/* Hero Photo & Trust Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-surface-container-highest aspect-[4/3] group">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Warm documentary photograph of Indian community kitchen volunteers packing fresh wholesome food in eco-friendly reusable containers under morning sunlight"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_7RIy-AF4PbRh1_JgrWnUBOhs6xvnmXol5B1ZNgKBlWlspqzcBzDa5azWJ_b9qTlfOopgQgRRxFEBU-LJpPJfrlrzSja1t8uNKRLip9QTzhyQxBSGC-ZGYGXM55YUR5h7zEWIbMBMKWiUBcd5LHnn1sfqCrJY3P2CtTrU7zROvCsWpLoBNGX8FhNUYgktUtVsZYyK-jF-T7peb2TgGFX8109JGawnKWVMruDurYtb"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

              {/* Real-time Rescue Status floating tag */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-surface/90 backdrop-blur-md shadow-lg flex items-center justify-between border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                  </div>
                  <div>
                    <div className="text-[13px] text-on-surface font-bold">Whitefield Caterer Rescue</div>
                    <div className="text-[11px] text-on-surface-variant">140 meals en-route to Hope Children's Home</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                  12 min pickup
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Live Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Food Rescued</span>
              <span className="material-symbols-outlined text-primary text-[20px]">eco</span>
            </div>
            <div className="text-[28px] sm:text-[32px] font-extrabold text-primary-container leading-none tabular-nums">
              {totalRescuedKg.toLocaleString()}{' '}
              <span className="text-[14px] font-semibold text-on-surface-variant">kg</span>
            </div>
            <div className="text-[11px] text-on-surface-variant">+420 kg rescued today</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Meals Served</span>
              <span className="material-symbols-outlined text-tertiary text-[20px]">lunch_dining</span>
            </div>
            <div className="text-[28px] sm:text-[32px] font-extrabold text-on-surface leading-none tabular-nums">
              {totalMealsServed.toLocaleString()}
            </div>
            <div className="text-[11px] text-on-surface-variant">To 28 verified shelters</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Verified NGOs</span>
              <span className="material-symbols-outlined text-secondary text-[20px]">corporate_fare</span>
            </div>
            <div className="text-[28px] sm:text-[32px] font-extrabold text-on-surface leading-none tabular-nums">
              48
            </div>
            <div className="text-[11px] text-on-surface-variant">Bengaluru municipal area</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Active Volunteers</span>
              <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
            </div>
            <div className="text-[28px] sm:text-[32px] font-extrabold text-on-surface leading-none tabular-nums">
              120
            </div>
            <div className="text-[11px] text-on-surface-variant">34 on field right now</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow col-span-2 sm:col-span-1 border border-surface-container">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Rescue Success</span>
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
            </div>
            <div className="text-[28px] sm:text-[32px] font-extrabold text-primary leading-none tabular-nums">
              99.4%
            </div>
            <div className="text-[11px] text-on-surface-variant">OTP authenticated audit</div>
          </div>
        </div>
      </div>
    </section>
  );
};
