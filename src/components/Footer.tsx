import React from 'react';
import { RoleTabKey } from '../types/foodRescue';

interface FooterProps {
  onSelectTab: (tab: RoleTabKey) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_12px_rgba(0,0,0,0.03)] py-12 mt-12 border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img
              alt="ShareAPlate Brand Logo"
              className="h-6 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UjhHx0tcsDpPfuanUwyKlVzyq4uXOcYXVBTmrdgR5QCDW_pSke6NMV298_u_xglucjt0VeY9aIuSzL98QjoyQp-oGHvimDeYSzC7Wp8oUpJhhT3cZcfYCnqguCRh6u7IIJ58DtuS38IbzymKjIfTyVHCk1mW9E0dMY_6qOCx9YeC_bVDKJVWEj9eClOmJnsGPPGNhvzIAI_TI34fodpAPfFilSBeay8u1IGV_gulA5"
            />
            <span className="text-[20px] text-primary font-bold">ShareAPlate</span>
          </div>
          <p className="text-[13px] text-on-surface-variant leading-relaxed">
            Connecting commercial food surplus to hyper-local hunger relief through transparent logistics and rapid community-led dispatch.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            <span className="text-[11px] text-on-surface-variant font-medium">
              Operational Cluster: Bengaluru Central & Whitefield
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[15px] text-on-surface font-bold">Safety & Compliance</h4>
          <ul className="space-y-2 text-[13px] text-on-surface-variant">
            <li>FSSAI Surplus Redistribution Norms</li>
            <li>Good Samaritan Food Donor Protections</li>
            <li>Cold Chain Temperature Audits</li>
            <li>Allergen Declaration Protocols</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-[15px] text-on-surface font-bold">Ecosystem & Tech</h4>
          <ul className="space-y-2 text-[13px] text-on-surface-variant">
            <li>Map Engine: Leaflet & OpenStreetMap Radar</li>
            <li>
              Open Food Protocol API Status:{' '}
              <span className="text-primary font-bold">99.98%</span>
            </li>
            <li>Verified NGO Registry Node</li>
            <li>Realtime Volunteer Route Dispatch</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-[15px] text-on-surface font-bold">Direct Links</h4>
          <ul className="space-y-2 text-[13px] text-on-surface-variant">
            <li>
              <button
                onClick={() => onSelectTab('marketplace')}
                className="hover:text-primary transition-colors text-left cursor-pointer"
              >
                Available Rescue Surplus
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('donor-hub')}
                className="hover:text-primary transition-colors text-left cursor-pointer"
              >
                Surplus Onboarding for Caterers
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('volunteer-task')}
                className="hover:text-primary transition-colors text-left cursor-pointer"
              >
                Volunteer Express Claim
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('impact-analytics')}
                className="hover:text-primary transition-colors text-left cursor-pointer"
              >
                Citywide Impact Dashboard
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-on-surface-variant border-t border-surface-container">
        <p>© 2025 ShareAPlate Community Foundation. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectTab('how-it-works')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => onSelectTab('how-it-works')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Privacy & Data Rights
          </button>
          <button
            onClick={() => onSelectTab('how-it-works')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Food Safety Charter
          </button>
        </div>
      </div>
    </footer>
  );
};
