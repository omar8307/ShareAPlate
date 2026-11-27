import React, { useMemo, useState } from 'react';
import { MAP_IMAGES } from '../data/initialData';
import { SurplusListing, UnmetNeed } from '../types';
import { QrHandoverModal } from '../components/QrHandoverModal';
import { ResilientImage } from '../components/ResilientImage';

interface NgoDiscoveryViewProps {
  listings: SurplusListing[];
  unmetNeeds: UnmetNeed[];
  onClaimListing: (listingId: string, ngoName: string) => void;
  onPostUnmetNeed: (need: Omit<UnmetNeed, 'id' | 'postedAt'>) => void;
  onShowToast: (msg: string, tone?: 'info' | 'success' | 'warning') => void;
}

export const NgoDiscoveryView: React.FC<NgoDiscoveryViewProps> = ({
  listings,
  unmetNeeds,
  onClaimListing,
  onPostUnmetNeed,
  onShowToast,
}) => {
  const [selectedLocality, setSelectedLocality] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [scaleFilter, setScaleFilter] = useState<string>('All Volumes');

  const [spotlightClaimed, setSpotlightClaimed] = useState(false);
  const [claimModalTarget, setClaimModalTarget] = useState<{
    id: string;
    donorName: string;
    summary: string;
  } | null>(null);
  const [claimState, setClaimState] = useState<'idle' | 'dispatching' | 'dispatched'>('idle');
  const [showTrackerQr, setShowTrackerQr] = useState(false);

  // Post Unmet Need slide-over drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [campName, setCampName] = useState('Wilson Garden Transit Camp');
  const [needType, setNeedType] = useState<'Dry Ration Kits' | 'Cooked Hot Meals'>(
    'Dry Ration Kits'
  );
  const [needQty, setNeedQty] = useState(100);
  const [needWindow, setNeedWindow] = useState('Today before 7:00 PM');
  const [needNotes, setNeedNotes] = useState('');
  const [broadcastingNeed, setBroadcastingNeed] = useState(false);

  const availableListings = useMemo(() => {
    return listings.filter((item) => {
      if (item.status !== 'awaiting_claim') return false;
      if (selectedLocality !== 'All' && item.locality !== selectedLocality) return false;
      if (selectedDietary !== 'All' && item.dietary !== selectedDietary) return false;
      if (scaleFilter === '> 50 meals' && item.quantity <= 50) return false;
      if (scaleFilter === '20-50 meals' && (item.quantity < 20 || item.quantity > 50)) return false;
      if (scaleFilter === '< 20 meals' && item.quantity >= 20) return false;
      return true;
    });
  }, [listings, selectedLocality, selectedDietary, scaleFilter]);

  const claimedTodayCount =
    320 +
    (spotlightClaimed ? 60 : 0) +
    listings.filter((l) => l.status === 'claimed' && l.claimedByNgo === 'Akshaya Relief Foundation')
      .reduce((acc, cur) => acc + cur.quantity, 0);

  const localityCounts = {
    Indiranagar: listings.filter((l) => l.status === 'awaiting_claim' && l.locality === 'Indiranagar').length + 1,
    Koramangala: listings.filter((l) => l.status === 'awaiting_claim' && l.locality === 'Koramangala').length + 1,
    Whitefield: listings.filter((l) => l.status === 'awaiting_claim' && l.locality === 'Whitefield').length + 2,
    Jayanagar: listings.filter((l) => l.status === 'awaiting_claim' && l.locality === 'Jayanagar').length,
  };

  const handleAuthorizeClaim = () => {
    if (!claimModalTarget) return;
    setClaimState('dispatching');
    setTimeout(() => {
      setClaimState('dispatched');
      if (claimModalTarget.id === 'spotlight-rameshwaram') {
        setSpotlightClaimed(true);
      } else {
        onClaimListing(claimModalTarget.id, 'Akshaya Relief Foundation');
      }
      onShowToast(
        `Claim authorized for ${claimModalTarget.donorName}. Courier Karthik R. dispatched!`,
        'success'
      );
      setTimeout(() => {
        setClaimModalTarget(null);
        setClaimState('idle');
      }, 650);
    }, 500);
  };

  const handleSubmitNeed = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastingNeed(true);
    setTimeout(() => {
      onPostUnmetNeed({
        campName,
        needType,
        quantity: needQty,
        window: needWindow,
        notes: needNotes || 'Standard balanced nutrition allocation.',
      });
      setBroadcastingNeed(false);
      setDrawerOpen(false);
      setNeedNotes('');
      onShowToast(
        `Unmet need (${needQty} ${needType}) broadcasted to Indiranagar kitchens.`,
        'success'
      );
    }, 500);
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Verification & Org Status Banner */}
      <div className="w-full bg-surface-container-low rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined material-symbols-filled text-[28px]">
                shield_with_heart
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-headline text-lg font-semibold text-primary">
                  Akshaya Relief Foundation
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Tier 1 Partner
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-semibold whitespace-nowrap tabular-nums">
                  FSSAI Reg: 21223009000142
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Primary Cluster: Indiranagar Hub • Verified Fleet Escort: Enabled • 3 Shelters Linked
                {unmetNeeds.length > 0 && ` • ${unmetNeeds.length} active need broadcast`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Post Unmet Need
            </button>
            <div className="h-6 w-px bg-outline-variant hidden sm:block" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-lowest whitespace-nowrap">
              <span className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-[11px] font-semibold text-on-surface">Auto-Matcher Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Operational KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant">Available In Range</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">near_me</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-[32px] leading-10 font-bold text-primary tabular-nums">
                {availableListings.length + (spotlightClaimed ? 0 : 1)}
              </span>
              <span className="text-[11px] text-secondary font-bold">Surplus Drops</span>
            </div>
            <p className="text-xs text-outline mt-1">&lt; 3.5 km radius around center</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant">Claimed Today</span>
            <span className="w-8 h-8 rounded-lg bg-secondary-container/60 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">restaurant</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-[32px] leading-10 font-bold text-primary tabular-nums">
                {claimedTodayCount}
              </span>
              <span className="text-[11px] text-secondary font-bold">Meals Secured</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.round((claimedTodayCount / 400) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant">
              Volunteer Dispatches
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">electric_moped</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-[32px] leading-10 font-bold text-primary tabular-nums">
                {4 + (spotlightClaimed ? 1 : 0)}
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">In Transit</span>
            </div>
            <p className="text-xs text-outline mt-1 tabular-nums">Avg delivery runtime: 22m</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant">Beneficiaries Fed</span>
            <span className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined material-symbols-filled text-[20px]">
                groups
              </span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-[32px] leading-10 font-bold text-primary tabular-nums">
                1,150
              </span>
              <span className="text-[11px] text-secondary font-bold tabular-nums">
                +18% vs yesterday
              </span>
            </div>
            <p className="text-xs text-outline mt-1">Direct community impact</p>
          </div>
        </div>
      </div>

      {/* Smart Recommendation Spotlight Engine (Hero Bento) */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-6 shadow-md mb-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center relative z-10 pb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-secondary text-[11px] font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[16px]">neurology</span>
              Algorithmic Dispatch Match
            </div>
            <h2 className="font-headline text-2xl font-semibold text-primary">
              Smart Weighted NGO Matching Recommendation
            </h2>
            <p className="text-sm text-on-surface-variant">
              Prioritized by real-time perishability, vehicle radius, and shelter dietary specs.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg shrink-0">
            <span className="text-[11px] text-on-surface-variant">Engine Confidence:</span>
            <span className="text-xs text-secondary font-bold">Dynamic Tier-A</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 pt-1">
          {/* Highlighted Rescue Donation Card */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-4 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px] text-primary">
                      storefront
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-headline text-lg font-semibold text-primary">
                        The Rameshwaram Cafe
                      </h3>
                      <span className="material-symbols-outlined material-symbols-filled text-secondary text-[16px]">
                        verified
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      100 Feet Rd, Indiranagar • FSSAI #11221333000541
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  {spotlightClaimed ? 'Claimed & Dispatched' : 'Expires in 1h 45m'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 bg-surface-container-lowest rounded-lg">
                <div>
                  <span className="text-[11px] text-outline block">Batch Payload</span>
                  <span className="text-xs text-primary font-bold tabular-nums">
                    60 Fresh Meals
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-outline block">Dietary Flag</span>
                  <span className="text-xs text-secondary font-bold">100% Pure Veg</span>
                </div>
                <div>
                  <span className="text-[11px] text-outline block">Logged Temp</span>
                  <span className="text-xs text-primary font-bold tabular-nums">
                    68.4°C Hot Hold
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-outline block">Packaging Type</span>
                  <span className="text-xs text-on-surface font-bold">Insulated Totes</span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Steaming idlis, sambar, and hot ghee pongal packed immediately post-lunch service in compliance with FSSAI hygiene standards. Sealed in sanitized food-grade stainless carriers.
              </p>
            </div>

            <div className="pt-4 mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-[18px] text-secondary">pin_drop</span>
                <span>0.8 km from Indiranagar Intake Node</span>
              </div>
              <button
                type="button"
                disabled={spotlightClaimed}
                onClick={() =>
                  setClaimModalTarget({
                    id: 'spotlight-rameshwaram',
                    donorName: 'The Rameshwaram Cafe',
                    summary: '60 Hot Meals • 100% Pure Veg',
                  })
                }
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  spotlightClaimed
                    ? 'bg-secondary text-on-secondary cursor-default'
                    : 'bg-primary-container text-on-primary hover:bg-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {spotlightClaimed ? 'task_alt' : 'verified_user'}
                </span>
                {spotlightClaimed
                  ? 'Courier Dispatched (Karthik R.)'
                  : 'Claim Donation (Instant Pass)'}
              </button>
            </div>
          </div>

          {/* Match Score Decomposition */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-on-surface-variant font-semibold">
                  Match Score Decomposition
                </span>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-headline text-base font-bold tabular-nums">
                  <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
                  96%
                </div>
              </div>
              <p className="text-xs text-outline mb-4">
                Weighted ranking algorithm configured for immediate zero-waste dispatch.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Proximity Factor (0.8 km)', score: '40% / 40% (Max)', pct: '100%' },
                  { label: 'Shelter Intake Fit (Capacity: 50-80 pax)', score: '28% / 30%', pct: '93%' },
                  { label: 'Perishability Urgency (< 2h Window)', score: '19% / 20%', pct: '95%' },
                  { label: 'Dietary & Cultural Preference Match', score: '10% / 10%', pct: '100%' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-[11px] font-semibold mb-1 tabular-nums">
                      <span className="text-on-surface">{row.label}</span>
                      <span className="text-secondary font-bold">{row.score}</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: row.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-surface-container text-on-surface-variant text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
              <span>Matched to: Jeevan Jyothi Shelter (Capacity 70)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Split: Marketplace on Left, Live Volunteer Tracking on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT: Filterable Donation Marketplace (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-headline text-lg font-semibold text-primary">
                Live Food Rescue Marketplace
              </h2>
              <p className="text-xs text-on-surface-variant">
                Direct rescue requests awaiting verified NGO acceptance
              </p>
            </div>
            <span className="text-[11px] font-semibold text-secondary bg-surface-container-high px-3 py-1 rounded-full self-start sm:self-auto whitespace-nowrap">
              Updated 30s ago
            </span>
          </div>

          {/* Filters Ribbon */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm mb-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                Locality:
              </span>
              {(
                [
                  { id: 'All', label: 'All Hubs' },
                  { id: 'Indiranagar', label: `Indiranagar (${localityCounts.Indiranagar})` },
                  { id: 'Koramangala', label: `Koramangala (${localityCounts.Koramangala})` },
                  { id: 'Whitefield', label: `Whitefield (${localityCounts.Whitefield})` },
                  { id: 'Jayanagar', label: `Jayanagar (${localityCounts.Jayanagar})` },
                ] as const
              ).map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setSelectedLocality(loc.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    selectedLocality === loc.id
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                  Dietary:
                </span>
                {['All', 'Pure Veg', 'Halal', 'Non-Veg'].map((dietOpt) => (
                  <button
                    key={dietOpt}
                    type="button"
                    onClick={() => setSelectedDietary(dietOpt)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                      selectedDietary === dietOpt
                        ? 'bg-secondary-container/70 text-secondary font-bold'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {dietOpt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                  Scale:
                </span>
                <select
                  aria-label="Filter by meal scale"
                  value={scaleFilter}
                  onChange={(e) => setScaleFilter(e.target.value)}
                  className="bg-surface-container text-[11px] font-semibold text-on-surface rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                >
                  <option>All Volumes</option>
                  <option>&gt; 50 meals</option>
                  <option>20-50 meals</option>
                  <option>&lt; 20 meals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Marketplace Cards Grid */}
          <div className="flex flex-col gap-4">
            {availableListings.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-8 text-center shadow-sm">
                <span className="material-symbols-outlined text-[36px] text-secondary mb-2">
                  inventory_2
                </span>
                <h3 className="font-headline text-base font-semibold text-primary">
                  No matching drops in this filter
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 mb-4">
                  Reset your locality or dietary filters to view all active Bengaluru surplus batches.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLocality('All');
                    setSelectedDietary('All');
                    setScaleFilter('All Volumes');
                  }}
                  className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Reset Marketplace Filters
                </button>
              </div>
            ) : (
              availableListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-4"
                >
                  <div className="md:w-44 h-36 rounded-lg overflow-hidden shrink-0 relative bg-surface-container">
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.imageAlt || item.title}
                      className="w-full h-full object-cover"
                      fallbackIcon="restaurant"
                      fallbackTitle={item.donorName}
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-on-primary text-[11px] font-semibold backdrop-blur-md tabular-nums">
                      {item.distanceKm} km
                    </span>
                  </div>

                  <div className="flex flex-col justify-between grow min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-headline text-lg font-semibold text-primary truncate">
                              {item.donorName}
                            </h3>
                            <span className="text-tertiary-fixed-dim flex items-center text-[11px] font-bold shrink-0 tabular-nums">
                              <span className="material-symbols-outlined material-symbols-filled text-[15px]">
                                star
                              </span>
                              {item.rating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant truncate">
                            {item.donorLocation}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 whitespace-nowrap ${
                            item.urgent
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {item.expiryLabel}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 my-2 text-[11px] font-semibold text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">
                            thermostat
                          </span>
                          {item.tempLabel}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">
                            fact_check
                          </span>
                          {item.handlingSpec}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">
                            eco
                          </span>
                          {item.dietary}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="min-w-0">
                        <span className="font-headline text-lg font-bold text-primary tabular-nums">
                          {item.quantity} {item.unit === 'meals' ? 'Meals' : item.unit}
                        </span>
                        <span className="text-xs text-outline ml-1.5 truncate">
                          ({item.title})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setClaimModalTarget({
                            id: item.id,
                            donorName: item.donorName,
                            summary: `${item.quantity} ${item.unit} • ${item.title}`,
                          })
                        }
                        className="px-4 py-1.5 rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary text-primary text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Review &amp; Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Pickup & Volunteer Coordination (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline text-lg font-semibold text-primary">
                Pickup &amp; Volunteer Coordination
              </h2>
              <p className="text-xs text-on-surface-variant">Active rescue mission telemetry</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap">
              <span className="h-2 w-2 rounded-full bg-secondary animate-ping" />
              1 Active Run
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md flex flex-col gap-4">
            {/* Assigned Volunteer Profile */}
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline text-lg font-bold shrink-0">
                  KR
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-primary">Karthik R.</span>
                    <span className="material-symbols-outlined material-symbols-filled text-[16px] text-secondary">
                      verified
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">
                    Hero Electric Nyx • Insulated 60L Bag
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                    <span className="text-secondary font-semibold tabular-nums">
                      48 Rescues Done
                    </span>
                    <span className="text-outline">•</span>
                    <span className="text-outline truncate">Robin Hood Army Fellow</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[11px] text-outline">Direct Contact</span>
                <button
                  type="button"
                  onClick={() =>
                    onShowToast('Voice bridge connected to courier Karthik R. (+91 98765 43210)')
                  }
                  aria-label="Call courier Karthik R."
                  className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:opacity-90 transition-opacity mt-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </button>
              </div>
            </div>

            {/* Bangalore Route Map View */}
            <div className="relative w-full h-52 rounded-xl overflow-hidden shadow-inner">
              <ResilientImage
                src={MAP_IMAGES.ngoRoute}
                alt="Indiranagar to Ulsoor courier route map in Bengaluru"
                className="w-full h-full object-cover"
                fallbackIcon="navigation"
                fallbackTitle="100 Ft Rd to Ulsoor Route"
              />
              <div className="absolute top-3 left-3 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  navigation
                </span>
                <div>
                  <span className="text-[11px] text-primary font-bold block">
                    100 Ft Rd to Ulsoor
                  </span>
                  <span className="text-[10px] text-outline block tabular-nums">
                    Speed: 28 km/h
                  </span>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-primary text-on-primary px-3 py-1.5 rounded-lg shadow-md text-xs font-semibold flex items-center gap-1.5 tabular-nums">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span>ETA: 14 mins</span>
              </div>
            </div>

            {/* Waypoint Timeline */}
            <div className="space-y-3 px-1">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-primary font-bold tabular-nums">
                      12:45 PM • Pickup Verified
                    </span>
                    <span className="text-[11px] text-secondary bg-surface-container px-2 py-0.5 rounded font-semibold">
                      FSSAI Signed
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    The Rameshwaram Cafe, Indiranagar Branch. 60 meals loaded.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">two_wheeler</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-primary font-bold">
                      In Transit • Old Airport Rd
                    </span>
                    <span className="text-[11px] text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded font-semibold tabular-nums">
                      Cold Chain Safe (62°C)
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Volunteer en route to Akshaya Shelter 2, Halasuru.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-60">
                <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">warehouse</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface font-semibold block">
                    Scheduled Drop &amp; OTP Handover
                  </span>
                  <p className="text-xs text-outline tabular-nums">
                    Expected: 1:18 PM • Receiver: Brother Anthony
                  </p>
                </div>
              </div>
            </div>

            {/* Active Handover OTP Snippet */}
            <div className="bg-surface-container p-3 rounded-lg flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  qr_code_2
                </span>
                <div>
                  <span className="text-[11px] text-on-surface-variant block">
                    Rescue Handover Token
                  </span>
                  <span className="font-mono text-base font-bold text-primary tracking-widest">
                    SAM-8942
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTrackerQr(true)}
                className="px-3 py-1.5 bg-surface-container-lowest text-primary text-[11px] font-semibold rounded-md shadow-sm hover:bg-surface-bright cursor-pointer whitespace-nowrap"
              >
                Show QR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Claim & Token Generation Modal */}
      {claimModalTarget && (
        <div
          className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-xl relative">
            <button
              type="button"
              aria-label="Close claim dialog"
              onClick={() => setClaimModalTarget(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
              </div>
              <div>
                <h3 className="font-headline text-lg font-semibold text-primary">
                  Confirm Immediate Claim
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Batch: {claimModalTarget.donorName} ({claimModalTarget.summary})
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-low p-3 rounded-lg flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] text-outline block">Auto-Assigned Courier</span>
                  <span className="text-xs text-primary font-bold">
                    Karthik R. (Volunteer Fleet #14)
                  </span>
                </div>
                <span className="px-2 py-1 bg-surface-container-lowest rounded text-[11px] text-secondary font-semibold tabular-nums">
                  ETA 12m
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-xl text-center">
                <div className="w-32 h-32 bg-surface-container-lowest p-2 rounded-lg shadow-sm mb-2 flex items-center justify-center">
                  <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 100 100">
                    <rect height="20" width="20" x="10" y="10" />
                    <rect fill="#ffffff" height="10" width="10" x="15" y="15" />
                    <rect height="20" width="20" x="70" y="10" />
                    <rect fill="#ffffff" height="10" width="10" x="75" y="15" />
                    <rect height="20" width="20" x="10" y="70" />
                    <rect fill="#ffffff" height="10" width="10" x="15" y="75" />
                    <rect height="8" width="8" x="40" y="20" />
                    <rect height="16" width="8" x="55" y="15" />
                    <rect height="10" width="30" x="35" y="45" />
                    <rect height="16" width="16" x="40" y="70" />
                    <rect height="12" width="12" x="70" y="50" />
                    <rect height="15" width="15" x="75" y="75" />
                  </svg>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Digital Handover Verification Code
                </span>
                <span className="font-headline text-2xl text-primary font-mono tracking-widest mt-1 font-bold">
                  OTP: 749-012
                </span>
              </div>

              <div className="p-2.5 bg-surface-container rounded-lg text-xs text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">
                  verified
                </span>
                <span>FSSAI transfer certificate will auto-generate upon courier scanning.</span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setClaimModalTarget(null)}
                  className="w-1/2 py-2.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAuthorizeClaim}
                  disabled={claimState !== 'idle'}
                  className="w-1/2 py-2.5 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {claimState === 'dispatching' && (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        refresh
                      </span>
                      Dispatching...
                    </>
                  )}
                  {claimState === 'dispatched' && (
                    <>
                      <span className="material-symbols-outlined text-[18px]">done</span>
                      Dispatched!
                    </>
                  )}
                  {claimState === 'idle' && 'Authorize & Dispatch'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Unmet Need Slide-Over Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4">
                <div>
                  <h3 className="font-headline text-lg font-semibold text-primary">
                    Post Unmet Need
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Broadcast directly to partner commercial kitchens
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close drawer"
                  onClick={() => setDrawerOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form id="requirement-form" onSubmit={handleSubmitNeed} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs text-on-surface font-semibold block mb-1">
                    Target Community / Camp
                  </label>
                  <input
                    required
                    type="text"
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-surface-container text-on-surface text-sm focus:bg-surface-container-lowest transition-colors outline-none"
                  />
                </div>

                <div>
                  <span className="text-xs text-on-surface font-semibold block mb-1">
                    Requirement Type
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Dry Ration Kits', 'Cooked Hot Meals'] as const).map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 p-2.5 bg-surface-container-low rounded-lg cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="need_type"
                          checked={needType === type}
                          onChange={() => setNeedType(type)}
                          className="accent-primary"
                        />
                        <span className="text-xs text-on-surface">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-on-surface font-semibold block mb-1">
                    Quantity Requested (Pax / Kits)
                  </label>
                  <input
                    required
                    type="number"
                    min={10}
                    value={needQty}
                    onChange={(e) => setNeedQty(Number(e.target.value) || 0)}
                    className="w-full h-11 px-3 rounded-lg bg-surface-container text-on-surface text-sm tabular-nums focus:bg-surface-container-lowest transition-colors outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-on-surface font-semibold block mb-1">
                    Fulfillment Window
                  </label>
                  <select
                    value={needWindow}
                    onChange={(e) => setNeedWindow(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-surface-container text-on-surface text-sm focus:bg-surface-container-lowest transition-colors outline-none cursor-pointer"
                  >
                    <option>Today before 7:00 PM</option>
                    <option>Tomorrow Morning (Breakfast)</option>
                    <option>Recurring Weekly Demand</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-on-surface font-semibold block mb-1">
                    Operational Instructions &amp; Dietary Guidelines
                  </label>
                  <textarea
                    rows={3}
                    value={needNotes}
                    onChange={(e) => setNeedNotes(e.target.value)}
                    placeholder="E.g., High-protein pulses, rice bags, edible oil containers suitable for 20 displaced families with children."
                    className="w-full p-3 rounded-lg bg-surface-container text-on-surface text-sm focus:bg-surface-container-lowest transition-colors outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-1/3 py-2.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="requirement-form"
                disabled={broadcastingNeed}
                className="w-2/3 py-2.5 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    broadcastingNeed ? 'animate-spin' : ''
                  }`}
                >
                  {broadcastingNeed ? 'sync' : 'cell_tower'}
                </span>
                {broadcastingNeed ? 'Broadcasting...' : 'Broadcast Need'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracker QR Modal */}
      <QrHandoverModal
        isOpen={showTrackerQr}
        onClose={() => setShowTrackerQr(false)}
        manifestId="SAM-8942"
        shelterName="Akshaya Shelter 2, Halasuru"
        volunteerName="Karthik R. (Hero Electric Nyx)"
        payload="60 Hot Meals (62°C)"
        otpCode="749-012"
        onPrintReceipt={() => {
          onShowToast('Digital handover pass SAM-8942 printed.', 'success');
          setShowTrackerQr(false);
        }}
      />
    </div>
  );
};
