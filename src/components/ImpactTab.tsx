import React, { useState } from 'react';

export const ImpactTab: React.FC = () => {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const monthlyData = [
    { month: 'Oct', volumeKg: 1940, heightPct: 38 },
    { month: 'Nov', volumeKg: 2420, heightPct: 48 },
    { month: 'Dec', volumeKg: 3100, heightPct: 60 },
    { month: 'Jan', volumeKg: 3780, heightPct: 72 },
    { month: 'Feb', volumeKg: 4390, heightPct: 84 },
    { month: 'Mar', volumeKg: 4820, heightPct: 96, isCurrent: true },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner Summary */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-surface-container">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[26px]">public</span>
            <h2 className="text-[20px] font-bold text-on-surface">
              Bengaluru Citywide Ecological Impact
            </h2>
          </div>
          <p className="text-[14px] text-on-surface-variant">
            Transparent municipal ledger: tracking food recovery metrics, greenhouse gas reduction, and meals supplied.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-xl bg-secondary-fixed/40 text-left border border-primary/20">
            <span className="text-[12px] text-on-secondary-fixed block font-semibold">
              Total CO2e Prevented
            </span>
            <span className="text-[24px] text-primary font-extrabold tabular-nums">
              46,125 kg CO2e
            </span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">
              (1 kg food rescue = 2.5 kg CO2e diverted from landfills)
            </span>
          </div>
        </div>
      </div>

      {/* Visual Charts Mosaic: Bar Chart (Monthly) + Category Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* MONTHLY RESCUE VOLUME BAR CHART */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-5 border border-surface-container">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[20px] font-bold text-on-surface">
                Rescued Food Volume (kg) — Past 6 Months
              </h3>
              <p className="text-[12px] text-on-surface-variant">Validated municipal weight receipts</p>
            </div>
            <span className="text-[12px] text-primary font-bold px-2.5 py-1 bg-secondary-container rounded-lg">
              +28% MoM Growth
            </span>
          </div>

          {/* Clean Tailwind SVG bar visualization */}
          <div className="w-full flex flex-col gap-2 pt-4">
            <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pb-4 border-b border-surface-container">
              {monthlyData.map((d) => (
                <div
                  key={d.month}
                  onMouseEnter={() => setHoveredMonth(d.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <span
                    className={`text-[11px] font-bold transition-opacity tabular-nums ${
                      d.isCurrent || hoveredMonth === d.month
                        ? 'opacity-100 text-primary'
                        : 'opacity-0 group-hover:opacity-100 text-on-surface-variant'
                    }`}
                  >
                    {d.volumeKg.toLocaleString()} kg
                  </span>

                  <div
                    className={`w-full max-w-[44px] rounded-t-lg transition-all duration-300 ${
                      d.isCurrent
                        ? 'bg-primary shadow-md group-hover:brightness-95'
                        : d.month === 'Jan' || d.month === 'Feb'
                        ? 'bg-primary-container group-hover:brightness-95'
                        : 'bg-secondary-container group-hover:brightness-95'
                    }`}
                    style={{ height: `${d.heightPct}%` }}
                  ></div>

                  <span
                    className={`text-[12px] font-semibold ${
                      d.isCurrent ? 'font-bold text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {d.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[12px] text-on-surface-variant px-2 pt-1">
              <span className="font-semibold">Total Rescued: 20,450 kg</span>
              <span className="flex items-center gap-1 font-medium text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                <span>Bengaluru Municipal Target: Exceeded (+14%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* CATEGORY DISTRIBUTION DONUT VISUALIZATION */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-5 border border-surface-container">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-bold text-on-surface">Surplus by Category</h3>
            <span className="text-[12px] text-on-surface-variant font-medium">March 2025</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* Inline SVG Donut Chart */}
            <div className="relative w-44 h-44 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background ring */}
                <path
                  className="text-surface-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4.5"
                ></path>
                {/* Cooked meals: 54% */}
                <path
                  className="text-primary transition-all duration-500 hover:opacity-80 cursor-pointer"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="54, 100"
                  strokeWidth="4.5"
                ></path>
                {/* Bakery: 24% */}
                <path
                  className="text-tertiary transition-all duration-500 hover:opacity-80 cursor-pointer"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="24, 100"
                  strokeDashoffset="-54"
                  strokeWidth="4.5"
                ></path>
                {/* Fresh Produce: 14% */}
                <path
                  className="text-secondary transition-all duration-500 hover:opacity-80 cursor-pointer"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="14, 100"
                  strokeDashoffset="-78"
                  strokeWidth="4.5"
                ></path>
                {/* Dairy: 8% */}
                <path
                  className="text-outline transition-all duration-500 hover:opacity-80 cursor-pointer"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="8, 100"
                  strokeDashoffset="-92"
                  strokeWidth="4.5"
                ></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[20px] font-extrabold text-on-surface">54%</span>
                <span className="text-[11px] text-on-surface-variant uppercase font-semibold">
                  Cooked
                </span>
              </div>
            </div>

            {/* Legend breakdown */}
            <div className="flex flex-col gap-2.5 w-full text-[12px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span>Cooked Meals</span>
                </span>
                <span className="font-bold text-on-surface">54% (9,963 kg)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                  <span>Bakery & Breads</span>
                </span>
                <span className="font-bold text-on-surface">24% (4,428 kg)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span>Fresh Produce</span>
                </span>
                <span className="font-bold text-on-surface">14% (2,583 kg)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-outline"></span>
                  <span>Dairy Items</span>
                </span>
                <span className="font-bold text-on-surface">8% (1,476 kg)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LEADERBOARD OF TOP COMMERCIAL DONORS & NGOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Donors */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-surface-container">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-bold text-on-surface">Top Food Donors (Bengaluru)</h3>
            <span className="text-[12px] text-primary font-bold">Zero Waste Leaders</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold text-[12px] flex items-center justify-center">
                  1
                </span>
                <div>
                  <div className="font-bold text-[14px] text-on-surface">Grand Palace Caterers</div>
                  <div className="text-[12px] text-on-surface-variant">Indiranagar • 64 donations</div>
                </div>
              </div>
              <span className="font-extrabold text-primary text-[14px] tabular-nums">3,420 kg</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary font-bold text-[12px] flex items-center justify-center">
                  2
                </span>
                <div>
                  <div className="font-bold text-[14px] text-on-surface">TechPark Canteen Central</div>
                  <div className="text-[12px] text-on-surface-variant">Electronic City • 51 donations</div>
                </div>
              </div>
              <span className="font-extrabold text-primary text-[14px] tabular-nums">2,890 kg</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary font-bold text-[12px] flex items-center justify-center">
                  3
                </span>
                <div>
                  <div className="font-bold text-[14px] text-on-surface">The Daily Crumb Bakery</div>
                  <div className="text-[12px] text-on-surface-variant">Koramangala • 48 donations</div>
                </div>
              </div>
              <span className="font-extrabold text-primary text-[14px] tabular-nums">1,640 kg</span>
            </div>
          </div>
        </div>

        {/* Top Verified NGOs */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-surface-container">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-bold text-on-surface">Top Relief Beneficiaries</h3>
            <span className="text-[12px] text-secondary font-bold">Verified Distributers</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[12px] flex items-center justify-center">
                  1
                </span>
                <div>
                  <div className="font-bold text-[14px] text-on-surface">Feeding Hope Trust</div>
                  <div className="text-[12px] text-on-surface-variant">Austin Town & Majestic Shelters</div>
                </div>
              </div>
              <span className="font-extrabold text-secondary text-[14px] tabular-nums">
                14,210 meals
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[12px] flex items-center justify-center">
                  2
                </span>
                <div>
                  <div className="font-bold text-[14px] text-on-surface">Akshaya Mitra Foundation</div>
                  <div className="text-[12px] text-on-surface-variant">Koramangala Slums</div>
                </div>
              </div>
              <span className="font-extrabold text-secondary text-[14px] tabular-nums">
                11,850 meals
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[12px] flex items-center justify-center">
                  3
                </span>
                <div>
                  <div className="font-bold text-[14px] text-on-surface">Sneha Care Home</div>
                  <div className="text-[12px] text-on-surface-variant">Sarjapur Rural Relief Center</div>
                </div>
              </div>
              <span className="font-extrabold text-secondary text-[14px] tabular-nums">
                9,420 meals
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
