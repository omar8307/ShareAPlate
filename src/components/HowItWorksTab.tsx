import React from 'react';

interface HowItWorksTabProps {
  onExploreMarketplace: () => void;
  onStartDonating: () => void;
}

export const HowItWorksTab: React.FC<HowItWorksTabProps> = ({
  onExploreMarketplace,
  onStartDonating,
}) => {
  return (
    <div className="flex flex-col gap-10">
      {/* Intro Header */}
      <div className="p-8 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-surface-container">
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="text-[12px] text-primary font-bold uppercase tracking-wider">
            Operational Blueprint
          </span>
          <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight">
            How ShareAPlate Rescues Food in Under 30 Minutes
          </h2>
          <p className="text-[15px] text-on-surface-variant leading-relaxed">
            Our hybrid technology combines algorithmic proximity dispatch, temperature-audited transit, and strict Good Samaritan legal protections to move fresh meals directly from commercial kitchens to verified shelters.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={onStartDonating}
            className="px-5 py-3 rounded-xl bg-primary text-on-primary text-[13px] font-bold hover:bg-surface-tint shadow-md cursor-pointer"
          >
            Post Surplus Now
          </button>
          <button
            onClick={onExploreMarketplace}
            className="px-5 py-3 rounded-xl bg-surface-container text-on-surface text-[13px] font-semibold hover:bg-surface-container-high cursor-pointer"
          >
            Explore Live Radar
          </button>
        </div>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Step 1 */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-surface-container hover:border-primary/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-[18px]">
            01
          </div>
          <h3 className="text-[18px] font-bold text-on-surface">Kitchen Surplus Listed</h3>
          <p className="text-[13px] text-on-surface-variant leading-relaxed">
            Banquet caterers, hotels, and IT park cafeterias log surplus volume, cook time, and storage temperature in &lt;90 seconds via web or WhatsApp bot.
          </p>
          <div className="mt-auto pt-2 text-[11px] font-semibold text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>FSSAI License Pre-Verified</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-surface-container hover:border-primary/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold text-[18px]">
            02
          </div>
          <h3 className="text-[18px] font-bold text-on-surface">Intelligent AI Match</h3>
          <p className="text-[13px] text-on-surface-variant leading-relaxed">
            Our match engine weighs distance, shelter diner count, vehicle availability, and dietary strictures to notify the optimal beneficiary within seconds.
          </p>
          <div className="mt-auto pt-2 text-[11px] font-semibold text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>98% Proximity Accuracy</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-surface-container hover:border-primary/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[18px]">
            03
          </div>
          <h3 className="text-[18px] font-bold text-on-surface">Rapid Transit Dispatch</h3>
          <p className="text-[13px] text-on-surface-variant leading-relaxed">
            Volunteer riders and partnered EV fleets pick up meals equipped with insulated thermal carriers to maintain core temperature above 65°C.
          </p>
          <div className="mt-auto pt-2 text-[11px] font-semibold text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">electric_moped</span>
            <span>Avg 18-minute Transit</span>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-surface-container hover:border-primary/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-tertiary-container text-white flex items-center justify-center font-bold text-[18px]">
            04
          </div>
          <h3 className="text-[18px] font-bold text-on-surface">OTP Audit & Handover</h3>
          <p className="text-[13px] text-on-surface-variant leading-relaxed">
            Shelter coordinators verify delivery using a 4-digit cryptographic OTP. Handover records trigger automated Section 80G tax receipts and CO2e tracking.
          </p>
          <div className="mt-auto pt-2 text-[11px] font-semibold text-tertiary flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Digital Custody Chain</span>
          </div>
        </div>
      </div>

      {/* Safety & Legal Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">policy</span>
            <h3 className="text-[20px] font-bold text-on-surface">Good Samaritan Protection (India)</h3>
          </div>
          <p className="text-[14px] text-on-surface-variant leading-relaxed">
            Under Indian food donation advisories and municipal provisions, donors acting in good faith who comply with hygienic packing standards are legally protected from civil and criminal liability.
          </p>
          <ul className="space-y-2 text-[13px] text-on-surface-variant">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">check</span>
              <span>Protects commercial caterers, hotels, and corporate kitchens.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">check</span>
              <span>Section 80G tax exemption receipts for verified food value.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">check</span>
              <span>Full tamper-evident labeling provided at pickup point.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">thermostat</span>
            <h3 className="text-[20px] font-bold text-on-surface">FSSAI Food Safety Protocols</h3>
          </div>
          <p className="text-[14px] text-on-surface-variant leading-relaxed">
            Food redistributions adhere to strict guidelines published by the Food Safety and Standards Authority of India (FSSAI) for surplus food management:
          </p>
          <ul className="space-y-2 text-[13px] text-on-surface-variant">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">check</span>
              <span>Hot foods maintained &gt; 65°C throughout transit leg.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">check</span>
              <span>Perishable cold items refrigerated below 4°C.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">check</span>
              <span>Mandatory maximum 3.5 hour consumption window from prep.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
