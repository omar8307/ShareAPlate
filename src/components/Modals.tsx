import React, { useState } from 'react';
import { SurplusFoodItem } from '../types/foodRescue';

/* ----------------------------------------------------
   1. CLAIM CONFIRMATION MODAL & OTP GENERATION
----------------------------------------------------- */
interface ClaimModalProps {
  isOpen: boolean;
  item: SurplusFoodItem | null;
  onClose: () => void;
  onConfirmClaim: (item: SurplusFoodItem, ngoName: string, otp: string) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirmClaim,
}) => {
  const [selectedNGO, setSelectedNGO] = useState(
    'Feeding Hope Trust (#NGO-BLR-2041) — Austin Town'
  );
  const [agreedGuidelines, setAgreedGuidelines] = useState(true);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleGenerateClaim = () => {
    const randomOtp = `SAP-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedOtp(randomOtp);
    onConfirmClaim(item, selectedNGO, randomOtp);
  };

  const handleDone = () => {
    setGeneratedOtp(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-5 border border-primary/20 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            <h3 className="text-[20px] font-bold text-on-surface">Confirm Food Rescue Claim</h3>
          </div>
          <button
            onClick={handleDone}
            className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-surface-container">
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Claiming Surplus:
          </div>
          <div className="text-[18px] font-bold text-primary">{item.title}</div>
          <div className="flex items-center justify-between text-[12px] text-on-surface-variant pt-1">
            <span>{item.donorName}</span>
            <span className="font-bold text-on-surface">
              {item.servings} Meals ({item.quantityKg} kg)
            </span>
          </div>
        </div>

        {!generatedOtp ? (
          <>
            <div className="flex flex-col gap-3">
              <label className="text-[12px] font-semibold text-on-surface">
                Select Claiming Shelter / NGO Team
              </label>
              <select
                value={selectedNGO}
                onChange={(e) => setSelectedNGO(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container text-on-surface text-[13px] focus:outline-none border border-surface-container"
              >
                <option value="Feeding Hope Trust (#NGO-BLR-2041) — Austin Town">
                  Feeding Hope Trust (#NGO-BLR-2041) — Austin Town
                </option>
                <option value="Akshaya Mitra Foundation (#NGO-BLR-1182) — Koramangala">
                  Akshaya Mitra Foundation (#NGO-BLR-1182) — Koramangala
                </option>
                <option value="Samarth Rehabilitation Shelter (#NGO-BLR-0943) — Electronic City">
                  Samarth Rehabilitation Shelter (#NGO-BLR-0943) — Electronic City
                </option>
                <option value="Sneha Care Home (#NGO-BLR-3102) — Sarjapur">
                  Sneha Care Home (#NGO-BLR-3102) — Sarjapur
                </option>
              </select>

              <label className="flex items-center gap-2 pt-1 text-[12px] text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedGuidelines}
                  onChange={(e) => setAgreedGuidelines(e.target.checked)}
                  className="accent-primary w-4 h-4 rounded"
                />
                <span>I agree to FSSAI food redistribution guidelines and temperature checks.</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-[13px] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!agreedGuidelines}
                onClick={handleGenerateClaim}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-surface-tint text-[13px] font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>Generate Pickup OTP</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-xl bg-secondary-fixed/50 flex flex-col items-center justify-center gap-2 text-center border border-primary/30">
              <span className="text-[12px] text-primary font-bold">
                Claim Verified! Share this OTP with Donor at Pickup:
              </span>
              <span className="text-[32px] text-on-surface font-mono font-extrabold tracking-widest tabular-nums text-primary">
                {generatedOtp}
              </span>
              <span className="text-[12px] text-on-surface-variant">
                Volunteer dispatch alert sent. Transit rider assigned to pickup point.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleDone}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-surface-tint text-[13px] font-bold cursor-pointer"
              >
                Got It & Track Route
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   2. FOOD SAFETY & ALLERGEN AUDIT MODAL
----------------------------------------------------- */
interface SafetyModalProps {
  isOpen: boolean;
  item: SurplusFoodItem | null;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, item, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-4 border border-secondary-container animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            <h3 className="text-[20px] font-bold text-on-surface">Food Safety & FSSAI Declaration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          <h4 className="text-[16px] text-primary font-bold">{item.title}</h4>
          <p className="text-[12px] text-on-surface-variant font-medium">
            {item.donorName} • {item.location}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low text-[13px] text-on-surface flex flex-col gap-2 border border-surface-container">
          <div className="font-bold text-[11px] text-primary uppercase tracking-wider">
            Handling & Storage Audit Log
          </div>
          <p className="text-on-surface-variant leading-relaxed">{item.safetyNotes}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div className="p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">thermostat</span>
            <span>Prep Temp: &gt; 65°C Verified</span>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            <span className="truncate">{item.fssaiLicense}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-surface-container">
          <span className="text-[11px] font-bold text-on-surface uppercase">Declared Allergens:</span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {item.allergens.map((alg) => (
              <span
                key={alg}
                className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-semibold"
              >
                {alg}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary text-[13px] font-bold hover:bg-surface-tint cursor-pointer"
          >
            Close Safety Audit
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   3. RESCUE TRACE TIMELINE MODAL
----------------------------------------------------- */
interface TimelineModalProps {
  isOpen: boolean;
  item: SurplusFoodItem | null;
  onClose: () => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({ isOpen, item, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-4 border border-surface-container animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">history</span>
            <h3 className="text-[20px] font-bold text-on-surface">Surplus Traceability Log</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="text-[12px] text-on-surface-variant">
          Real-time custody tracking for <span className="font-bold text-on-surface">{item.title}</span> from{' '}
          <span className="font-bold text-on-surface">{item.donorName}</span>
        </div>

        {/* Vertical Timeline */}
        <div className="flex flex-col gap-4 pl-3 border-l-2 border-primary/30 my-2">
          {item.timeline.map((event, idx) => (
            <div key={idx} className="flex flex-col gap-0.5 relative">
              <div className="w-2.5 h-2.5 rounded-full bg-primary absolute -left-[18px] top-1"></div>
              <span className="text-[11px] text-on-surface-variant font-medium">
                {event.time} — {event.actor}
              </span>
              <span className="text-[13px] font-bold text-on-surface">{event.event}</span>
            </div>
          ))}

          <div className="flex flex-col gap-0.5 relative">
            <div className="w-2.5 h-2.5 rounded-full bg-tertiary absolute -left-[18px] top-1"></div>
            <span className="text-[11px] text-on-surface-variant font-medium">
              Now — Open for NGO Claim
            </span>
            <span className="text-[13px] font-bold text-tertiary">
              Pickup window valid until {item.deadline}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface-container text-on-surface text-[13px] font-semibold hover:bg-surface-container-high cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   4. SECTION 80G TAX EXEMPTION CERTIFICATE MODAL
----------------------------------------------------- */
interface TaxReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaxReceiptModal: React.FC<TaxReceiptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-4 border border-secondary-container animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">receipt_long</span>
            <h3 className="text-[18px] font-bold text-on-surface">
              Section 80G Tax Exemption Summary
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-3 font-mono text-[12px]">
          <div className="flex justify-between border-b border-surface-container pb-2">
            <span className="text-on-surface-variant">Certificate No:</span>
            <span className="font-bold text-on-surface">SAP-80G-BLR-2025-0841</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Donor Org:</span>
            <span className="font-bold text-on-surface">Grand Palace Caterers</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">PAN / Tax ID:</span>
            <span className="font-bold text-on-surface">AABCG4920E</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Period:</span>
            <span className="font-bold text-on-surface">FY 2024-25 (Bengaluru Ward)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Total Rescued Food:</span>
            <span className="font-bold text-primary">3,420 Kilograms</span>
          </div>
          <div className="flex justify-between border-t border-surface-container pt-2">
            <span className="text-on-surface-variant font-sans font-bold">Estimated Fair Relief Value:</span>
            <span className="font-sans font-extrabold text-[15px] text-primary">₹3,42,000 INR</span>
          </div>
        </div>

        <div className="text-[11px] text-on-surface-variant leading-relaxed">
          Certified under the Income Tax Act, 1961, Section 80G(5)(vi) through ShareAPlate Foundation Node #BLR-4892. Eligible for corporate CSR and commercial deduction.
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-[13px] font-semibold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              alert('Section 80G Certificate PDF downloaded for Financial Year 2024-25');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-surface-tint text-[13px] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
