import React, { useState } from 'react';
import { VolunteerMission } from '../types/foodRescue';

interface VolunteerTabProps {
  mission: VolunteerMission;
  onUpdateMissionStage: (stage: 1 | 2 | 3) => void;
  volunteerPoints: number;
  onAddPoints: (pts: number) => void;
}

export const VolunteerTab: React.FC<VolunteerTabProps> = ({
  mission,
  onUpdateMissionStage,
  volunteerPoints,
  onAddPoints,
}) => {
  const [inputOtp, setInputOtp] = useState(mission.otp);
  const [missionStage, setMissionStage] = useState<1 | 2 | 3>(mission.stage);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleAdvanceMission = () => {
    if (!inputOtp.trim()) {
      alert('Please enter or scan the 4-digit verification token.');
      return;
    }

    if (missionStage === 1) {
      setMissionStage(2);
      onUpdateMissionStage(2);
      setFeedbackMsg('✅ Pickup verified at Grand Palace Caterers! Status set to [IN TRANSIT]. Thermal cargo monitoring online.');
      setTimeout(() => setFeedbackMsg(null), 5000);
    } else if (missionStage === 2) {
      setMissionStage(3);
      onUpdateMissionStage(3);
      onAddPoints(50);
      setFeedbackMsg('🎉 Mission Completed! Feeding Hope Shelter confirmed delivery of 85 meals. +50 Volunteer Points awarded!');
      setTimeout(() => setFeedbackMsg(null), 6000);
    }
  };

  const handleResetMission = () => {
    setMissionStage(1);
    onUpdateMissionStage(1);
    setInputOtp(mission.otp);
    setFeedbackMsg(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Volunteer Stats & Gamification Profile */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-surface-container">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-inner font-bold text-[28px] shrink-0">
            <span className="material-symbols-outlined text-[32px]">two_wheeler</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-on-surface">
                Bengaluru Rapid Transit Squad
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                Level 4 Volunteer
              </span>
            </div>
            <p className="text-[14px] text-on-surface-variant">
              Arjun K. / Kavitha S. • 42 Successful Food Rescues Completed • Zero Spillage Record
            </p>
          </div>
        </div>

        {/* Badges earned */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface text-[12px] font-bold flex items-center gap-1.5 border border-surface-container">
            <span className="material-symbols-outlined text-primary text-[16px]">military_tech</span>
            <span>Food Saver Star</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface text-[12px] font-bold flex items-center gap-1.5 border border-surface-container">
            <span className="material-symbols-outlined text-tertiary text-[16px]">speed</span>
            <span>20m Rapid Responder</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface text-[12px] font-bold flex items-center gap-1.5 border border-surface-container">
            <span className="material-symbols-outlined text-secondary text-[16px]">stars</span>
            <span className="text-primary font-extrabold">{volunteerPoints} Rescue Pts</span>
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-secondary-container text-on-secondary-container shadow-md flex items-center justify-between border border-primary/20 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-[13px] font-bold">
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-on-secondary-container hover:text-on-surface">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Active Mission / Route Step Card */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-6 border border-surface-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[12px] text-primary font-bold uppercase tracking-wider">
              Active Rescue Mission #{mission.id.toUpperCase()}
            </span>
            <h3 className="text-[20px] font-bold text-on-surface">
              {mission.donor.split(' ')[0]} Caterers → {mission.shelter.split(' ')[0]} Shelter
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-xs ${
                missionStage === 1
                  ? 'bg-tertiary-container text-on-tertiary-container'
                  : missionStage === 2
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-primary/20 text-primary'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  missionStage === 3 ? 'bg-primary' : 'bg-tertiary animate-pulse'
                }`}
              ></span>
              <span>
                {missionStage === 1
                  ? 'Stage 1: Arrived at Donor (Pickup Verification)'
                  : missionStage === 2
                  ? 'Stage 2: Food In Transit (Temp Audited: 67.4°C)'
                  : 'Stage 3: Delivered & Verified by NGO (Complete)'}
              </span>
            </span>
          </div>
        </div>

        {/* Step-by-Step Route Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div
            className={`p-4 rounded-xl flex flex-col gap-2 transition-all border ${
              missionStage === 1
                ? 'bg-primary-container text-on-primary shadow-sm border-transparent'
                : 'bg-surface-container-low text-on-surface border-surface-container'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase">1. Donor Pickup</span>
              <span className="material-symbols-outlined text-[18px]">
                {missionStage > 1 ? 'check_circle' : 'radio_button_checked'}
              </span>
            </div>
            <div className="font-bold text-[15px]">{mission.donor}</div>
            <div className={`text-[12px] ${missionStage === 1 ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
              {mission.donorAddress} • {mission.quantity}
            </div>
            <div className="text-[11px] opacity-90 mt-1">
              Status: {missionStage > 1 ? 'Handover completed' : 'Awaiting OTP authentication'}
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`p-4 rounded-xl flex flex-col gap-2 transition-all border ${
              missionStage === 2
                ? 'bg-primary-container text-on-primary shadow-sm border-transparent'
                : 'bg-surface-container-low text-on-surface border-surface-container'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase">2. Transit Leg</span>
              <span className="material-symbols-outlined text-[18px]">
                {missionStage > 2
                  ? 'check_circle'
                  : missionStage === 2
                  ? 'radio_button_checked'
                  : 'radio_button_unchecked'}
              </span>
            </div>
            <div className="font-bold text-[15px]">Thermal Cargo Box #08</div>
            <div className={`text-[12px] ${missionStage === 2 ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
              Distance: {mission.distance} • Est. {mission.estMinutes} mins
            </div>
            <div className="text-[11px] mt-1">
              Temp Sensor: {missionStage >= 2 ? '67.4°C Target Maintained' : 'Pending dispatch'}
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`p-4 rounded-xl flex flex-col gap-2 transition-all border ${
              missionStage === 3
                ? 'bg-primary-container text-on-primary shadow-sm border-transparent'
                : 'bg-surface-container-low text-on-surface border-surface-container'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase">3. Shelter Drop-off</span>
              <span className="material-symbols-outlined text-[18px]">
                {missionStage === 3 ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </div>
            <div className="font-bold text-[15px]">{mission.shelter}</div>
            <div className={`text-[12px] ${missionStage === 3 ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
              {mission.shelterAddress}
            </div>
            <div className="text-[11px] mt-1">
              NGO Contact: {mission.ngoContact}
            </div>
          </div>
        </div>

        {/* SIMULATED QR & OTP CODE VERIFICATION INTERACTION */}
        <div className="p-6 rounded-xl bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-6 border border-surface-container">
          <div className="flex flex-col gap-2">
            <h4 className="text-[15px] text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">qr_code_scanner</span>
              <span>Interactive Verification Simulator</span>
            </h4>
            <p className="text-[13px] text-on-surface-variant max-w-lg">
              Simulate donor handoff using the 4-digit token or scan code to advance status. The digital custody chain updates the municipal ledger instantaneously.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-[12px] text-on-surface-variant font-semibold">Active Rescue OTP:</span>
              <span className="px-3 py-1 rounded-lg bg-surface-container-lowest text-[18px] text-primary tracking-widest font-mono font-bold border border-primary/20 shadow-xs">
                {mission.otp}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {missionStage < 3 ? (
              <>
                <input
                  type="text"
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value.toUpperCase())}
                  placeholder="Enter Token..."
                  className="w-full sm:w-36 px-3 py-2.5 rounded-xl bg-surface-container-lowest text-center font-bold font-mono text-on-surface uppercase focus:outline-none border border-surface-container"
                />
                <button
                  onClick={handleAdvanceMission}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-surface-tint text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>
                    {missionStage === 1 ? 'Verify Pickup at Donor' : 'Confirm NGO Shelter Delivery'}
                  </span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 rounded-xl bg-primary/20 text-primary font-bold text-[13px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  <span>Mission Completed (+50 Pts)</span>
                </span>
                <button
                  onClick={handleResetMission}
                  className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-[12px] font-semibold text-on-surface cursor-pointer"
                >
                  Reset Simulation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Volunteer Pickups in Bengaluru Radius */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[20px] font-bold text-on-surface">
          More Missions In Need of Volunteer Transit
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-4 border border-surface-container hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">electric_moped</span>
              </div>
              <div>
                <div className="text-[14px] font-bold text-on-surface">
                  Koramangala Bakery → Akshaya Mitra
                </div>
                <div className="text-[12px] text-on-surface-variant">
                  45 Loaves • 3.2 km trip • Ready now
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                alert('Mission accepted! Transit route and contact coordinates sent to your SMS and Google Maps.')
              }
              className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-[12px] font-bold cursor-pointer whitespace-nowrap"
            >
              Accept Task
            </button>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-4 border border-surface-container hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">electric_rickshaw</span>
              </div>
              <div>
                <div className="text-[14px] font-bold text-on-surface">
                  Electronic City → Samarth Shelter
                </div>
                <div className="text-[12px] text-on-surface-variant">
                  140 Trays (Large load) • e-Van Needed
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                alert('Cargo van dispatched! Partnering with Bengaluru EV delivery fleet.')
              }
              className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-[12px] font-bold cursor-pointer whitespace-nowrap"
            >
              Accept Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
