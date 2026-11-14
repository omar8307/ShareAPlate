import React from 'react';
import { Heart, ShieldCheck, Leaf, Globe } from 'lucide-react';

export const Footer: React.FC<{ setCurrentTab: (tab: string) => void }> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-[#1B4332] text-white/80 border-t border-[#2E7D32]/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
              <span className="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white text-lg font-black">
                S
              </span>
              <span>
                Share<span className="text-[#74C69D]">A</span>Plate
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              "Don't Waste Food. Share Hope."
              Connecting surplus meals from restaurants, bakeries, and households with verified NGOs and volunteers across Bengaluru.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#74C69D]">
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" /> Zero Waste
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> Zero Hunger
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('explore')} className="hover:text-white transition-colors">
                  Available Surplus Food
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('map')} className="hover:text-white transition-colors">
                  Live Food Rescue Map
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('how-it-works')} className="hover:text-white transition-colors">
                  How Redistribution Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('impact')} className="hover:text-white transition-colors">
                  Bengaluru Impact Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: For Stakeholders */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('donor')} className="hover:text-white transition-colors">
                  Restaurants & Food Donors
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('ngo')} className="hover:text-white transition-colors">
                  Verified NGO Relief Partners
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('volunteer')} className="hover:text-white transition-colors">
                  Community Courier Volunteers
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('admin')} className="hover:text-white transition-colors">
                  Platform Operations Console
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Food Safety & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#74C69D]" /> Food Safety Protocol
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              All donations adhere to FSSAI hygienic handling directives. Time-temperature checklists and single-use digital QR authorization ensure safe transit from donor to shelter.
            </p>
            <div className="text-[11px] text-white/60">
              Operating in Bengaluru (Indiranagar, Koramangala, Whitefield, HSR, Malleshwaram).
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© 2026 ShareAPlate Initiative. A sustainable community food rescue network.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentTab('about')} className="hover:text-white">About Mission</button>
            <span>·</span>
            <span>Food Safety Standards</span>
            <span>·</span>
            <span>Privacy & Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
