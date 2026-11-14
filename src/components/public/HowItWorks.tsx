import React from 'react';
import { UploadCloud, Sparkles, QrCode, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onDonateClick: () => void;
  onExploreClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onDonateClick, onExploreClick }) => {
  const steps = [
    {
      step: '01',
      title: 'Post Surplus Food in 60s',
      description:
        'Donors log excess cooked meals, bakery breads, or fresh produce. Our AI Assistant prompts safety handling tips, allergen warnings, and generates a clear description.',
      icon: UploadCloud,
      color: 'bg-emerald-50 text-[#2E7D32] border-emerald-200',
    },
    {
      step: '02',
      title: 'Smart NGO Matching & Claim',
      description:
        'Our algorithm scores distance, NGO beneficiary demand, and pickup deadlines (40% location + 25% quantity + 20% time + 15% category). Verified NGOs claim instantly.',
      icon: Sparkles,
      color: 'bg-emerald-50 text-[#1B4332] border-emerald-200',
    },
    {
      step: '03',
      title: 'Volunteer Pickup with QR/OTP',
      description:
        'Nearby volunteers accept delivery tasks. Upon arrival at the donor, a single-use secure digital QR code or 6-digit OTP validates the handover into safe transit.',
      icon: QrCode,
      color: 'bg-amber-50 text-[#D97706] border-amber-200',
    },
    {
      step: '04',
      title: 'Nourish Communities & Track CO2',
      description:
        'Meals are served at orphanages, elder care homes, and community centers. Donors receive digital impact receipts, thank-you notes, and verified carbon offset data.',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-[#2E7D32] border-emerald-200',
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2E7D32]">Seamless Community Workflow</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight">
            How ShareAPlate Powers Zero Food Waste
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            From restaurant kitchen to community plate in under 90 minutes. Transparent, dignified, and digitally verified.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#F7FAF7] rounded-2xl p-6 border border-neutral-200/80 hover:border-[#2E7D32]/50 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-neutral-400 tabular-nums">
                      STEP {item.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#1B4332] mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-200/60 text-[11px] text-[#2E7D32] font-semibold flex items-center gap-1">
                  Verified Protocol <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout Box */}
        <div className="mt-12 bg-linear-to-r from-[#1B4332] to-[#2E7D32] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">Have surplus food right now?</h3>
            <p className="text-xs text-white/80">
              Join 120+ food donors in Bengaluru. We match your surplus with an NGO within 15 minutes.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onDonateClick}
              className="px-5 py-2.5 text-xs font-bold text-[#1B4332] bg-white rounded-xl hover:bg-neutral-100 transition-colors shadow-sm"
            >
              List Food Donation
            </button>
            <button
              onClick={onExploreClick}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
            >
              Browse Active Listings
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
