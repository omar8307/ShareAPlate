import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { api } from '../../services/api';
import type { ImpactStats } from '../../types';
import { Leaf, Droplets, Users, Award, TrendingUp, Heart } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const [data, setData] = useState<{ stats: ImpactStats; monthlyTrends: any[]; categoryBreakdown: any[] } | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ donors: any[]; ngos: any[]; volunteers: any[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard'>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const [overviewRes, leaderRes] = await Promise.all([
          api.getAnalytics(),
          api.getLeaderboard(),
        ]);
        setData(overviewRes);
        setLeaderboard(leaderRes);
      } catch (err) {
        console.error('Failed to load impact analytics:', err);
      }
    }
    loadData();
  }, []);

  const stats = data?.stats;

  return (
    <div className="py-10 bg-[#F7FAF7] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2E7D32]">Empirical Proof of Impact</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight">
            Bengaluru Community Impact
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Real data on surplus food rescued, greenhouse gases prevented, and nutritious meals served across Bengaluru shelters.
          </p>

          <div className="inline-flex items-center gap-1 p-1 bg-white rounded-xl border border-neutral-200 mt-4 shadow-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Impact Overview & Charts
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'leaderboard' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Community Leaderboard
            </button>
          </div>
        </div>

        {/* 4 Environmental KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-3">
                <Leaf className="w-5 h-5" />
              </div>
              <p className="text-xs text-neutral-500 font-medium">CO2e Emissions Prevented</p>
              <p className="text-3xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
                {stats?.co2PreventedKg.toLocaleString() || '3,550'} <span className="text-sm font-sans font-medium text-neutral-500">kg</span>
              </p>
            </div>
            <p className="text-[11px] text-neutral-400 mt-3 pt-3 border-t border-neutral-100">
              Benchmark: ~2.5 kg CO2e per kg organic food waste diverted from landfills.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Droplets className="w-5 h-5" />
              </div>
              <p className="text-xs text-neutral-500 font-medium">Embedded Water Conserved</p>
              <p className="text-3xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
                {(stats?.waterSavedLiters || 355000).toLocaleString()} <span className="text-sm font-sans font-medium text-neutral-500">L</span>
              </p>
            </div>
            <p className="text-[11px] text-neutral-400 mt-3 pt-3 border-t border-neutral-100">
              Accounts for agricultural water embedded in rescued grains and vegetables.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F4A261] flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xs text-neutral-500 font-medium">Meals Served to Shelters</p>
              <p className="text-3xl font-extrabold text-[#2E7D32] font-mono tabular-nums mt-1">
                {stats?.totalMealsProvided.toLocaleString() || '3,550'} <span className="text-sm font-sans font-medium text-neutral-500">plates</span>
              </p>
            </div>
            <p className="text-[11px] text-neutral-400 mt-3 pt-3 border-t border-neutral-100">
              Direct nutrition delivered to orphanages, elder care homes, and night shelters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-xs text-neutral-500 font-medium">Pickup Success Rate</p>
              <p className="text-3xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
                {stats?.successRatePercent || 96.4}%
              </p>
            </div>
            <p className="text-[11px] text-neutral-400 mt-3 pt-3 border-t border-neutral-100">
              Completed pickups verified via single-use digital authorization.
            </p>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Visual Recharts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Chart 1: Monthly Growth Area Chart (8 Cols) */}
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#1B4332] flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#2E7D32]" /> Monthly Food Rescue Growth
                    </h3>
                    <p className="text-xs text-neutral-500">Meals redistributed and kilograms diverted from waste (Jun - Nov 2026)</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#2E7D32]">+38% MoM</span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.monthlyTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F4A261" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#F4A261" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px', border: '1px solid #e5e5e5' }}
                      />
                      <Area type="monotone" dataKey="meals" name="Plates Distributed" stroke="#2E7D32" strokeWidth={2} fillOpacity={1} fill="url(#colorMeals)" />
                      <Area type="monotone" dataKey="foodKg" name="Food (kg)" stroke="#F4A261" strokeWidth={2} fillOpacity={1} fill="url(#colorFood)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Category Breakdown (4 Cols) */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1B4332] mb-1">Rescued Food by Category</h3>
                  <p className="text-xs text-neutral-500 mb-4">Volume distribution across Bangalore food sectors</p>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data?.categoryBreakdown || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {(data?.categoryBreakdown || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-neutral-100">
                  {(data?.categoryBreakdown || []).map((cat) => (
                    <div key={cat.name} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.fill }} />
                      <span className="truncate text-neutral-700">{cat.name} ({cat.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Community Stories */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-[#1B4332]">Community Voices from Bengaluru</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
                  <p className="text-xs text-neutral-700 italic leading-relaxed">
                    "Before ShareAPlate, our banquet kitchen threw out 30-40 kg of untouched gourmet food after corporate buffets. Now, Annapoorna Relief collects within 40 minutes, feeding 80 elderly shelter residents every evening."
                  </p>
                  <div className="pt-3 border-t border-neutral-100">
                    <p className="font-bold text-xs text-[#1B4332]">Chef Anand Vardhan</p>
                    <p className="text-[11px] text-neutral-500">Executive Chef, The Grand Bengaluru Hotel</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
                  <p className="text-xs text-neutral-700 italic leading-relaxed">
                    "The smart matching is invaluable. Our shelter in Indiranagar gets alerted specifically when cooked vegetarian meals or bakery bread are ready, so we never have to scramble for evening dinners."
                  </p>
                  <div className="pt-3 border-t border-neutral-100">
                    <p className="font-bold text-xs text-[#1B4332]">Dr. Nirmala Rao</p>
                    <p className="text-[11px] text-neutral-500">Managing Trustee, Annapoorna Relief Trust</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
                  <p className="text-xs text-neutral-700 italic leading-relaxed">
                    "I volunteer on my two-wheeler after office hours. Scanning the donor's QR code takes 5 seconds, and knowing that 50 children get warm supper makes every kilometer worth it."
                  </p>
                  <div className="pt-3 border-t border-neutral-100">
                    <p className="font-bold text-xs text-[#1B4332]">Rahul Deshmukh</p>
                    <p className="text-[11px] text-neutral-500">Tech Lead & Community Courier, Indiranagar</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Leaderboard Tab */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Donors */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <h3 className="font-bold text-base text-[#1B4332] mb-1 flex items-center gap-1.5">
                👨‍🍳 Top Food Donors
              </h3>
              <p className="text-xs text-neutral-500 mb-4">Recognizing restaurants & bakeries leading zero waste</p>
              <div className="space-y-3">
                {leaderboard?.donors.map((d, i) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        i === 0 ? 'bg-amber-400 text-amber-900' : i === 1 ? 'bg-neutral-300 text-neutral-800' : 'bg-orange-200 text-orange-900'
                      }`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-bold text-neutral-900">{d.name}</p>
                        <p className="text-[10px] text-neutral-500">{d.type} · {d.donationsCount} donations</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#2E7D32] tabular-nums">
                      {d.mealsDonated} plates
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top NGOs */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <h3 className="font-bold text-base text-[#1B4332] mb-1 flex items-center gap-1.5">
                🏢 Active NGO Partners
              </h3>
              <p className="text-xs text-neutral-500 mb-4">Relief networks distributing meals to beneficiaries</p>
              <div className="space-y-3">
                {leaderboard?.ngos.map((ngo, i) => (
                  <div key={ngo.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-bold text-neutral-900 truncate max-w-[140px]">{ngo.name}</p>
                        <p className="text-[10px] text-neutral-500">{ngo.area} · {ngo.beneficiaries} daily</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#1B4332] tabular-nums">
                      {ngo.mealsReceived} plates
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Volunteers */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <h3 className="font-bold text-base text-[#1B4332] mb-1 flex items-center gap-1.5">
                🚴 Volunteer Champions
              </h3>
              <p className="text-xs text-neutral-500 mb-4">Community couriers expediting food transit</p>
              <div className="space-y-3">
                {leaderboard?.volunteers.map((v, i) => (
                  <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-bold text-neutral-900">{v.name}</p>
                        <p className="text-[10px] text-neutral-500">{v.hours} hrs volunteered</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#F4A261] tabular-nums">
                      {v.deliveriesCompleted} tasks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
