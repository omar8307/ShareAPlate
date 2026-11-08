import React, { useState } from 'react';
import { FoodCategory, StorageType, SurplusFoodItem } from '../types/foodRescue';

interface DonorHubTabProps {
  onAddNewDonation: (item: SurplusFoodItem) => void;
  onOpenTaxReceipt: () => void;
}

export const DonorHubTab: React.FC<DonorHubTabProps> = ({
  onAddNewDonation,
  onOpenTaxReceipt,
}) => {
  // Form fields
  const [foodName, setFoodName] = useState('Steamed Basmati Rice & Dal Makhani');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [quantityKg, setQuantityKg] = useState<number>(25);
  const [servings, setServings] = useState<number>(80);
  const [prepTime, setPrepTime] = useState('19:00');
  const [storage, setStorage] = useState<StorageType>('Hot Pack');
  const [isPureVeg, setIsPureVeg] = useState(true);
  const [hasDairy, setHasDairy] = useState(true);
  const [hasNuts, setHasNuts] = useState(false);
  const [hasGluten, setHasGluten] = useState(true);
  const [location, setLocation] = useState('Indiranagar 100ft Road');
  const [deadline, setDeadline] = useState('22:30');
  const [aiDescription, setAiDescription] = useState(
    '[AI FSSAI COMPLIANCE CHECK]\nItem: Steamed Basmati Rice & Dal Makhani (25 kg / ~80 meals). Packaged under strict hot-chain protocol (>65°C Insulated). Tested core temp 68°C. Safe consumption window through 22:30 hrs tonight. Good Samaritan Act Section 80G protected.'
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Waste Pattern AI Simulator State
  const [simulatedGuests, setSimulatedGuests] = useState<number>(320);

  const predictedKg = Math.round(simulatedGuests * 0.089);
  const predictedMeals = Math.round(predictedKg * 3.1);

  const handleQuantityChange = (kgVal: number) => {
    setQuantityKg(kgVal);
    setServings(Math.round(kgVal * 3.2));
  };

  const handleGenerateAIDescription = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const generated = `[AI FSSAI COMPLIANCE CHECK]\nItem: ${foodName || 'Catering Surplus'} (${quantityKg} kg / ~${servings} meals). Packaged under strict hot-chain protocol (${storage}). Tested core temp >65°C. No bacterial proliferation risk detected within 3.5 hrs. Safe consumption window through ${deadline} hrs tonight. FSSAI surplus redistribution protocol active. Good Samaritan safe donor liability clause enrolled.`;
      setAiDescription(generated);
      setIsGeneratingAI(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allergensList: string[] = [];
    if (hasDairy) allergensList.push('Dairy');
    if (hasNuts) allergensList.push('Nuts');
    if (hasGluten) allergensList.push('Gluten');

    const newItem: SurplusFoodItem = {
      id: `item-${Date.now()}`,
      title: foodName,
      donorName: 'Grand Palace Caterers',
      donorType: 'Caterer',
      category: category,
      dietary: isPureVeg ? 'Pure Veg' : 'Non-Veg',
      quantityKg: Number(quantityKg),
      servings: Number(servings),
      cookTime: `Prepared at ${prepTime}`,
      storage: storage,
      storageTempDesc:
        storage === 'Hot Pack'
          ? '>65°C Hot Insulated Containers'
          : storage === 'Chilled Pack' || storage === 'Cold Storage'
          ? '<4°C Cold Chain Protected'
          : 'Pantry Temperature',
      urgency: 'Urgent',
      deadline: deadline,
      location: location,
      distanceKm: 2.8,
      mapCoords: {
        lat: 12.975,
        lng: 77.635,
        xPercent: 46,
        yPercent: 32,
        pinNumber: 7,
      },
      smartMatchPercent: 97,
      recommendedNGO: 'Feeding Hope Trust (Austin Town)',
      safetyNotes: aiDescription,
      fssaiLicense: 'FSSAI #11219334000182',
      allergens: allergensList.length > 0 ? allergensList : ['None declared'],
      status: 'available',
      createdAt: 'Just now',
      timeline: [
        {
          time: prepTime,
          event: 'Kitchen finishes service and packs wholesome surplus.',
          actor: 'Kitchen Team',
        },
        {
          time: 'Just now',
          event: 'Surplus registered on ShareAPlate live dispatch grid.',
          actor: 'Chef Rajesh M.',
        },
      ],
    };

    onAddNewDonation(newItem);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Success notification banner if published */}
      {showSuccessToast && (
        <div className="p-4 rounded-xl bg-secondary-container text-on-secondary-container shadow-md flex items-center justify-between border border-primary/20 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
            <div>
              <div className="font-bold text-[14px]">Surplus Published Successfully!</div>
              <div className="text-[12px]">
                "{foodName}" ({quantityKg} kg / {servings} meals) is live. Alerts broadcast to 4 nearby verified shelters.
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-on-secondary-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Top Overview Banner */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-surface-container">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-inner shrink-0">
            <span className="material-symbols-outlined text-[30px]">soup_kitchen</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-on-surface">
                Donor Surplus Dispatch Station
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                FSSAI Compliant
              </span>
            </div>
            <p className="text-[14px] text-on-surface-variant">
              Post food surplus in under 90 seconds. Our algorithm instantly alerts verified shelters within 7 km.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[12px] text-on-surface-variant block">Your Donor Rating</span>
            <span className="text-[20px] text-primary font-bold">4.9 / 5.0 (★ Gold)</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Form on Left, AI Waste Prediction on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* MULTI-STEP SURPLUS POSTING FORM */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-6 border border-surface-container">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-bold text-on-surface">Post Surplus Food Donation</h3>
            <span className="text-[12px] text-on-surface-variant font-medium">
              Step 1 of 2 • Basic & Safety Data
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Food Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Food Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Steamed Basmati Rice & Dal Makhani"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/40 border border-surface-container"
                />
              </div>

              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Category *
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] focus:outline-none border border-surface-container"
                >
                  <option value="Cooked Meals">Cooked Meals (Warm/Buffet)</option>
                  <option value="Bakery">Bakery & Breads</option>
                  <option value="Raw Ingredients">Raw Ingredients / Produce</option>
                  <option value="Dairy">Dairy / Milk Products</option>
                </select>
              </div>
            </div>

            {/* Quantity in KG and Estimated Servings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Total Quantity (Kilograms) *
                </label>
                <input
                  type="number"
                  min="2"
                  max="500"
                  required
                  value={quantityKg}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/40 border border-surface-container"
                />
              </div>

              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Estimated Servings / Meals
                </label>
                <input
                  type="number"
                  min="5"
                  max="1500"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/40 border border-surface-container"
                />
              </div>
            </div>

            {/* Preparation Time & Storage Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Prepared At *
                </label>
                <input
                  type="time"
                  required
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] focus:outline-none border border-surface-container"
                />
              </div>

              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Storage Condition *
                </label>
                <select
                  value={storage}
                  onChange={(e) => setStorage(e.target.value as StorageType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] focus:outline-none border border-surface-container"
                >
                  <option value="Hot Pack">Hot Pack (&gt;65°C Insulated)</option>
                  <option value="Chilled Pack">Refrigerated (&lt;4°C Chilled)</option>
                  <option value="Room Temp">Room Temperature (Dry pantry)</option>
                  <option value="Cold Storage">Cold Storage Facility</option>
                </select>
              </div>
            </div>

            {/* Dietary & Allergen Toggles */}
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
              <span className="text-[12px] text-on-surface font-semibold">
                Dietary & Major Allergen Declarations
              </span>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-[13px] text-on-surface font-medium">
                  <input
                    type="checkbox"
                    checked={isPureVeg}
                    onChange={(e) => setIsPureVeg(e.target.checked)}
                    className="accent-primary w-4 h-4 rounded"
                  />
                  <span>Pure Vegetarian</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-[13px] text-on-surface font-medium">
                  <input
                    type="checkbox"
                    checked={hasDairy}
                    onChange={(e) => setHasDairy(e.target.checked)}
                    className="accent-primary w-4 h-4 rounded"
                  />
                  <span>Contains Dairy</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-[13px] text-on-surface font-medium">
                  <input
                    type="checkbox"
                    checked={hasNuts}
                    onChange={(e) => setHasNuts(e.target.checked)}
                    className="accent-primary w-4 h-4 rounded"
                  />
                  <span>Contains Nuts</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-[13px] text-on-surface font-medium">
                  <input
                    type="checkbox"
                    checked={hasGluten}
                    onChange={(e) => setHasGluten(e.target.checked)}
                    className="accent-primary w-4 h-4 rounded"
                  />
                  <span>Contains Gluten</span>
                </label>
              </div>
            </div>

            {/* Pickup Location & Strict Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Pickup Hub Area *
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] focus:outline-none border border-surface-container"
                >
                  <option value="Indiranagar 100ft Road">Indiranagar (100ft Road)</option>
                  <option value="Koramangala 4th Block">Koramangala (4th Block)</option>
                  <option value="Whitefield EPIP Zone">Whitefield (EPIP Zone)</option>
                  <option value="HSR Layout Sector 2">HSR Layout (Sector 2)</option>
                  <option value="Electronic City Phase 1">Electronic City (Phase 1)</option>
                  <option value="MG Road Trinity Junction">MG Road (Trinity Junction)</option>
                </select>
              </div>

              <div>
                <label className="text-[12px] text-on-surface font-semibold block mb-1">
                  Strict Pickup Deadline *
                </label>
                <input
                  type="time"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] focus:outline-none border border-surface-container"
                />
              </div>
            </div>

            {/* AI ASSISTANT TRIGGER SECTION */}
            <div className="p-4 rounded-xl bg-secondary-fixed/30 flex flex-col gap-3 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-primary font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>AI FSSAI & Description Copilot</span>
                </span>
                <button
                  type="button"
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingAI}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[12px] font-bold hover:bg-surface-tint transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {isGeneratingAI ? 'sync' : 'magic_button'}
                  </span>
                  <span>{isGeneratingAI ? 'Generating...' : 'Auto-Generate'}</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder="Click 'Auto-Generate' to synthesize standardized FSSAI food safety tags, packing temperature checklist, and allergen notes..."
                className="w-full p-3 rounded-lg bg-surface-container-lowest text-on-surface text-[13px] focus:outline-none placeholder:text-on-surface-variant border border-surface-container font-mono text-[12px]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[12px] text-on-surface-variant flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px] text-primary">security</span>
                Good Samaritan Act Protected
              </span>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary text-on-primary hover:bg-surface-tint text-[14px] font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>Publish Live Food Rescue</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI WASTE PREDICTION & HISTORICAL SIMULATOR */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-5 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">insights</span>
                <h3 className="text-[20px] font-bold text-on-surface">Waste Pattern AI</h3>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                Predictive Model v3.4
              </span>
            </div>

            <p className="text-[14px] text-on-surface-variant">
              Based on historical Saturday evening buffet data across 40+ Bengaluru hotel donors, your projected end-of-service surplus is calculated below:
            </p>

            {/* Projected Surplus Gauge Box */}
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-on-surface">Projected Surplus (Tonight)</span>
                <span className="text-[20px] text-tertiary font-extrabold tabular-nums">
                  ~{predictedKg} kg ({predictedMeals} meals)
                </span>
              </div>

              {/* Progress indicator bar */}
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-tertiary h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (simulatedGuests / 600) * 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>Low Risk (&lt;10kg)</span>
                <span className="font-semibold text-tertiary">Peak Window: 10:15 PM</span>
                <span>High (&gt;40kg)</span>
              </div>
            </div>

            {/* AI Recommended Actions */}
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
                Kitchen Action Recommendations
              </span>

              <div className="p-3 rounded-xl bg-surface-container-lowest flex items-start gap-3 shadow-xs border border-surface-container">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <div className="flex flex-col text-[12px]">
                  <span className="font-bold text-on-surface">Cut Batch Preparation at 9:15 PM</span>
                  <span className="text-on-surface-variant">
                    Holding 3 trays of rice and 2 pots of dal avoids an estimated 14 kg redundant surplus.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-lowest flex items-start gap-3 shadow-xs border border-surface-container">
                <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                  schedule_send
                </span>
                <div className="flex flex-col text-[12px]">
                  <span className="font-bold text-on-surface">Pre-Alert Shelters at 9:45 PM</span>
                  <span className="text-on-surface-variant">
                    Auto-notifies nearby Akshaya Mitra team to dispatch transit van in advance.
                  </span>
                </div>
              </div>
            </div>

            {/* Simulator Slider */}
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-surface-container">
              <div className="flex justify-between items-center">
                <label className="text-[12px] font-semibold text-on-surface">
                  Simulate Expected Guest Footfall
                </label>
                <span className="text-[13px] font-bold text-primary tabular-nums">
                  {simulatedGuests} Guests
                </span>
              </div>

              <input
                type="range"
                min="100"
                max="600"
                step="20"
                value={simulatedGuests}
                onChange={(e) => setSimulatedGuests(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>100 (Small)</span>
                <span className="font-semibold text-tertiary">
                  Estimated surplus: {predictedKg} kg (~{predictedMeals} meals)
                </span>
                <span>600 (Gala)</span>
              </div>
            </div>
          </div>

          {/* Active Donor Badges & 80G Certificate */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
              </div>
              <div>
                <div className="text-[14px] font-bold text-on-surface">
                  Tax Incentive Certificate Ready
                </div>
                <div className="text-[12px] text-on-surface-variant">
                  Section 80G compliant receipt generated
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenTaxReceipt}
              className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-bold transition-colors cursor-pointer"
            >
              View 80G
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
