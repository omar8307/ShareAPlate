import React, { useState } from 'react';
import { SurplusFoodItem, NGORequirement } from '../types/foodRescue';

interface NGOPortalTabProps {
  items: SurplusFoodItem[];
  requirements: NGORequirement[];
  onOpenClaimModal: (item: SurplusFoodItem) => void;
  onAddRequirement: (req: NGORequirement) => void;
}

export const NGOPortalTab: React.FC<NGOPortalTabProps> = ({
  items,
  requirements,
  onOpenClaimModal,
  onAddRequirement,
}) => {
  // 4 Weight Sliders
  const [proximityWeight, setProximityWeight] = useState(40);
  const [capacityWeight, setCapacityWeight] = useState(25);
  const [speedWeight, setSpeedWeight] = useState(20);
  const [dietaryWeight, setDietaryWeight] = useState(15);

  // Publish Need Form State
  const [reqCount, setReqCount] = useState<number>(100);
  const [reqLocation, setReqLocation] = useState(
    'Feeding Hope Shelter, Austin Town Community Center, Bengaluru'
  );
  const [reqDietary, setReqDietary] = useState('Pure Vegetarian (Strict)');
  const [reqTime, setReqTime] = useState('20:30');
  const [showBroadcastToast, setShowBroadcastToast] = useState(false);

  // Dynamic ranking based on weights
  const rankedItems = [...items]
    .map((item) => {
      // Calculate dynamic match score
      // Proximity score (closer is better: 2km = 100%, 15km = 50%)
      const proxScore = Math.max(50, 100 - item.distanceKm * 3.5);
      // Capacity score
      const capScore = item.servings >= 80 ? 98 : 88;
      // Speed score
      const speedScore = item.urgency === 'Urgent' ? 99 : 85;
      // Dietary score
      const dietScore = item.dietary === 'Pure Veg' ? 100 : 70;

      const dynamicScore = Math.round(
        (proxScore * proximityWeight +
          capScore * capacityWeight +
          speedScore * speedWeight +
          dietScore * dietaryWeight) /
          100
      );

      return {
        ...item,
        calculatedScore: Math.min(99, Math.max(75, dynamicScore)),
      };
    })
    .sort((a, b) => b.calculatedScore - a.calculatedScore);

  const handlePublishNeed = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: NGORequirement = {
      id: `req-${Date.now()}`,
      ngoName: 'Feeding Hope Trust',
      ngoCode: '#NGO-BLR-2041',
      portions: Number(reqCount),
      location: reqLocation,
      dietary: reqDietary,
      targetTime: reqTime,
      urgency: 'Urgent',
      timestamp: 'Just now',
    };
    onAddRequirement(newReq);
    setShowBroadcastToast(true);
    setTimeout(() => setShowBroadcastToast(false), 4500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Toast */}
      {showBroadcastToast && (
        <div className="p-4 rounded-xl bg-secondary-container text-on-secondary-container shadow-md flex items-center justify-between border border-primary/20 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]">campaign</span>
            <div>
              <div className="font-bold text-[14px]">Shelter Need Broadcasted!</div>
              <div className="text-[12px]">
                Urgent requirement for {reqCount} meals broadcast to 42 commercial kitchens within 8 km.
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowBroadcastToast(false)}
            className="text-on-secondary-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Top Matching Parameters Card */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-6 border border-surface-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">tune</span>
              <h2 className="text-[20px] font-bold text-on-surface">
                Intelligent Match Weighting Engine
              </h2>
            </div>
            <p className="text-[14px] text-on-surface-variant">
              Calibrate how the algorithm pairs your shelter's active capacity with newly posted city surplus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[12px] font-bold flex items-center gap-1 shadow-xs">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Feeding Hope Trust (#NGO-BLR-2041)</span>
            </span>
          </div>
        </div>

        {/* 4 Weight Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-container-low border border-surface-container">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-on-surface">Proximity Weight</span>
              <span className="text-[12px] text-primary font-bold">{proximityWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={proximityWeight}
              onChange={(e) => setProximityWeight(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-on-surface-variant">Under 3 km prioritized</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-on-surface">Shelter Capacity</span>
              <span className="text-[12px] text-primary font-bold">{capacityWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={capacityWeight}
              onChange={(e) => setCapacityWeight(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-on-surface-variant">Matches bulk meal loads</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-on-surface">Pickup Speed Window</span>
              <span className="text-[12px] text-primary font-bold">{speedWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={speedWeight}
              onChange={(e) => setSpeedWeight(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-on-surface-variant">Urgent &lt;60 min claims</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-on-surface">Dietary Match</span>
              <span className="text-[12px] text-primary font-bold">{dietaryWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={dietaryWeight}
              onChange={(e) => setDietaryWeight(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-on-surface-variant">Pure Veg shelter norm</span>
          </div>
        </div>
      </div>

      {/* Two-Section Layout: AI Recommended Queue & Post Hunger Demand Need */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Ranked Recommended Surpluses for This NGO */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-bold text-on-surface">
              Top Recommended Food Surpluses for You
            </h3>
            <span className="text-[12px] text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">autorenew</span>
              <span>Dynamically calibrated by sliders</span>
            </span>
          </div>

          {rankedItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-surface-container hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary text-[18px] flex items-center justify-center shrink-0 font-extrabold shadow-sm">
                  {item.calculatedScore}%
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-[16px] text-on-surface font-bold">{item.title}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.urgency === 'Urgent'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {item.urgency} ({item.deadline})
                    </span>
                  </div>

                  <p className="text-[13px] text-on-surface-variant">
                    {item.donorName} • {item.location} ({item.distanceKm} km from your shelter)
                  </p>

                  <div className="flex items-center gap-2.5 text-[12px] text-on-surface-variant pt-1 flex-wrap">
                    <span className="font-semibold text-on-surface">
                      {item.servings} Meals ({item.quantityKg} kg)
                    </span>
                    <span>•</span>
                    <span className="font-medium text-secondary">{item.dietary}</span>
                    <span>•</span>
                    <span className="text-primary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">electric_bike</span>
                      <span>Volunteer pickup ready in 15 mins</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <button
                  onClick={() => onOpenClaimModal(item)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-surface-tint text-[13px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Claim Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: NGO Food Requirement Post Widget & Active Needs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[22px]">campaign</span>
              <h3 className="text-[18px] font-bold text-on-surface">Publish Shelter Need</h3>
            </div>
            <p className="text-[13px] text-on-surface-variant">
              Broadcast urgent meal requirements to commercial kitchens within 8 km for tonight's dinner relief.
            </p>

            <form onSubmit={handlePublishNeed} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Required Portions *
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  required
                  value={reqCount}
                  onChange={(e) => setReqCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-[14px] focus:outline-none border border-surface-container"
                />
              </div>

              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Shelter / Distribution Point *
                </label>
                <input
                  type="text"
                  required
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-[13px] focus:outline-none border border-surface-container"
                />
              </div>

              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Dietary Requirement
                </label>
                <select
                  value={reqDietary}
                  onChange={(e) => setReqDietary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-[13px] focus:outline-none border border-surface-container"
                >
                  <option value="Pure Vegetarian (Strict)">Pure Vegetarian (Strict)</option>
                  <option value="Any Certified Hygienic Meal">Any Certified Hygienic Meal</option>
                  <option value="Dry Ration / Groceries Only">Dry Ration / Groceries Only</option>
                </select>
              </div>

              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Target Feeding Hour
                </label>
                <input
                  type="time"
                  value={reqTime}
                  onChange={(e) => setReqTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-[13px] focus:outline-none border border-surface-container"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-2.5 rounded-xl bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">podcasts</span>
                <span>Broadcast Need to City Donors</span>
              </button>
            </form>

            <div className="p-3 rounded-xl bg-surface-container-low text-[11px] text-on-surface-variant flex items-center gap-2 border border-surface-container">
              <span className="material-symbols-outlined text-primary text-[18px]">notifications_active</span>
              <span>3 Caterers nearby have automated surplus dispatch matching.</span>
            </div>
          </div>

          {/* Active Shelter Broadcasts list */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-on-surface">Live Citywide Shelter Demands</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-semibold">
                {requirements.length} Active
              </span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[13px] text-on-surface">{req.ngoName}</span>
                    <span className="text-[11px] font-bold text-tertiary">{req.portions} Meals</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant truncate">{req.location}</span>
                  <div className="flex items-center justify-between text-[10px] text-outline mt-1">
                    <span>Target: {req.targetTime}</span>
                    <span className="font-semibold text-primary">{req.dietary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
