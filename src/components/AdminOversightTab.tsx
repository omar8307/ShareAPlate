import React, { useState } from 'react';

interface AdminOversightTabProps {
  onSimulateNewSurplus: () => void;
}

export const AdminOversightTab: React.FC<AdminOversightTabProps> = ({
  onSimulateNewSurplus,
}) => {
  const [kycQueue, setKycQueue] = useState([
    {
      id: 'kyc-1',
      orgName: 'Sneha Care Home (Sarjapur)',
      type: 'Children Rehabilitation Shelter',
      capacity: '80 residents',
      docs: 'FSSAI #11221332000781 + Trust Deed',
      status: 'Pending Review',
    },
    {
      id: 'kyc-2',
      orgName: 'Majestic Night Shelter Network',
      type: 'Homeless Transit Center',
      capacity: '150 beds',
      docs: 'Govt BBMP Registered #BBMP-NGO-912',
      status: 'Pending Review',
    },
    {
      id: 'kyc-3',
      orgName: 'Marathahalli Community Langar',
      type: 'Community Relief Kitchen',
      capacity: '200 meals daily',
      docs: 'Trust Registration + Food Safety Audit',
      status: 'Pending Review',
    },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleApproveKYC = (id: string, name: string) => {
    setKycQueue(kycQueue.filter((k) => k.id !== id));
    setToastMsg(`✅ ${name} verified and issued Digital Rescue Node ID.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Toast */}
      {toastMsg && (
        <div className="p-4 rounded-xl bg-secondary-container text-on-secondary-container shadow-md flex items-center justify-between border border-primary/20 animate-in fade-in duration-200">
          <span className="font-bold text-[13px]">{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="text-on-secondary-container">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Cluster Node Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-on-surface-variant uppercase">
              Bengaluru Mesh Nodes
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
          </div>
          <div className="text-[28px] font-extrabold text-on-surface leading-none tabular-nums">
            6 / 6 Live
          </div>
          <div className="text-[11px] text-primary font-medium">
            Indiranagar, Koramangala, Whitefield, E-City, HSR, MG Rd
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-on-surface-variant uppercase">
              Cold Chain Integrity
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">thermostat</span>
          </div>
          <div className="text-[28px] font-extrabold text-primary leading-none tabular-nums">
            99.8% Pass
          </div>
          <div className="text-[11px] text-on-surface-variant">
            Hot carriers maintained &gt;65°C throughout
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-on-surface-variant uppercase">
              Avg Emergency Pickup
            </span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">timer</span>
          </div>
          <div className="text-[28px] font-extrabold text-tertiary leading-none tabular-nums">
            28 mins
          </div>
          <div className="text-[11px] text-on-surface-variant">
            From kitchen posting to volunteer arrival
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-on-surface-variant uppercase">
              OTP Settlement Rate
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">task_alt</span>
          </div>
          <div className="text-[28px] font-extrabold text-secondary leading-none tabular-nums">
            100%
          </div>
          <div className="text-[11px] text-on-surface-variant">Zero unresolved custody disputes</div>
        </div>
      </div>

      {/* Main Admin Section: KYC Verification Queue & Simulation Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Verification Queue */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-5 border border-surface-container">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[20px] font-bold text-on-surface">NGO & Shelter Verification Queue</h3>
              <p className="text-[13px] text-on-surface-variant">
                Shelters must submit valid 80G documentation, address proof, and food handling certifications.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-[11px] font-bold">
              {kycQueue.length} Pending
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {kycQueue.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-low rounded-xl text-[13px] text-on-surface-variant font-medium">
                All shelter applications processed. The network registry is fully up to date.
              </div>
            ) : (
              kycQueue.map((k) => (
                <div
                  key={k.id}
                  className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-surface-container"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[15px] text-on-surface">{k.orgName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-medium">
                        {k.type}
                      </span>
                    </div>
                    <span className="text-[12px] text-on-surface-variant">Capacity: {k.capacity}</span>
                    <span className="text-[11px] text-outline font-mono">{k.docs}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApproveKYC(k.id, k.orgName)}
                      className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-surface-tint text-[12px] font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Approve & Verify
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Simulation Controls & Cluster Sandbox */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-5 border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
            <h3 className="text-[18px] font-bold text-on-surface">Network Sandbox Controls</h3>
          </div>
          <p className="text-[13px] text-on-surface-variant">
            Trigger demo operational events to observe automated AI matching and volunteer route calculations.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onSimulateNewSurplus();
                alert('Surplus Event Triggered: 90 hot meals added in Whitefield ITPL. Notification broadcast to 3 shelters.');
              }}
              className="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <div className="font-bold text-[13px] text-on-surface group-hover:text-primary">
                  Simulate Buffet Surplus
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  Add 90 hot meals at Whitefield ITPL
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-[20px]">add_alert</span>
            </button>

            <button
              onClick={() => {
                alert('Monsoon Contingency Activated: Average pickup time threshold adjusted to 45 mins. Cargo e-rickshaws prioritized.');
              }}
              className="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <div className="font-bold text-[13px] text-on-surface group-hover:text-primary">
                  Monsoon Route Buffer
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  Adjust transit SLA for urban rain delay
                </div>
              </div>
              <span className="material-symbols-outlined text-tertiary text-[20px]">rainy</span>
            </button>

            <button
              onClick={() => {
                alert('System Health Check: All 48 shelter contact phone numbers and OTP webhooks responded in <120ms.');
              }}
              className="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <div className="font-bold text-[13px] text-on-surface group-hover:text-primary">
                  Run Registry Ping Audit
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  Verify 48 shelter hotlines and SMS webhooks
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary text-[20px]">network_check</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
