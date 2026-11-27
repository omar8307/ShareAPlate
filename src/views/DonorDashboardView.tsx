import React, { useRef, useState } from 'react';
import { MAP_IMAGES } from '../data/initialData';
import { SurplusListing, ThermalHolding } from '../types';
import { QrHandoverModal } from '../components/QrHandoverModal';
import { ResilientImage } from '../components/ResilientImage';

interface DonorDashboardViewProps {
  listings: SurplusListing[];
  onAddListing: (listing: Omit<SurplusListing, 'id' | 'manifestCode' | 'status'>) => void;
  onCancelListing: (id: string) => void;
  onBumpListing: (id: string) => void;
  onShowToast: (msg: string, tone?: 'info' | 'success' | 'warning') => void;
}

type DonorTab = 'overview' | 'create' | 'manifest' | 'schedules' | 'forecasts';

export const DonorDashboardView: React.FC<DonorDashboardViewProps> = ({
  listings,
  onAddListing,
  onCancelListing,
  onBumpListing,
  onShowToast,
}) => {
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const forecastSectionRef = useRef<HTMLDivElement | null>(null);
  const manifestSectionRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<DonorTab>('overview');
  const [foodName, setFoodName] = useState(
    'South Indian Banquet Spread - Curried Lentils, Steamed Rice & Poriyal'
  );
  const [foodCategory, setFoodCategory] = useState<SurplusListing['category']>('cooked');
  const [diet, setDiet] = useState<'veg' | 'nonveg'>('veg');
  const [portionQty, setPortionQty] = useState(65);
  const [portionUnit, setPortionUnit] = useState<'meals' | 'kg' | 'crates'>('meals');
  const [prepTime, setPrepTime] = useState('16:45');
  const [thermalHolding, setThermalHolding] = useState<ThermalHolding>('hot');
  const [fssaiNotice, setFssaiNotice] = useState('');
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false);
  const [noticeAttached, setNoticeAttached] = useState(false);
  const [pickupNode, setPickupNode] = useState<SurplusListing['locality']>('Indiranagar');
  const [donorContact, setDonorContact] = useState('Chef Ramesh K. (+91 98450 11982)');
  const [autoCourierLocked, setAutoCourierLocked] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [qrModalData, setQrModalData] = useState<{
    manifestId: string;
    shelterName: string;
    volunteerName: string;
    payload: string;
  } | null>(null);

  const donorListings = listings.filter(
    (l) =>
      l.donorName.includes('Grand Bengaluru') ||
      l.id.startsWith('donor-new-') ||
      l.status !== 'delivered'
  ).slice(0, 5);

  const activeCount = donorListings.length;

  const urgencyMeta =
    thermalHolding === 'hot'
      ? {
          badge: 'High Urgency (Thermal < 2h)',
          badgeClass: 'bg-tertiary-container text-on-tertiary-container',
          subtext: '1 hr 45 min Safe Window',
          discClass: 'bg-tertiary-fixed text-tertiary',
        }
      : thermalHolding === 'cold'
      ? {
          badge: 'Optimal Cold-Chain',
          badgeClass: 'bg-secondary text-on-secondary',
          subtext: '4 hr 00 min Safe Window',
          discClass: 'bg-secondary-container text-secondary',
        }
      : {
          badge: 'Standard Dry Rescue',
          badgeClass: 'bg-surface-container-highest text-on-surface',
          subtext: '6 hr Safe Window',
          discClass: 'bg-surface-container text-primary',
        };

  const handleGenerateFssaiNotice = () => {
    setIsGeneratingNotice(true);
    setTimeout(() => {
      const dietStr =
        diet === 'veg' ? '100% Lacto-Vegetarian' : 'Contains Non-Vegetarian protein';
      const holdingText =
        thermalHolding === 'hot'
          ? 'Hot-held >60°C in sealed stainless cambros'
          : thermalHolding === 'cold'
          ? 'Blast-chilled <5°C cold-chain validated'
          : 'Ambient moisture-sealed bakery packaging';

      setFssaiNotice(
        `FSSAI Sec-31 Compliance: Prepared under hygienic supervision at ${prepTime} IST. Item: ${foodName}. Diet: ${dietStr}. Thermal holding: ${holdingText}. Expeditor: ${donorContact}. Consume within safe dispatch window.`
      );
      setIsGeneratingNotice(false);
      setNoticeAttached(true);
      onShowToast('Safe FSSAI allergen & handling notice generated.', 'success');
    }, 350);
  };

  const handleSubmitSurplus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    const tempLabel =
      thermalHolding === 'hot'
        ? 'Hot-held at 64°C'
        : thermalHolding === 'cold'
        ? 'Chilled at 3.8°C'
        : 'Ambient dry sealed';

    onAddListing({
      donorName: 'The Grand Bengaluru Bistro & Banquets',
      donorLocation: `${pickupNode} 100ft Hub • Zone A-4`,
      locality: pickupNode,
      category: foodCategory,
      title: `${portionQty} ${portionUnit === 'meals' ? 'Portions' : portionUnit} ${foodName}`,
      description:
        fssaiNotice ||
        `Prepared at ${prepTime} IST. Dispatched by ${donorContact} with sealed FSSAI packaging.`,
      quantity: portionQty,
      unit: portionUnit,
      dietary: diet === 'veg' ? 'Pure Veg' : 'Non-Veg',
      thermalHolding,
      tempLabel,
      expiryLabel: urgencyMeta.subtext,
      urgent: thermalHolding === 'hot',
      distanceKm: 0.9,
      rating: 4.9,
      handlingSpec: tempLabel,
      viewersCount: 3,
      fssaiNotice,
    });

    setNoticeAttached(false);
    setFssaiNotice('');
    onShowToast(
      `Surplus Batch (${portionQty} ${portionUnit}) registered and broadcasted to 3 vetted Bengaluru shelters.`,
      'success'
    );
  };

  const handleTabClick = (tab: DonorTab) => {
    setActiveTab(tab);
    if (tab === 'create') {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'manifest') {
      manifestSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'forecasts') {
      forecastSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const weeklyBars = [
    { day: 'M', val: '12k', height: '35%', highlight: false },
    { day: 'T', val: '14k', height: '40%', highlight: false },
    { day: 'W', val: '18k', height: '48%', highlight: false },
    { day: 'T', val: '15k', height: '42%', highlight: false },
    { day: 'F', val: '28k', height: '70%', highlight: false },
    { day: 'Sat', val: '35k', height: '95%', highlight: true },
    { day: 'S', val: '22k', height: '60%', highlight: false },
  ];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Operational Donor Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
              Verified Commercial Partner
            </span>
            <span className="inline-flex items-center text-secondary material-symbols-outlined material-symbols-filled text-[16px]">
              verified
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-[32px] sm:leading-10 font-bold text-primary tracking-tight">
            The Grand Bengaluru Bistro &amp; Banquets
          </h1>
          <p className="text-sm text-on-surface-variant">
            FSSAI Lic. #11224333000849 • Node: Indiranagar 100ft Hub • Zone A-4
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setAuditModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            Logistics Audit
          </button>
          <button
            type="button"
            onClick={() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-md cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Post Surplus Batch
          </button>
        </div>
      </div>

      {/* KPI Metric Panels Bento */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-semibold">
            <span>Lifetime Surplus Posts</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">inventory</span>
          </div>
          <div className="mt-3">
            <span className="font-display text-4xl sm:text-[48px] sm:leading-[52px] font-extrabold text-primary tabular-nums">
              {36 + listings.length}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-secondary mt-1 tabular-nums">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+6 this month</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-semibold">
            <span>Active Live Listings</span>
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          </div>
          <div className="mt-3">
            <span className="font-display text-4xl sm:text-[48px] sm:leading-[52px] font-extrabold text-primary tabular-nums">
              {activeCount}
            </span>
            <div className="text-[11px] font-semibold text-on-surface-variant mt-1">
              1 scheduled, {Math.max(activeCount - 1, 1)} live
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-semibold">
            <span>Dignified Meals Fed</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">
              volunteer_activism
            </span>
          </div>
          <div className="mt-3">
            <span className="font-display text-4xl sm:text-[48px] sm:leading-[52px] font-extrabold text-primary tabular-nums">
              3,480
            </span>
            <div className="text-[11px] font-semibold text-secondary mt-1">
              100% verified shelters
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-semibold">
            <span>Total Rescued Biomass</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">eco</span>
          </div>
          <div className="mt-3">
            <span className="font-display text-4xl sm:text-[48px] sm:leading-[52px] font-extrabold text-primary tabular-nums">
              1,390{' '}
              <span className="font-headline text-lg font-normal text-on-surface-variant">kg</span>
            </span>
            <div className="text-[11px] font-semibold text-on-surface-variant mt-1">
              ~2.9 tCO₂e diverted
            </div>
          </div>
        </div>

        <div className="bg-secondary-container/30 col-span-2 lg:col-span-1 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-secondary-container text-[11px] font-semibold">
            <span>Rescue SLA Fulfillment</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">
              verified_user
            </span>
          </div>
          <div className="mt-3">
            <span className="font-display text-4xl sm:text-[48px] sm:leading-[52px] font-extrabold text-secondary tabular-nums">
              98.4%
            </span>
            <div className="text-[11px] font-semibold text-on-secondary-container mt-1">
              Zero dispatch spoilage
            </div>
          </div>
        </div>
      </section>

      {/* Sub Navigation Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {(
          [
            { id: 'overview', label: 'Overview & Manifest' },
            { id: 'create', label: 'Create Donation' },
            { id: 'manifest', label: `Active Manifest (${activeCount})` },
            { id: 'schedules', label: 'Recurring Rescue Schedules' },
            { id: 'forecasts', label: 'AI Waste Forecasts' },
          ] as { id: DonorTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`text-xs font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-sm font-semibold'
                : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recurring Schedules Quick Panel (when selected) */}
      {activeTab === 'schedules' && (
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-headline text-base font-bold text-primary">
              Automated Weekend &amp; Banquet Pickup Schedules
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Every Sat &amp; Sun at 22:00 IST • Pre-assigned EV Van #02 to Asha Sadan &amp; Wilson Garden Hub
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAutoCourierLocked((v) => !v);
              onShowToast(
                autoCourierLocked
                  ? 'Recurring 22:00 auto-courier paused.'
                  : 'Recurring 22:00 auto-courier locked for Sat/Sun.',
                'success'
              );
            }}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            {autoCourierLocked ? '22:00 Auto-Courier Active ✓' : 'Enable 22:00 Auto-Courier'}
          </button>
        </div>
      )}

      {/* Primary Working Console Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Creation Form (7 cols) */}
        <div ref={formSectionRef} className="xl:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    ramen_dining
                  </span>
                  <h2 className="font-headline text-2xl font-semibold text-primary">
                    Post Safe Surplus Batch
                  </h2>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">
                  Enter batch metrics to calculate urgent shelter routing &amp; dispatch courier nodes.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-secondary-container/50 text-secondary px-3 py-1 rounded-full whitespace-nowrap">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                Good Samaritan Shielded
              </span>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmitSurplus}>
              {/* Food Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface" htmlFor="foodName">
                    Surplus Description / Item Title
                  </label>
                  <input
                    id="foodName"
                    required
                    type="text"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    className="w-full h-11 px-4 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="md:col-span-4 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface" htmlFor="foodCategory">
                    Food Category
                  </label>
                  <select
                    id="foodCategory"
                    value={foodCategory}
                    onChange={(e) => setFoodCategory(e.target.value as SurplusListing['category'])}
                    className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="cooked">Cooked Hot Meals</option>
                    <option value="bakery">Bakery &amp; Viennoiserie</option>
                    <option value="groceries">Raw Fresh Produce</option>
                    <option value="packaged">FMCG Sealed Packaged</option>
                  </select>
                </div>
              </div>

              {/* Diet Indicator & Portion Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-on-surface">
                    Dietary Classification
                  </span>
                  <div className="grid grid-cols-2 gap-1 h-11 p-1 bg-surface-container-low rounded-lg">
                    <button
                      type="button"
                      onClick={() => setDiet('veg')}
                      className={`flex items-center justify-center gap-1 rounded text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        diet === 'veg'
                          ? 'bg-secondary text-on-secondary shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-surface-container-lowest" />
                      Pure Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiet('nonveg')}
                      className={`flex items-center justify-center gap-1 rounded text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        diet === 'nonveg'
                          ? 'bg-error text-on-error shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-error" />
                      Non-Veg
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface" htmlFor="portionQty">
                    Quantity Payload
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="portionQty"
                      type="number"
                      min={5}
                      max={1500}
                      required
                      value={portionQty}
                      onChange={(e) => setPortionQty(Number(e.target.value) || 0)}
                      className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface tabular-nums focus:outline-none focus:bg-surface-container-lowest"
                    />
                    <select
                      aria-label="Portion unit"
                      value={portionUnit}
                      onChange={(e) =>
                        setPortionUnit(e.target.value as 'meals' | 'kg' | 'crates')
                      }
                      className="h-11 px-2.5 bg-surface-container-low rounded-lg text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                    >
                      <option value="meals">Portions</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="crates">Crates / Boxes</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface" htmlFor="prepTime">
                    Prep Timestamp
                  </label>
                  <input
                    id="prepTime"
                    type="time"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface tabular-nums focus:outline-none focus:bg-surface-container-lowest"
                  />
                </div>
              </div>

              {/* FSSAI Storage Compliance Baseline */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-on-surface">
                  FSSAI Storage Compliance Baseline
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      val: 'hot' as const,
                      title: 'Hot-Held (>60°C)',
                      sub: 'Bain-marie / Hot cabinets',
                    },
                    {
                      val: 'cold' as const,
                      title: 'Chilled (<5°C)',
                      sub: 'Walk-in blast cold hold',
                    },
                    {
                      val: 'ambient' as const,
                      title: 'Ambient Dry Pack',
                      sub: 'Bakery / Baked dry carbs',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`cursor-pointer flex items-center gap-2.5 p-2.5 rounded-lg transition-colors ${
                        thermalHolding === opt.val
                          ? 'bg-surface-container-high ring-1 ring-primary/30'
                          : 'bg-surface-container-low hover:bg-surface-container-high'
                      }`}
                    >
                      <input
                        type="radio"
                        name="thermalHolding"
                        checked={thermalHolding === opt.val}
                        onChange={() => setThermalHolding(opt.val)}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-primary font-semibold">{opt.title}</span>
                        <span className="text-[11px] text-on-surface-variant">{opt.sub}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* FSSAI Packaging & Allergen Labeling */}
              <div className="flex flex-col gap-2 bg-surface-container-low p-4 rounded-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      psychology
                    </span>
                    <span className="text-xs text-primary font-semibold">
                      FSSAI Packaging &amp; Allergen Labeling
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateFssaiNotice}
                    disabled={isGeneratingNotice}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-on-primary bg-secondary hover:bg-primary px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span
                      className={`material-symbols-outlined text-[14px] ${
                        isGeneratingNotice ? 'animate-spin' : ''
                      }`}
                    >
                      {isGeneratingNotice
                        ? 'refresh'
                        : noticeAttached
                        ? 'done_all'
                        : 'auto_awesome'}
                    </span>
                    <span>
                      {isGeneratingNotice
                        ? 'Generating...'
                        : noticeAttached
                        ? 'Safe Notice Attached'
                        : 'Generate Safe FSSAI Notice'}
                    </span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={fssaiNotice}
                  onChange={(e) => setFssaiNotice(e.target.value)}
                  placeholder="Allergen statement, packaging container standard, and handling advisory will auto-generate here..."
                  className="w-full p-2.5 bg-surface-container-lowest rounded-lg text-xs text-on-surface focus:outline-none resize-none"
                />
              </div>

              {/* Pickup Locality Selector & Expeditor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface" htmlFor="pickupNode">
                    Bengaluru Dispatch Hub
                  </label>
                  <select
                    id="pickupNode"
                    value={pickupNode}
                    onChange={(e) => setPickupNode(e.target.value as SurplusListing['locality'])}
                    className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="Indiranagar">Indiranagar (100ft Rd Bistro Service Bay B)</option>
                    <option value="Koramangala">Koramangala 5th Block (Kitchen Gate 2)</option>
                    <option value="Whitefield">Whitefield EPIP Zone (Tech Park Commissary)</option>
                    <option value="Jayanagar">Jayanagar 4th Block (Main Loading Dock)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface" htmlFor="donorContact">
                    Sous Chef / Expeditor On-Duty
                  </label>
                  <input
                    id="donorContact"
                    type="text"
                    value={donorContact}
                    onChange={(e) => setDonorContact(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                  />
                </div>
              </div>

              {/* Live Urgency Score Calculation Output Module */}
              <div className="bg-surface-container p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${urgencyMeta.discClass}`}
                  >
                    <span className="material-symbols-outlined text-[26px]">alarm</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                        Live Dispatch Grade
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${urgencyMeta.badgeClass}`}
                      >
                        {urgencyMeta.badge}
                      </span>
                    </div>
                    <span className="font-headline text-lg text-primary font-bold">
                      {urgencyMeta.subtext}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Auto-escalates to nearby 3 NGO shelters within 4.2 km radius
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold px-6 py-3 rounded-lg shadow-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Transmit to Rescue Grid
                </button>
              </div>
            </form>
          </div>

          {/* Historical AI Food Waste Prediction Module */}
          <div
            ref={forecastSectionRef}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">insights</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline text-lg font-semibold text-primary">
                    Kitchen Waste &amp; Surplus Diagnostics
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">
                    60-day moving average • Indiranagar Banquet Line
                  </span>
                </div>
              </div>
              <span className="text-[11px] bg-surface-container px-3 py-1 rounded-full text-primary font-semibold whitespace-nowrap">
                Saturday Peak Pattern
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-surface-container-low p-4 rounded-xl">
              <div className="md:col-span-7 flex flex-col gap-1.5">
                <span className="font-headline text-lg text-primary font-bold tabular-nums">
                  35.4 kg Expected Saturday Surplus
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your banquet kitchen reliably generates over-prep on weekend buffets between 21:30 and 23:00. Pre-scheduling rescues avoids last-minute thermal stress.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAutoCourierLocked((v) => !v);
                      onShowToast(
                        autoCourierLocked
                          ? '22:00 Auto-Courier unlocked.'
                          : '22:00 Auto-Courier locked for Saturday surplus.',
                        'success'
                      );
                    }}
                    className={`text-[11px] font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap ${
                      autoCourierLocked
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-primary text-on-primary hover:bg-primary-container'
                    }`}
                  >
                    {autoCourierLocked ? '22:00 Courier Locked ✓' : 'Lock 22:00 Auto-Courier'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onShowToast('Par-level recommendation exported to kitchen prep sheet.')
                    }
                    className="text-[11px] text-secondary hover:text-primary font-bold cursor-pointer whitespace-nowrap"
                  >
                    Adjust Par-Levels →
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col gap-2">
                <div className="flex items-end justify-between h-24 px-2 pt-2 bg-surface-container-lowest rounded-lg">
                  {weeklyBars.map((bar, i) => (
                    <div key={`${bar.day}-${i}`} className="flex flex-col items-center gap-1 w-full h-full justify-end">
                      <span
                        className={`text-[9px] tabular-nums ${
                          bar.highlight ? 'font-bold text-error' : 'text-outline'
                        }`}
                      >
                        {bar.val}
                      </span>
                      <div
                        className={`w-3.5 rounded-t ${
                          bar.highlight ? 'bg-error' : 'bg-secondary-container'
                        }`}
                        style={{ height: bar.height }}
                      />
                      <span
                        className={`text-[10px] ${
                          bar.highlight ? 'font-bold text-error' : 'text-on-surface-variant'
                        }`}
                      >
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-outline px-1 tabular-nums">
                  <span>Avg variance: ±4.1 kg</span>
                  <span className="text-secondary font-bold">Accuracy 94.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Active Manifest & Coverage Map (5 cols) */}
        <div ref={manifestSectionRef} className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  dynamic_feed
                </span>
                <h2 className="font-headline text-lg font-semibold text-primary">
                  Live Active Manifest
                </h2>
              </div>
              <span className="text-[11px] bg-primary-fixed text-on-primary-fixed-variant px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap tabular-nums">
                {activeCount} Ongoing
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {donorListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full bg-secondary ${
                            item.status === 'awaiting_claim' ? 'animate-ping' : ''
                          }`}
                        />
                        <span className="text-xs font-bold font-mono text-primary">
                          {item.manifestCode}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            item.dietary === 'Non-Veg'
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-secondary text-on-secondary'
                          }`}
                        >
                          {item.dietary}
                        </span>
                      </div>
                      <span className="font-headline text-base font-semibold text-on-surface mt-1 truncate">
                        {item.title}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap ${
                        item.status === 'en_route'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : item.status === 'claimed'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-surface-container-high text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {item.status === 'en_route'
                          ? 'electric_moped'
                          : item.status === 'claimed'
                          ? 'schedule'
                          : 'cell_tower'}
                      </span>
                      {item.status === 'en_route'
                        ? 'Volunteer En Route'
                        : item.status === 'claimed'
                        ? item.etaText || 'Claimed'
                        : 'Awaiting Claim'}
                    </span>
                  </div>

                  {item.status === 'awaiting_claim' ? (
                    <div className="bg-surface-container-lowest p-2.5 rounded-lg text-xs text-on-surface-variant flex items-center justify-between gap-2">
                      <span>Broadcasting to 8 certified NGO nodes in Zone A</span>
                      <span className="text-[11px] text-secondary font-bold whitespace-nowrap tabular-nums">
                        {item.viewersCount || 2} NGOs viewing
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest p-2.5 rounded-lg text-xs text-on-surface-variant">
                      <div className="min-w-0">
                        <span className="text-[11px] text-outline block">Destination Shelter:</span>
                        <span className="text-xs text-on-surface font-semibold truncate block">
                          {item.claimedByNgo || 'Matched Shelter'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] text-outline block">Courier / Handling:</span>
                        <span className="text-xs text-on-surface font-semibold truncate block">
                          {item.assignedVolunteer || item.handlingSpec}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 gap-2">
                    {item.status === 'en_route' ? (
                      <div className="flex items-center gap-1 text-error text-[11px] font-bold tabular-nums">
                        <span className="material-symbols-outlined text-[16px]">timer</span>
                        <span>{item.etaText}</span>
                      </div>
                    ) : item.status === 'claimed' ? (
                      <span className="text-xs text-on-surface-variant">
                        Assigned to: {item.assignedVolunteer || 'Shelter Van #02'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-on-surface-variant">{item.tempLabel}</span>
                    )}

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === 'awaiting_claim' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onBumpListing(item.id)}
                            className="bg-secondary text-on-secondary hover:bg-primary text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Bump Alert
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelListing(item.id)}
                            className="text-error hover:bg-error-container/40 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Cancel rescue"
                            aria-label={`Cancel ${item.manifestCode}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setQrModalData({
                              manifestId: item.manifestCode,
                              shelterName: item.claimedByNgo || 'Asha Sadan Shelter',
                              volunteerName: item.assignedVolunteer || 'Arun V. (EV Fleet #14)',
                              payload: `${item.quantity} ${item.unit}`,
                            })
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            item.status === 'en_route'
                              ? 'bg-primary text-on-primary hover:bg-primary-container shadow-xs'
                              : 'bg-surface-container-high hover:bg-surface-container-highest text-primary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {item.status === 'en_route' ? 'qr_code_2' : 'qr_code_scanner'}
                          </span>
                          {item.status === 'en_route' ? 'Handover QR' : 'Verify'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Cluster Coverage Map */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-headline text-lg font-semibold text-primary">
                Active Cluster Coverage
              </span>
              <span className="text-[11px] font-semibold text-secondary">
                Indiranagar 100ft Node
              </span>
            </div>
            <div className="w-full h-44 rounded-lg overflow-hidden shadow-inner relative flex items-end">
              <ResilientImage
                src={MAP_IMAGES.donorCoverage}
                alt="Indiranagar Bengaluru cluster coverage map"
                className="absolute inset-0 w-full h-full object-cover"
                fallbackIcon="location_on"
                fallbackTitle="Indiranagar 15 min Transit Radius"
              />
              <div className="relative z-10 m-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-md text-[11px] text-primary font-semibold">
                • 4 Certified Shelters within 15 min Transit Radius
              </div>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-semibold tabular-nums">
              <span>Avg cold-chain compliance: 99.4%</span>
              <span className="text-primary">Bengaluru Dispatch #BLR-C01</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Handover Modal */}
      <QrHandoverModal
        isOpen={Boolean(qrModalData)}
        onClose={() => setQrModalData(null)}
        manifestId={qrModalData?.manifestId || ''}
        shelterName={qrModalData?.shelterName || ''}
        volunteerName={qrModalData?.volunteerName || ''}
        payload={qrModalData?.payload || ''}
        onPrintReceipt={() => {
          onShowToast('Manifest handover slip sent to kitchen POS terminal.', 'success');
          setQrModalData(null);
        }}
      />

      {/* Logistics Audit Modal */}
      {auditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <h3 className="font-headline text-lg font-bold text-primary">
                Commercial Partner Logistics Audit
              </h3>
              <button
                type="button"
                onClick={() => setAuditModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-3 bg-surface-container-low rounded-lg">
                <span className="text-on-surface-variant">Total Verified Rescues (YTD)</span>
                <span className="font-bold text-primary tabular-nums">42 Batches / 3,480 Meals</span>
              </div>
              <div className="flex justify-between p-3 bg-surface-container-low rounded-lg">
                <span className="text-on-surface-variant">Good Samaritan Legal Shield Status</span>
                <span className="font-bold text-secondary">Active (FSSAI Sec-31)</span>
              </div>
              <div className="flex justify-between p-3 bg-surface-container-low rounded-lg">
                <span className="text-on-surface-variant">Zero-Spoilage SLA Compliance</span>
                <span className="font-bold text-secondary tabular-nums">98.4%</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAuditModalOpen(false)}
              className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-xs font-bold cursor-pointer"
            >
              Close Audit Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
