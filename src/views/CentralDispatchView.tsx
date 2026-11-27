import React, { useState } from 'react';
import {
  INITIAL_STANDBY_TASKS,
  MAP_IMAGES,
  THERMAL_SENSORS,
  ZONE_CHART_DATASETS,
} from '../data/initialData';
import { NgoKycApplication, StandbyRescueTask, SurplusListing } from '../types';
import { ResilientImage } from '../components/ResilientImage';

interface CentralDispatchViewProps {
  kycQueue: NgoKycApplication[];
  pendingKycCount: number;
  onApproveKyc: (ngoId: string, ngoName: string) => void;
  onSimulateIntake: () => void;
  onShowToast: (msg: string, tone?: 'info' | 'success' | 'warning') => void;
  surplusListings: SurplusListing[];
}

export const CentralDispatchView: React.FC<CentralDispatchViewProps> = ({
  kycQueue,
  pendingKycCount,
  onApproveKyc,
  onSimulateIntake,
  onShowToast,
  surplusListings,
}) => {
  // 3-Stage Volunteer Workflow State Machine (1 = Accept, 2 = OTP, 3 = POD, 4 = Complete)
  const [workflowStage, setWorkflowStage] = useState<1 | 2 | 3 | 4>(1);
  const [pickupOtp, setPickupOtp] = useState('8492');
  const [perishableResolved, setPerishableResolved] = useState(false);
  const [chartMode, setChartMode] = useState<'today' | '7day' | 'predictive'>('7day');
  const [docModalData, setDocModalData] = useState<{ title: string; imageUrl: string } | null>(null);
  const [inspectedTask, setInspectedTask] = useState<StandbyRescueTask | null>(null);
  const [kycIndex, setKycIndex] = useState(0);
  const [approvedNotice, setApprovedNotice] = useState<string | null>(null);

  const activeKyc = kycQueue[kycIndex % Math.max(kycQueue.length, 1)];
  const nextKycItems = kycQueue.filter((item) => item.id !== activeKyc?.id).slice(0, 2);

  const chartData = ZONE_CHART_DATASETS[chartMode];

  const handleAdvanceWorkflow = (nextStage: 2 | 3) => {
    if (nextStage === 3 && pickupOtp.trim().length < 4) {
      onShowToast('Please enter the 4-digit donor handoff PIN to verify.', 'warning');
      return;
    }
    setWorkflowStage(nextStage);
    if (nextStage === 2) {
      onShowToast('Task Accepted. Manoj K. locked to Empire Restaurant handoff.', 'success');
    } else {
      onShowToast(`OTP ${pickupOtp} Verified! 80 portions loaded into thermal container.`, 'success');
    }
  };

  const handleCompleteDelivery = () => {
    setWorkflowStage(4);
    onShowToast(
      'Delivery photo uploaded & geo-validated! Shanti Mandir receipt acknowledged.',
      'success'
    );
  };

  const handleResetWorkflow = () => {
    setWorkflowStage(1);
    onShowToast('Simulation reset to initial state.');
  };

  const handleApproveKycClick = () => {
    if (!activeKyc) return;
    setApprovedNotice(activeKyc.name);
    onApproveKyc(activeKyc.id, activeKyc.name);
  };

  const handleLoadNextApplication = () => {
    setApprovedNotice(null);
    setKycIndex((prev) => prev + 1);
  };

  const handleResolvePerishable = () => {
    setPerishableResolved(true);
    onShowToast("Batch #C-21 successfully rerouted to St. John's Youth Shelter.", 'success');
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Manifest Code',
      'Donor',
      'Locality',
      'Item Title',
      'Quantity',
      'Unit',
      'Dietary',
      'Thermal',
      'Status',
    ];
    const rows = surplusListings.map((item) => [
      item.manifestCode,
      `"${item.donorName}"`,
      item.locality,
      `"${item.title}"`,
      item.quantity,
      item.unit,
      item.dietary,
      item.tempLabel,
      item.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Bengaluru_Central_Manifest_Today.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Downloading Bengaluru_Central_Manifest_Today.csv', 'success');
  };

  const stageLabel =
    workflowStage === 1
      ? 'Stage 1: Awaiting Volunteer Acceptance'
      : workflowStage === 2
      ? 'Stage 2: Arrived at Donor (Pickup Verification)'
      : workflowStage === 3
      ? 'Stage 3: In Transit to Shelter (Delivery Confirmation)'
      : 'Mission Complete: Safe Delivery Verified';

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Operational Ticker / Emergency Broadcast */}
      <div className="mb-6 bg-surface-container-low rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-3 w-3 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
          </span>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-[11px] uppercase tracking-wider text-secondary font-bold shrink-0">
              Autonomous Dispatch
            </span>
            <span className="text-sm text-on-surface truncate">
              BLR Cluster: 18 live automated matches executed in last 12 minutes. Real-time temperature logs 100% nominal.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-surface-container-high text-on-surface-variant text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
            <span className="material-symbols-outlined text-[14px]">timer</span>
            Avg Turnaround: 28m
          </span>
          <button
            type="button"
            onClick={onSimulateIntake}
            className="bg-primary text-on-primary hover:bg-primary-container text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Simulate Urgent Intake
          </button>
        </div>
      </div>

      {/* Platform Command KPIs */}
      <section className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">insights</span>
            <h1 className="font-headline text-lg font-semibold text-primary">
              Platform Command Metrics
            </h1>
          </div>
          <span className="text-[11px] font-semibold text-on-surface-variant">
            Live synced with Bengaluru Metropolitan Supply Grid
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* KPI 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-on-surface-variant">
                Rescues this Month
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">
                local_shipping
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-[32px] leading-10 font-bold text-primary tracking-tight tabular-nums">
                1,420
              </span>
              <span className="text-[11px] text-secondary font-bold tabular-nums">↑ 18.4%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '82%' }} />
            </div>
            <span className="text-[11px] text-outline mt-2 tabular-nums">
              82% of monthly target (1,750)
            </span>
          </div>

          {/* KPI 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-on-surface-variant">
                Pending NGO KYC
              </span>
              <span className="material-symbols-outlined text-tertiary-container text-[20px]">
                badge
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-[32px] leading-10 font-bold text-tertiary-container tracking-tight tabular-nums">
                {pendingKycCount}
              </span>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
                Action Needed
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-tertiary-fixed-dim h-full rounded-full" style={{ width: '45%' }} />
            </div>
            <span className="text-[11px] text-outline mt-2 tabular-nums">
              Avg review time: 4.2 hrs
            </span>
          </div>

          {/* KPI 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-on-surface-variant">
                Volunteers on Road
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">
                two_wheeler
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-[32px] leading-10 font-bold text-primary tracking-tight tabular-nums">
                314
              </span>
              <span className="text-[11px] text-secondary font-bold">Active</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-secondary-container h-full rounded-full" style={{ width: '91%' }} />
            </div>
            <span className="text-[11px] text-outline mt-2 tabular-nums">
              89 in transit, 225 on standby
            </span>
          </div>

          {/* KPI 4 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-on-surface-variant">
                Food Safety Rating
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">
                health_and_safety
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-[32px] leading-10 font-bold text-primary tracking-tight tabular-nums">
                99.1%
              </span>
              <span className="text-[11px] text-secondary font-bold">Grade A</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '99.1%' }} />
            </div>
            <span className="text-[11px] text-outline mt-2">FSSAI audit compliant (Q3)</span>
          </div>

          {/* KPI 5 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-on-surface-variant">
                Incident Escalations
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">
                verified
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-[32px] leading-10 font-bold text-primary tracking-tight tabular-nums">
                0
              </span>
              <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                Zero Breach
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '100%' }} />
            </div>
            <span className="text-[11px] text-outline mt-2">
              Consecutive 42 days faultless
            </span>
          </div>
        </div>
      </section>

      {/* Main Dual Workspace: Dispatch Controller & NGO KYC Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* LEFT: Interactive Volunteer Dispatch Feed (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-headline text-lg font-semibold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary">moped</span>
                Live Rescue Dispatch &amp; Volunteer Simulation
              </h2>
              <p className="text-xs text-on-surface-variant">
                Active field routing with telemetry &amp; digital chain-of-custody verification
              </p>
            </div>
            <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
              Live Stream
            </span>
          </div>

          {/* Primary Action Interactive Card (Task #BFR-8891) */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-container">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs bg-primary text-on-primary px-2.5 py-1 rounded-md font-bold font-mono">
                  #BFR-8891
                </span>
                <span className="text-[11px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded font-bold flex items-center gap-1 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  Expiring in 1h 45m
                </span>
                <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-medium whitespace-nowrap">
                  Hot Cooked Meals (80 pax)
                </span>
              </div>
              <div className="flex items-center gap-1 text-secondary text-xs font-semibold whitespace-nowrap tabular-nums">
                <span className="material-symbols-outlined text-[18px]">near_me</span>
                <span>3.4 km • ETA 12 mins</span>
              </div>
            </div>

            {/* Route Nodes */}
            <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-on-primary">
                    <span className="material-symbols-outlined text-[18px]">restaurant</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">
                      Pickup Donor
                    </span>
                    <h3 className="text-sm font-semibold text-on-surface truncate">
                      Empire Restaurant, Church St.
                    </h3>
                    <p className="text-xs text-on-surface-variant truncate">
                      Tray Sealed • Biryani &amp; Dal • Pack temp: 64°C
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-outline pt-2 border-t border-surface-container">
                  <span className="tabular-nums">Donor PIN: 560001</span>
                  <span className="text-secondary text-[11px] font-semibold">
                    Verified Safe Pack
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-on-secondary">
                    <span className="material-symbols-outlined text-[18px]">holiday_village</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">
                      Destination Shelter
                    </span>
                    <h3 className="text-sm font-semibold text-on-surface truncate">
                      Shanti Mandir Night Shelter
                    </h3>
                    <p className="text-xs text-on-surface-variant truncate">
                      Capacity: 120 Beds • Wilson Garden Gate #2
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-outline pt-2 border-t border-surface-container">
                  <span>Contact: Br. Anand K.</span>
                  <span className="text-secondary text-[11px] font-semibold">
                    Pre-notified &amp; Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Simulation Interactive Lifecycle Controller */}
            <div className="bg-surface-container p-4 rounded-xl mt-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs text-primary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">sports_score</span>
                  Volunteer Workflow Simulation Box
                </span>
                <span className="text-[11px] bg-primary-container text-on-primary px-2.5 py-0.5 rounded-full font-bold">
                  {stageLabel}
                </span>
              </div>

              {/* Step Progression Timeline */}
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div
                  className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-all ${
                    workflowStage === 1
                      ? 'bg-primary text-on-primary'
                      : 'bg-secondary text-on-secondary'
                  }`}
                >
                  1. Accept Task
                </div>
                <div
                  className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-all ${
                    workflowStage === 2
                      ? 'bg-primary text-on-primary'
                      : workflowStage > 2
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  2. OTP &amp; QR Verify
                </div>
                <div
                  className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-all ${
                    workflowStage === 3
                      ? 'bg-primary text-on-primary'
                      : workflowStage === 4
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  3. Proof of Delivery
                </div>
              </div>

              {/* Dynamic Action Panel */}
              {workflowStage === 1 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-on-surface block">
                        Candidate: Manoj Kumar (EV Moped #KA-03-HM-4109)
                      </span>
                      <span className="text-xs text-outline">
                        Distance to pickup: 450m • Rating 4.97 ★
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdvanceWorkflow(2)}
                    className="w-full sm:w-auto bg-primary text-on-primary hover:bg-primary-container text-xs px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Accept &amp; Lock Task
                  </button>
                </div>
              )}

              {workflowStage === 2 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-lowest p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-[28px]">
                      qr_code_scanner
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-on-surface block">
                        At Empire Restaurant Kitchen Counter
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Scan thermal container code or input donor handoff PIN
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      aria-label="Donor pickup OTP"
                      className="w-24 text-center font-mono text-base bg-surface-container rounded-lg py-1.5 px-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary font-bold tracking-widest"
                      maxLength={4}
                      type="text"
                      value={pickupOtp}
                      onChange={(e) => setPickupOtp(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleAdvanceWorkflow(3)}
                      className="bg-secondary text-on-secondary hover:bg-primary text-xs px-4 py-2.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      Verify Pickup OTP
                    </button>
                  </div>
                </div>
              )}

              {workflowStage === 3 && (
                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface block font-semibold">
                        Arrived at Shanti Mandir NGO
                      </span>
                      <span className="text-xs text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        Recipient Confirmed: Sister Theresa
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCompleteDelivery}
                    className="w-full md:w-auto bg-primary text-on-primary hover:bg-primary-container text-xs px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[18px]">camera</span>
                    Upload Safe Photo &amp; Complete
                  </button>
                </div>
              )}

              {workflowStage === 4 && (
                <div className="p-3 bg-secondary-container text-on-secondary-container rounded-lg flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[24px] text-secondary">
                      task_alt
                    </span>
                    <div>
                      <span className="text-xs font-bold block">
                        Delivery Protocol Fully Authenticated
                      </span>
                      <span className="text-xs">
                        Audit Certificate #SHA-2023-BLR8891 registered to safety ledger.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetWorkflow}
                    className="text-xs bg-primary text-on-primary px-3 py-1.5 rounded font-bold hover:bg-primary-container transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Reset Demo
                  </button>
                </div>
              )}
            </div>

            {/* Real-time Dispatch Map Snapshot */}
            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                  Telemetry Routing: Empire Church St → Shanti Mandir
                </span>
                <span className="text-[11px] text-secondary font-bold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  Congestion: Minimal (MG Road Underpass Clear)
                </span>
              </div>
              <div className="w-full h-44 rounded-lg overflow-hidden shadow-inner relative flex items-end">
                <ResilientImage
                  src={MAP_IMAGES.dispatchTelemetry}
                  alt="Bengaluru telemetry routing map from Indiranagar to Wilson Garden"
                  className="absolute inset-0 w-full h-full object-cover"
                  fallbackIcon="map"
                  fallbackTitle="Indiranagar → Wilson Garden Route"
                />
                <div className="relative z-10 m-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-md flex items-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    electric_moped
                  </span>
                  <span className="text-[11px] font-semibold text-on-surface tabular-nums">
                    Volunteer Manoj K. current speed: 32 km/h
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Standby Rescue Queue */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline text-lg font-semibold text-primary">
                Standby Rescue Queue
              </h3>
              <span className="text-[11px] font-semibold text-outline tabular-nums">
                {INITIAL_STANDBY_TASKS.length +
                  surplusListings.filter((s) => s.status === 'awaiting_claim').length}{' '}
                waiting dispatchers
              </span>
            </div>
            <div className="space-y-2">
              {INITIAL_STANDBY_TASKS.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors bg-surface-container/30 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        task.tone === 'secondary' ? 'bg-secondary' : 'bg-tertiary'
                      }`}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-on-surface block truncate">
                        {task.routeTitle}
                      </span>
                      <p className="text-xs text-outline truncate">{task.payloadSummary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded whitespace-nowrap ${
                        task.tone === 'secondary'
                          ? 'text-on-surface-variant bg-surface-container'
                          : 'text-on-tertiary-fixed bg-tertiary-fixed'
                      }`}
                    >
                      {task.statusLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspectedTask(task)}
                      className="text-secondary hover:text-primary p-1 cursor-pointer"
                      title="Inspect route"
                      aria-label={`Inspect ${task.routeTitle}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: NGO Document Review & KYC Verification Queue (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-headline text-lg font-semibold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary">verified</span>
                NGO KYC Compliance Queue
              </h2>
              <p className="text-xs text-on-surface-variant">
                Review Section 80G, FSSAI, &amp; Kitchen Cold Chain readiness
              </p>
            </div>
            <span className="text-[11px] bg-surface-container-high text-on-surface px-2.5 py-1 rounded font-bold whitespace-nowrap tabular-nums">
              {pendingKycCount} Pending
            </span>
          </div>

          {/* Active Review Application Card */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm relative flex flex-col justify-between">
            {approvedNotice ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[48px] text-secondary mb-2">
                  task_alt
                </span>
                <h3 className="font-headline text-lg font-semibold text-primary mb-1">
                  {approvedNotice} Approved
                </h3>
                <p className="text-xs text-on-surface-variant mb-4 max-w-xs">
                  Credentials committed to registry. NGO can now receive automated surplus dispatches.
                </p>
                <button
                  type="button"
                  onClick={handleLoadNextApplication}
                  className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Load Next Application
                </button>
              </div>
            ) : (
              activeKyc && (
                <>
                  <div>
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-headline text-base font-bold shrink-0">
                          {activeKyc.initials}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-headline text-lg font-semibold text-on-surface truncate">
                            {activeKyc.name}
                          </h3>
                          <span className="text-xs text-outline block truncate">
                            {activeKyc.trustReg}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded font-bold shrink-0">
                        {activeKyc.statusBadge}
                      </span>
                    </div>

                    {/* Audit Overview Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="bg-surface-container-low p-2.5 rounded-lg">
                        <span className="text-[11px] text-outline block">Beneficiary Target</span>
                        <span className="font-semibold text-on-surface">
                          {activeKyc.beneficiaryTarget}
                        </span>
                      </div>
                      <div className="bg-surface-container-low p-2.5 rounded-lg">
                        <span className="text-[11px] text-outline block">Location Facility</span>
                        <span className="font-semibold text-on-surface">
                          {activeKyc.locationFacility}
                        </span>
                      </div>
                    </div>

                    {/* Submitted Digital Credentials */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block">
                        Submitted Digital Credentials
                      </span>
                      {activeKyc.docs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 px-3 bg-surface-container-low rounded-lg gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                              {doc.icon}
                            </span>
                            <div className="min-w-0">
                              <span className="text-xs text-on-surface block font-medium truncate">
                                {doc.title}
                              </span>
                              <span className="text-[11px] text-secondary block truncate">
                                {doc.subtitle}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setDocModalData({
                                title: doc.previewLabel,
                                imageUrl: MAP_IMAGES.certDocument,
                              })
                            }
                            className="text-secondary hover:text-primary text-[11px] font-semibold flex items-center gap-0.5 shrink-0 cursor-pointer"
                          >
                            Inspect
                            <span className="material-symbols-outlined text-[15px]">
                              open_in_new
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Facility Video Audit Snapshot */}
                    <div className="mb-4">
                      <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block mb-1.5">
                        Facility Video Audit Snapshot
                      </span>
                      <div className="relative rounded-lg overflow-hidden h-28 bg-surface-container">
                        <ResilientImage
                          src={activeKyc.facilityPhotoUrl}
                          alt="Clean commercial community kitchen with stainless steel worktables and storage bins"
                          className="w-full h-full object-cover"
                          fallbackIcon="videocam"
                          fallbackTitle="Kitchen Audit Snapshot"
                        />
                        <div className="absolute bottom-2 left-2 bg-primary/85 backdrop-blur-sm text-on-primary text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">videocam</span>
                          <span>{activeKyc.facilityCoords}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decision Triage Buttons */}
                  <div className="pt-3 border-t border-surface-container flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleApproveKycClick}
                        className="flex-1 bg-primary text-on-primary hover:bg-primary-container text-xs py-2.5 rounded-lg font-bold flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        Approve Verification
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onShowToast(
                            `Request sent to ${activeKyc.name} for supplemental documentation.`
                          )
                        }
                        className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs px-4 py-2.5 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          contact_support
                        </span>
                        Request Info
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onShowToast(
                          `Flagged ${activeKyc.name} for field safety re-audit.`,
                          'warning'
                        )
                      }
                      className="text-error hover:bg-error-container/30 text-[11px] font-semibold py-1.5 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                      Flag for In-Person Re-Inspection
                    </button>
                  </div>
                </>
              )
            )}
          </div>

          {/* Next in Queue */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block mb-2">
              Next in Queue
            </span>
            <div className="divide-y divide-surface-container">
              {nextKycItems.map((ngo) => (
                <div
                  key={ngo.id}
                  className="py-2.5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-xs text-on-surface block font-medium truncate">
                      {ngo.name}
                    </span>
                    <span className="text-xs text-outline truncate block">
                      {ngo.locationFacility} • {ngo.beneficiaryTarget}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const idx = kycQueue.findIndex((k) => k.id === ngo.id);
                      if (idx !== -1) {
                        setApprovedNotice(null);
                        setKycIndex(idx);
                      }
                    }}
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded whitespace-nowrap cursor-pointer ${
                      ngo.statusTone === 'ready'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    {ngo.statusBadge}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Food Safety & Cold Chain Monitor Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="font-headline text-lg font-semibold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary">device_thermostat</span>
              Food Safety &amp; FSSAI Compliance Monitor
            </h2>
            <p className="text-xs text-on-surface-variant">
              Continuous IoT probe tracking, bacterial safe zones, and perishable transit audits
            </p>
          </div>
          <span className="text-[11px] font-semibold bg-surface-container-high text-on-surface px-3 py-1 rounded-full flex items-center gap-1.5 self-start md:self-auto whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            14 Active IoT Thermal Sensors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {THERMAL_SENSORS.map((sensor) => (
            <div
              key={sensor.id}
              className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs text-on-surface-variant font-medium">
                    {sensor.title}
                  </span>
                  <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold whitespace-nowrap">
                    {sensor.statusLabel}
                  </span>
                </div>
                <div className="flex items-center gap-4 my-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-headline text-lg font-extrabold shrink-0 tabular-nums ${
                      sensor.kind === 'cold'
                        ? 'bg-secondary-container/50 text-secondary'
                        : 'bg-surface-container-highest text-primary'
                    }`}
                  >
                    {sensor.reading}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-outline block">
                      {sensor.targetLabel}
                    </span>
                    <span className="text-xs text-on-surface font-semibold block">
                      {sensor.deviceLabel}
                    </span>
                    <span className="text-[11px] text-secondary block mt-0.5">
                      {sensor.subStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-surface-container">
                <div className="flex justify-between text-xs text-outline mb-1">
                  <span>{sensor.footerLabel}</span>
                  <span className="text-primary font-semibold tabular-nums">
                    {sensor.footerValue}
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full"
                    style={{ width: `${sensor.progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Card 3: Shelf-life Warning Audit & Auto-divert */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs text-on-surface-variant font-medium">
                  High Perishability Alert
                </span>
                <span className="text-[11px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded font-bold whitespace-nowrap">
                  45 min window
                </span>
              </div>
              <div className="flex items-start gap-3 my-2">
                <span className="material-symbols-outlined text-tertiary-container text-[28px] shrink-0">
                  notification_important
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-on-surface">
                    Bakery Confectionery Batch #C-21
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Fresh cream pastries from Lavelle Road Cafe. Ambient temperature limit approaching threshold.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-surface-container flex items-center justify-between gap-2">
              <span className="text-xs text-outline">
                Auto-diverted to: St. John&apos;s Youth Shelter (1.1 km away)
              </span>
              <button
                type="button"
                disabled={perishableResolved}
                onClick={handleResolvePerishable}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                  perishableResolved
                    ? 'bg-secondary text-on-secondary cursor-default'
                    : 'bg-primary hover:bg-primary-container text-on-primary'
                }`}
              >
                {perishableResolved ? 'Rerouted ✓' : 'Confirm Route'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bengaluru City Food Waste & Demand Heatmap Analytics */}
      <section className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="font-headline text-lg font-semibold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary">analytics</span>
              Bengaluru City Food Surplus vs. Hunger Deficit Analytics
            </h2>
            <p className="text-xs text-on-surface-variant">
              Real-time zone balance algorithm calculating autonomous rerouting vectors
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {(
              [
                { id: 'today', label: 'Today' },
                { id: '7day', label: '7-Day Trend' },
                { id: 'predictive', label: 'Predictive 48h' },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setChartMode(btn.id)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  chartMode === btn.id
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-highest text-on-surface hover:bg-surface-dim'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Zone Balance Chart (SVG) - 8 Cols */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="text-sm text-primary font-bold">
                  Zone Inventory Equilibrium ({chartData.label})
                </span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-secondary" /> Surplus Donated (kg)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-tertiary-fixed-dim" /> Shelter Deficit (kg)
                  </span>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <svg className="w-full h-64 text-on-surface min-w-[540px]" viewBox="0 0 700 240">
                  <line stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.08" x1="60" x2="680" y1="20" y2="20" />
                  <line stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.08" x1="60" x2="680" y1="70" y2="70" />
                  <line stroke="currentColor" strokeOpacity="0.2" x1="60" x2="680" y1="120" y2="120" />
                  <line stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.08" x1="60" x2="680" y1="170" y2="170" />
                  <line stroke="currentColor" strokeOpacity="0.08" x1="60" x2="680" y1="210" y2="210" />

                  <text className="text-[10px] fill-current opacity-40 font-mono" textAnchor="end" x="50" y="24">
                    +500kg
                  </text>
                  <text className="text-[10px] fill-current opacity-40 font-mono" textAnchor="end" x="50" y="74">
                    +250kg
                  </text>
                  <text className="text-[10px] fill-current font-bold opacity-70 font-mono" textAnchor="end" x="50" y="124">
                    0 kg
                  </text>
                  <text className="text-[10px] fill-current opacity-40 font-mono" textAnchor="end" x="50" y="174">
                    -250kg
                  </text>
                  <text className="text-[10px] fill-current opacity-40 font-mono" textAnchor="end" x="50" y="214">
                    -500kg
                  </text>

                  {chartData.zones.map((zone, index) => {
                    const baseX = 90 + index * 120;
                    const surplusH = Math.round((zone.surplus / 500) * 100);
                    const deficitH = Math.round((zone.deficit / 500) * 100);
                    const surplusY = 120 - surplusH;
                    const showSurplusTop = zone.surplus >= zone.deficit;
                    return (
                      <g key={zone.name}>
                        <rect
                          className="fill-secondary transition-all hover:opacity-80"
                          height={surplusH}
                          rx="4"
                          width="30"
                          x={baseX}
                          y={surplusY}
                        />
                        <rect
                          className="fill-tertiary-fixed-dim transition-all hover:opacity-80"
                          height={deficitH}
                          rx="4"
                          width="30"
                          x={baseX + 35}
                          y={120}
                        />
                        <text
                          className="text-[11px] fill-current font-semibold"
                          textAnchor="middle"
                          x={baseX + 32}
                          y="232"
                        >
                          {zone.name}
                        </text>
                        {showSurplusTop ? (
                          <text
                            className="text-[10px] fill-secondary font-bold font-mono"
                            textAnchor="middle"
                            x={baseX + 15}
                            y={Math.max(surplusY - 6, 12)}
                          >
                            +{zone.surplus}
                          </text>
                        ) : (
                          <text
                            className="text-[10px] fill-tertiary font-bold font-mono"
                            textAnchor="middle"
                            x={baseX + 50}
                            y={Math.min(120 + deficitH + 12, 218)}
                          >
                            -{zone.deficit}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="mt-3 p-3 bg-surface-container rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-on-surface">
                <strong>Optimal Corridor:</strong> {chartData.corridorText}
              </span>
              <span className="text-[11px] text-secondary font-bold whitespace-nowrap tabular-nums">
                CO₂ Saved: {chartData.co2Saved}
              </span>
            </div>
          </div>

          {/* Predictive Demand Forecasting Box - 4 Cols */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-primary font-bold">Predictive Hunger Forecast</span>
                <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
                  Forecast Grid
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">
                Based on festival calendars, monsoon patterns, and corporate kitchen scheduled surplus.
              </p>

              <div className="space-y-3">
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface font-semibold">
                      Friday Night Corporate Spike
                    </span>
                    <span className="text-[11px] text-secondary font-bold tabular-nums">
                      +620 Meals
                    </span>
                  </div>
                  <p className="text-xs text-outline mt-1">
                    IT Parks Outer Ring Road • Scheduled for 21:30 Pickup
                  </p>
                  <div className="w-full bg-surface-container h-1 rounded-full mt-2">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface font-semibold">
                      Weekend Wedding Surplus
                    </span>
                    <span className="text-[11px] text-secondary font-bold tabular-nums">
                      +1,200 Meals
                    </span>
                  </div>
                  <p className="text-xs text-outline mt-1">
                    Palace Grounds Kalyana Mantapas • Heavy evening intake expected
                  </p>
                  <div className="w-full bg-surface-container h-1 rounded-full mt-2">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface font-semibold">
                      Rainfall Transit Contingency
                    </span>
                    <span className="text-[11px] text-tertiary font-bold tabular-nums">
                      ETA +15 min
                    </span>
                  </div>
                  <p className="text-xs text-outline mt-1">
                    IMD alert: Light rain south-east zones from 18:00 hrs
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="w-full mt-4 bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs py-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Full Logistics Audit (CSV)
            </button>
          </div>
        </div>
      </section>

      {/* Document Preview Modal */}
      {docModalData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-xl shadow-2xl p-6 relative flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container mb-4">
              <h3 className="font-headline text-lg font-semibold text-primary">
                {docModalData.title}
              </h3>
              <button
                type="button"
                aria-label="Close document preview"
                onClick={() => setDocModalData(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="h-64 rounded-lg bg-surface-container p-4 flex flex-col items-center justify-center text-center mb-4 overflow-hidden relative">
              <ResilientImage
                src={docModalData.imageUrl}
                alt="Verified Indian Government certification document for charitable trust compliance"
                className="w-full h-full object-contain"
                fallbackIcon="verified"
                fallbackTitle={docModalData.title}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Digital Signature Certified
              </span>
              <button
                type="button"
                onClick={() => setDocModalData(null)}
                className="bg-primary text-on-primary text-xs px-4 py-2 rounded-lg font-bold cursor-pointer"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standby Task Inspection Modal */}
      {inspectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest max-w-md w-full rounded-xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline text-base font-bold text-primary">
                Standby Route Inspection
              </h3>
              <button
                type="button"
                onClick={() => setInspectedTask(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-on-surface text-sm">{inspectedTask.routeTitle}</p>
              <p className="text-on-surface-variant">{inspectedTask.payloadSummary}</p>
              <div className="bg-surface-container-low p-3 rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-outline">Donor Postal PIN:</span>
                  <span className="font-mono font-semibold text-primary">
                    {inspectedTask.donorPin}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Shelter Contact:</span>
                  <span className="font-semibold text-on-surface">{inspectedTask.ngoContact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Transit Distance:</span>
                  <span className="font-semibold text-secondary">{inspectedTask.distanceKm}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onShowToast(`Priority courier pinged for ${inspectedTask.routeTitle}`, 'success');
                setInspectedTask(null);
              }}
              className="w-full bg-primary text-on-primary hover:bg-primary-container text-xs font-bold py-2.5 rounded-lg cursor-pointer"
            >
              Prioritize Volunteer Dispatch
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
