import React from 'react';
import { ShieldCheck, Heart, Leaf, Users, CheckCircle, Scale } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 bg-[#F7FAF7] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2E7D32]">Our Purpose & Constitution</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight">
            Fighting Hunger. Rescuing Food.
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            ShareAPlate was founded on a simple truth: No plate of wholesome food should end up in a landfill while a neighbor in our city goes to bed hungry.
          </p>
        </div>

        {/* The Food Waste Paradox in Bengaluru */}
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-[#1B4332] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#2E7D32]" /> The Food Waste Crisis
          </h2>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            In urban metropolises like Bengaluru, commercial kitchens, wedding banquets, tech campus cafeterias, and bakeries generate hundreds of kilograms of surplus food daily. Concurrently, thousands of vulnerable children, elderly citizens, and migrant laborers lack regular access to balanced, dignified meals.
          </p>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            The traditional bottleneck has never been food supply; it has been logistics, real-time matching, and food safety trust. ShareAPlate solves this through an intelligent digital dispatch network.
          </p>
        </div>

        {/* 4 Pillars of the Platform */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-2">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1B4332]">Zero Food Waste</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every kilogram of surplus food saved prevents 2.5 kg of greenhouse methane gas emissions and conserves hundreds of liters of embedded water.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F4A261] flex items-center justify-center mb-2">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1B4332]">Dignified Redistribution</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Food is never treated as scrap. Donations are packed neatly in compostable containers and delivered fresh to licensed shelters and community care trusts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1B4332]">Rigorous Food Safety</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every post requires an FSSAI-aligned preparation timestamp and holding temperature audit. Single-use digital QR tokens ensure strict chain of custody.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1B4332]">Volunteer Movement</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Hyper-local community couriers turn their daily commute into micro-relief missions, bridging the last-mile gap between restaurants and NGOs.
            </p>
          </div>
        </div>

        {/* Food Safety & Hygiene Charter */}
        <div className="bg-emerald-900 text-white p-8 rounded-2xl shadow-md space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#74C69D] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#74C69D]" />
            Food Safety & Legal Framework
          </div>
          <h3 className="text-xl font-bold tracking-tight">Our 4-Hour Freshness Protocol</h3>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#74C69D] shrink-0 mt-0.5" />
              <span><strong>Cooked Food Window:</strong> Warm meals must be collected and consumed within 4 hours of preparation unless chilled immediately below 4°C.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#74C69D] shrink-0 mt-0.5" />
              <span><strong>Packaging:</strong> Only clean, food-grade biodegradable or sealed steel containers are accepted. No unsealed open platters.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#74C69D] shrink-0 mt-0.5" />
              <span><strong>Inspection Rights:</strong> NGOs and volunteers reserve the right to inspect sensory aroma and texture prior to scanning the pickup verification QR code.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
