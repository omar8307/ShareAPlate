import React, { useState, useMemo } from 'react';
import { SurplusFoodItem, FoodCategory, UrgencyLevel, DietaryType } from '../types/foodRescue';

interface MarketplaceTabProps {
  items: SurplusFoodItem[];
  onOpenClaimModal: (item: SurplusFoodItem) => void;
  onOpenSafetyModal: (item: SurplusFoodItem) => void;
  onOpenTimelineModal: (item: SurplusFoodItem) => void;
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  items,
  onOpenClaimModal,
  onOpenSafetyModal,
  onOpenTimelineModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [distanceRadius, setDistanceRadius] = useState<number>(10);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [activePinId, setActivePinId] = useState<string | null>(null);

  // Filter listings
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || item.category === (selectedCategory as FoodCategory);

      const matchUrgency =
        selectedUrgency === 'all' || item.urgency === (selectedUrgency as UrgencyLevel);

      const matchDietary =
        selectedDietary === 'all' || item.dietary === (selectedDietary as DietaryType);

      const matchDistance = item.distanceKm <= distanceRadius;

      return matchSearch && matchCategory && matchUrgency && matchDietary && matchDistance;
    });
  }, [items, searchTerm, selectedCategory, selectedUrgency, selectedDietary, distanceRadius]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedUrgency('all');
    setSelectedDietary('all');
    setDistanceRadius(10);
    setViewMode('grid');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Marketplace Filter Bar & View Toggle */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-surface-container">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search surplus by dish name, caterer, or area (e.g. Biryani, Koramangala)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent focus:border-primary/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* View toggler & clear */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-1 rounded-xl bg-surface-container flex items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span>Grid View ({filteredItems.length} Live)</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">map</span>
                <span>Live Map View</span>
              </button>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-[12px] text-on-surface-variant hover:text-primary underline font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Filter Chips Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Category select */}
          <div>
            <label className="text-[12px] font-semibold text-on-surface-variant block mb-1">
              Food Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-surface-container-low text-on-surface text-[13px] font-medium focus:outline-none border border-surface-container"
            >
              <option value="all">All Categories (Cooked, Bakery, Fresh)</option>
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Bakery">Bakery & Breads</option>
              <option value="Raw Ingredients">Raw Fruits & Veggies</option>
              <option value="Dairy">Dairy & Milk Products</option>
            </select>
          </div>

          {/* Urgency select */}
          <div>
            <label className="text-[12px] font-semibold text-on-surface-variant block mb-1">
              Urgency Level
            </label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-surface-container-low text-on-surface text-[13px] font-medium focus:outline-none border border-surface-container"
            >
              <option value="all">All Urgencies</option>
              <option value="Urgent">Urgent (&lt; 90 min pick up)</option>
              <option value="High">High (&lt; 3 hrs)</option>
              <option value="Medium">Medium (Today)</option>
            </select>
          </div>

          {/* Dietary requirement */}
          <div>
            <label className="text-[12px] font-semibold text-on-surface-variant block mb-1">
              Dietary Preference
            </label>
            <select
              value={selectedDietary}
              onChange={(e) => setSelectedDietary(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-surface-container-low text-on-surface text-[13px] font-medium focus:outline-none border border-surface-container"
            >
              <option value="all">All Dietary Types</option>
              <option value="Pure Veg">Pure Vegetarian</option>
              <option value="Vegan">Vegan / Plant Based</option>
              <option value="Non-Veg">Non-Vegetarian</option>
            </select>
          </div>

          {/* Distance Radius Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[12px] font-semibold text-on-surface-variant">
                Radius Range
              </label>
              <span className="font-bold text-primary text-[12px]">{distanceRadius} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              value={distanceRadius}
              onChange={(e) => setDistanceRadius(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
              <span>2 km (Local)</span>
              <span>25 km (Greater BLR)</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAP VIEW CONTAINER */}
      {viewMode === 'map' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-surface-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-[20px] font-bold text-on-surface">
                Interactive Bengaluru Surplus Radar
              </h2>
              <p className="text-[14px] text-on-surface-variant">
                Live geolocation pins represent pending surplus pickups and immediate shelter matches.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-bold w-fit">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Geofence Active (Radius {distanceRadius} km)
            </span>
          </div>

          {/* Interactive Map Canvas */}
          <div className="relative w-full h-[480px] rounded-xl overflow-hidden bg-surface-container flex items-center justify-center shadow-inner border border-surface-container">
            <div
              className="w-full h-full bg-cover bg-center opacity-90 transition-all duration-300"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBoErJU0IQYEn7STeCtbQI8pOOZ7DqL-8FDmzobsz0QFw4qRMJ_bAXXZzOrtDmLXFLR2ubBAXrUvAEenYhwfyopbi6WtBRwnJqxrdEpnXMFhrCico9gASC2jfV2wPeMUh-70jVmMDtouzplm7R2Ige8ND5pBLOJ1umoYV7b17tktnI5rVbQYQJaRTXRNlG5rE_ULP7EgaHTtfybfwI0focCEESGl_kASlmUnOtf3ETM')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/40 via-transparent to-transparent pointer-events-none"></div>

            {/* Pins */}
            {filteredItems.map((item, idx) => {
              const pinBg =
                item.urgency === 'Urgent'
                  ? 'bg-error text-white'
                  : item.urgency === 'High'
                  ? 'bg-tertiary text-white'
                  : item.category === 'Bakery'
                  ? 'bg-primary-container text-white'
                  : 'bg-secondary text-white';

              const isSelected = activePinId === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    top: `${item.mapCoords.yPercent}%`,
                    left: `${item.mapCoords.xPercent}%`,
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                  onClick={() => {
                    setActivePinId(item.id);
                    onOpenClaimModal(item);
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    {item.urgency === 'Urgent' && (
                      <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-error opacity-60"></span>
                    )}
                    <div
                      className={`relative w-8 h-8 rounded-full ${pinBg} flex items-center justify-center shadow-lg font-bold text-[12px] border-2 border-white transition-transform group-hover:scale-125 ${
                        isSelected ? 'scale-125 ring-4 ring-primary/40' : ''
                      }`}
                    >
                      {item.mapCoords.pinNumber || idx + 1}
                    </div>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-2.5 rounded-xl shadow-2xl text-[11px] w-52 pointer-events-none z-30 border border-white/10">
                    <span className="font-bold text-primary-fixed">{item.location}</span>
                    <span className="font-semibold text-white">{item.title}</span>
                    <span className="text-[10px] text-surface-container-highest">
                      {item.donorName} • {item.servings} meals ({item.quantityKg} kg)
                    </span>
                    <span className="text-tertiary-fixed-dim font-bold mt-1">
                      Deadline: {item.deadline}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-surface/90 backdrop-blur-md shadow-md text-[12px] flex flex-wrap items-center gap-4 border border-surface-container">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-error"></span>
                <span>Urgent (&lt;1h)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                <span>High Priority</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                <span>Bakery / Stable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span>Produce & Raw</span>
              </div>
            </div>

            {/* Hint overlay */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-surface/90 backdrop-blur-md text-[11px] font-semibold text-on-surface shadow-xs">
              Click any numbered pin to preview and claim surplus
            </div>
          </div>
        </div>
      )}

      {/* GRID OF FOOD LISTINGS */}
      {viewMode === 'grid' && (
        <>
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col items-center gap-3 border border-surface-container">
              <span className="material-symbols-outlined text-tertiary text-[48px]">search_off</span>
              <h4 className="text-[20px] font-bold text-on-surface">
                No food rescue items match your current filters
              </h4>
              <p className="text-[14px] text-on-surface-variant max-w-md">
                Try expanding your distance slider or resetting dietary preferences to find nearby surplus.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-[13px] font-bold hover:bg-surface-tint shadow-sm cursor-pointer"
              >
                Reset Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isUrgent = item.urgency === 'Urgent';
                const isHigh = item.urgency === 'High';

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 border border-surface-container hover:border-primary/30"
                  >
                    <div className="flex flex-col gap-3">
                      {/* Top status & distance */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                            isUrgent
                              ? 'bg-error-container text-on-error-container'
                              : isHigh
                              ? 'bg-tertiary-container text-on-tertiary-container'
                              : 'bg-surface-container-high text-on-surface'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isUrgent ? 'bg-error animate-pulse' : isHigh ? 'bg-tertiary' : 'bg-primary'
                            }`}
                          ></span>
                          <span>
                            {item.urgency} (Collect by {item.deadline})
                          </span>
                        </span>

                        <span className="text-[12px] text-on-surface-variant flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[15px]">near_me</span>
                          <span>
                            {item.location.split(' ')[0]} • {item.distanceKm} km
                          </span>
                        </span>
                      </div>

                      {/* Title & Category */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[18px] font-bold text-on-surface leading-snug">
                            {item.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-bold whitespace-nowrap shrink-0">
                            {item.dietary}
                          </span>
                        </div>
                        <p className="text-[13px] text-on-surface-variant font-medium">
                          {item.donorName} • {item.donorType}
                        </p>
                      </div>

                      {/* Detail Metrics strip */}
                      <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-surface-container-low text-[12px]">
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase font-bold tracking-wider">
                            Quantity
                          </span>
                          <span className="font-bold text-on-surface">
                            {item.servings} Meals ({item.quantityKg} kg)
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase font-bold tracking-wider">
                            Cook Time
                          </span>
                          <span className="font-bold text-on-surface">{item.cookTime}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase font-bold tracking-wider">
                            Storage
                          </span>
                          <span className="font-bold text-primary flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">
                              {item.storage === 'Hot Pack'
                                ? 'local_fire_department'
                                : item.storage === 'Cold Storage' || item.storage === 'Chilled Pack'
                                ? 'ac_unit'
                                : 'air'}
                            </span>
                            {item.storage}
                          </span>
                        </div>
                      </div>

                      {/* Smart NGO Match box */}
                      <div className="p-2.5 rounded-xl bg-secondary-fixed/40 flex items-center justify-between text-[12px]">
                        <span className="flex items-center gap-1.5 text-on-secondary-fixed font-semibold">
                          <span className="material-symbols-outlined text-primary text-[18px]">
                            auto_awesome
                          </span>
                          <span>Smart Match</span>
                        </span>
                        <span className="font-bold text-primary">
                          {item.smartMatchPercent}% Match ({item.recommendedNGO.split(' ')[0]})
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenSafetyModal(item)}
                          className="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-[12px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
                          <span>Safety & Allergens</span>
                        </button>
                        <button
                          onClick={() => onOpenTimelineModal(item)}
                          title="View Traceability Timeline"
                          className="py-2 px-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-[12px] font-semibold flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">timeline</span>
                        </button>
                      </div>

                      <button
                        onClick={() => onOpenClaimModal(item)}
                        className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-surface-tint text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Claim Food as NGO</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
