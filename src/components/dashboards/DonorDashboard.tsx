import React, { useState, useEffect } from 'react';
import type { Donation, FoodCategory, SmartMatchResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { QrVerificationModal } from '../common/QrVerificationModal';
import {
  PlusCircle,
  QrCode,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  TrendingUp,
  Trash2,
  Calendar,
  Utensils,
  Lightbulb,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';

export const DonorDashboard: React.FC<{
  isOpenCreateModal?: boolean;
  onCloseCreateModal?: () => void;
}> = ({ isOpenCreateModal = false, onCloseCreateModal }) => {
  const { currentUser } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(isOpenCreateModal);
  const [activeTab, setActiveTab] = useState<'listings' | 'waste-prediction'>('listings');
  const [selectedQrDonation, setSelectedQrDonation] = useState<{ id: string; name: string } | null>(null);

  // Form State
  const [foodName, setFoodName] = useState('Vegetable Dum Biryani & Raitha');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(35);
  const [unit, setUnit] = useState<'boxes' | 'kg' | 'portions'>('boxes');
  const [estimatedMeals, setEstimatedMeals] = useState(35);
  const [storageConditions, setStorageConditions] = useState<'Hot Holding (>60°C)' | 'Refrigerated (below 4°C)' | 'Room Temperature (Dry)'>('Hot Holding (>60°C)');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [allergens, setAllergens] = useState('None');
  const [packagingType, setPackagingType] = useState('Compostable Kraft Boxes');
  const [selectedImage, setSelectedImage] = useState('/src/assets/images/marketplace_fresh_meals_1794072150653.jpg');
  const [pickupHours, setPickupHours] = useState(3);
  const [specialInstructions, setSpecialInstructions] = useState('Enter through the kitchen service lane, ask for executive chef.');
  const [isRecurring, setIsRecurring] = useState(false);

  // AI & Matching helpers
  const [aiGeneratingDesc, setAiGeneratingDesc] = useState(false);
  const [aiSafetyReport, setAiSafetyReport] = useState<any>(null);
  const [aiCheckingSafety, setAiCheckingSafety] = useState(false);
  const [smartMatches, setSmartMatches] = useState<SmartMatchResult[]>([]);
  const [wastePrediction, setWastePrediction] = useState<any>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imagePresets = [
    { label: 'Fresh Cooked Meals', url: '/src/assets/images/marketplace_fresh_meals_1794072150653.jpg' },
    { label: 'Artisanal Bakery Breads', url: '/src/assets/images/bakery_surplus_bread_1794072151734.jpg' },
    { label: 'Community Packed Platters', url: '/src/assets/images/hero_food_rescue_1794072150460.jpg' },
    { label: 'Fresh Veggies & Produce', url: '/src/assets/images/food_plate_sharing_1794072151768.jpg' },
  ];

  const fetchDonorData = async () => {
    try {
      setLoading(true);
      const all = await api.getDonations({ donorId: currentUser?.id });
      setDonations(all);
    } catch (err) {
      console.error('Failed to load donor donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, [currentUser?.id]);

  useEffect(() => {
    if (isOpenCreateModal) {
      setIsModalOpen(true);
    }
  }, [isOpenCreateModal]);

  // Handle AI Description Generator
  const handleGenerateAiDescription = async () => {
    setAiGeneratingDesc(true);
    try {
      const res = await api.generateDescription({
        foodName,
        category,
        quantity,
        unit,
        isVegetarian,
        briefNotes: 'Prepared freshly in clean kitchen, sealed in eco containers.',
      });
      setDescription(res.description);
    } catch (err) {
      console.error('AI Desc failed:', err);
    } finally {
      setAiGeneratingDesc(false);
    }
  };

  // Handle AI Food Safety Check
  const handleCheckFoodSafety = async () => {
    setAiCheckingSafety(true);
    try {
      const res = await api.checkFoodSafety({
        foodName,
        category,
        preparationTime: new Date().toISOString(),
        storageConditions,
      });
      setAiSafetyReport(res);
    } catch (err) {
      console.error('Food safety check failed:', err);
    } finally {
      setAiCheckingSafety(false);
    }
  };

  // Handle Food Waste Prediction
  const handleFetchPrediction = async () => {
    setLoadingPrediction(true);
    try {
      const res = await api.predictFoodWaste({
        donorType: currentUser?.donorType || 'Restaurant',
        dayOfWeek: 'Saturday',
        typicalSurplusCategory: category,
      });
      setWastePrediction(res);
    } catch (err) {
      console.error('Waste prediction failed:', err);
    } finally {
      setLoadingPrediction(false);
    }
  };

  // Submit Donation
  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !quantity) {
      setFormError('Please enter food name and quantity.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const now = new Date();
    const deadline = new Date(now.getTime() + pickupHours * 3600 * 1000);

    try {
      await api.createDonation({
        donorId: currentUser?.id || 'user_donor_1',
        foodName,
        category,
        description: description || `${quantity} ${unit} of fresh ${foodName} available for immediate rescue.`,
        quantity: Number(quantity),
        unit,
        estimatedMeals: Number(estimatedMeals) || Number(quantity),
        imageUrl: selectedImage,
        isVegetarian,
        allergens: allergens.split(',').map((s) => s.trim()),
        packagingType,
        storageConditions,
        preparationTime: now.toISOString(),
        pickupStartTime: now.toISOString(),
        pickupDeadline: deadline.toISOString(),
        pickupLocation: {
          address: currentUser?.address || 'Indiranagar, Bengaluru',
          lat: currentUser?.location.lat || 12.9784,
          lng: currentUser?.location.lng || 77.6408,
          area: currentUser?.location.area || 'Indiranagar',
          specialInstructions,
        },
        urgency: pickupHours <= 2 ? 'Urgent' : pickupHours <= 4 ? 'High' : 'Medium',
        aiSafetyNotes: aiSafetyReport?.advisoryNote || 'Inspected by donor. Hygienically packed.',
        isRecurring,
        recurringFrequency: isRecurring ? 'Weekly' : undefined,
      });

      setIsModalOpen(false);
      if (onCloseCreateModal) onCloseCreateModal();
      fetchDonorData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit donation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelDonation = async (id: string) => {
    if (confirm('Are you sure you want to cancel this donation listing?')) {
      await api.cancelDonation(id);
      fetchDonorData();
    }
  };

  // Stats calculation
  const totalKg = donations.reduce((acc, d) => acc + (d.unit === 'kg' ? d.quantity : d.quantity * 0.4), currentUser?.totalKgDonated || 0);
  const totalMeals = donations.reduce((acc, d) => acc + d.estimatedMeals, (currentUser?.completedDonationsCount || 0) * 25);
  const activeCount = donations.filter((d) => ['Available', 'Claimed', 'In Transit'].includes(d.status)).length;

  return (
    <div className="py-10 bg-[#F7FAF7] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Donor Banner Header */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center text-xl font-bold shadow-xs">
              👨‍🍳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B4332]">
                  {currentUser?.organizationName || currentUser?.name}
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {currentUser?.donorType || 'Restaurant'} Donor
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                {currentUser?.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsModalOpen(true);
                handleCheckFoodSafety();
              }}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Post Surplus Food
            </button>
          </div>
        </div>

        {/* 4 Metric Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Total Food Rescued</p>
            <p className="text-2xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
              {Math.round(totalKg)} <span className="text-xs font-sans text-neutral-500 font-normal">kg</span>
            </p>
            <p className="text-[11px] text-[#2E7D32] mt-0.5">Diverted from waste</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Plates Shared</p>
            <p className="text-2xl font-extrabold text-[#2E7D32] font-mono tabular-nums mt-1">
              {totalMeals} <span className="text-xs font-sans text-neutral-500 font-normal">meals</span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">To local Bengaluru shelters</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Active Donations</p>
            <p className="text-2xl font-extrabold text-[#F4A261] font-mono tabular-nums mt-1">
              {activeCount}
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Open or in transit</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Donor Impact Rating</p>
            <p className="text-2xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
              4.9 <span className="text-xs font-sans text-amber-500">★</span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Verified by receiving NGOs</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'listings'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
            }`}
          >
            My Food Donations ({donations.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('waste-prediction');
              if (!wastePrediction) handleFetchPrediction();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'waste-prediction'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> AI Food Waste Prediction & Tips
          </button>
        </div>

        {activeTab === 'listings' ? (
          /* Donations Table / Grid */
          donations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
              <Utensils className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-neutral-800">No donations posted yet</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Got surplus cooked food, bakery bread, or ingredients? List it now to alert nearby verified NGOs.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#2E7D32] rounded-lg"
              >
                + Post First Donation
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7FAF7] text-neutral-500 uppercase tracking-wider text-[10px] border-b border-neutral-200">
                    <tr>
                      <th className="py-3 px-4">Item & Category</th>
                      <th className="py-3 px-4">Quantity / Meals</th>
                      <th className="py-3 px-4">Pickup Deadline</th>
                      <th className="py-3 px-4">Claimed By NGO</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {donations.map((d) => (
                      <tr key={d.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={d.imageUrl}
                              alt={d.foodName}
                              className="w-10 h-10 rounded-lg object-cover bg-neutral-100"
                            />
                            <div>
                              <p className="font-bold text-neutral-900">{d.foodName}</p>
                              <p className="text-[11px] text-neutral-500">{d.category} · {d.storageConditions.split(' ')[0]}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-medium text-neutral-800 tabular-nums">
                          {d.quantity} {d.unit} (~{d.estimatedMeals} meals)
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600">
                          {new Date(d.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="py-3.5 px-4">
                          {d.claimedByNgoName ? (
                            <span className="font-semibold text-[#1B4332]">{d.claimedByNgoName}</span>
                          ) : (
                            <span className="text-neutral-400 italic">Unclaimed</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              d.status === 'Available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : d.status === 'Claimed'
                                ? 'bg-amber-100 text-amber-800'
                                : d.status === 'Picked Up' || d.status === 'In Transit'
                                ? 'bg-blue-100 text-blue-800'
                                : d.status === 'Delivered'
                                ? 'bg-emerald-700 text-white'
                                : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Handover QR Button */}
                            <button
                              onClick={() => setSelectedQrDonation({ id: d.id, name: d.foodName })}
                              className="p-1.5 rounded-lg text-[#2E7D32] hover:bg-emerald-50 border border-emerald-200 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Show Handover QR & OTP"
                            >
                              <QrCode className="w-3.5 h-3.5" /> Handover Code
                            </button>

                            {d.status === 'Available' && (
                              <button
                                onClick={() => handleCancelDonation(d.id)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Cancel Listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          /* Food Waste Prediction Tab */
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="font-bold text-base text-[#1B4332] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F4A261]" /> AI Surplus Forecast & Kitchen Reduction Analyst
                </h3>
                <p className="text-xs text-neutral-500">Powered by historical surplus averages & Gemini analytics</p>
              </div>
              <button
                onClick={handleFetchPrediction}
                disabled={loadingPrediction}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#2E7D32] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              >
                {loadingPrediction ? 'Analyzing patterns...' : 'Refresh Forecast'}
              </button>
            </div>

            {wastePrediction && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                    <p className="text-xs text-amber-800 font-medium">Estimated Saturday Surplus</p>
                    <p className="text-3xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
                      ~{wastePrediction.predictedSurplusMeals} <span className="text-xs font-normal">meals</span>
                    </p>
                    <p className="text-[11px] text-amber-700 mt-1">Peak surplus expected around {wastePrediction.likelySurplusTime}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <p className="text-xs text-emerald-800 font-medium">High Surplus Categories</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {wastePrediction.highRiskCategories.map((cat: string) => (
                        <span key={cat} className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-[#1B4332] border border-emerald-200">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <p className="text-xs text-neutral-700 font-medium">Recommended Advance Action</p>
                    <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-semibold">
                      {wastePrediction.suggestedAction}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-700">Kitchen Waste Prevention Directives</h4>
                  <div className="space-y-2">
                    {wastePrediction.preventionRecommendations.map((tip: string, idx: number) => (
                      <div key={idx} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE DONATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#F7FAF7]">
              <div>
                <h3 className="text-base font-extrabold text-[#1B4332]">Post Surplus Food Donation</h3>
                <p className="text-xs text-neutral-500">Bengaluru Community Rescue · Immediate NGO Matching</p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseCreateModal) onCloseCreateModal();
                }}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitDonation} className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-700">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                  {formError}
                </div>
              )}

              {/* Row 1: Food Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Food Item Name *</label>
                  <input
                    type="text"
                    required
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g. Vegetable Dum Biryani & Dal"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:border-[#2E7D32] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodCategory)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white focus:border-[#2E7D32] focus:outline-hidden"
                  >
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Bakery Products">Bakery Products</option>
                    <option value="Vegetables">Fresh Vegetables</option>
                    <option value="Fruits">Fresh Fruits</option>
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Raw Ingredients">Raw Ingredients</option>
                    <option value="Dairy Products">Dairy Products</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Quantity, Unit, Estimated Meals */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setQuantity(val);
                      setEstimatedMeals(val);
                    }}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white"
                  >
                    <option value="boxes">Boxes / Packs</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="portions">Portions</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Estimated Meals</label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedMeals}
                    onChange={(e) => setEstimatedMeals(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              {/* AI Description Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-neutral-800">Description & Pickup Notes</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={aiGeneratingDesc}
                    className="text-[11px] font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
                    {aiGeneratingDesc ? 'Drafting via Gemini...' : 'Generate with Gemini AI'}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe meal ingredients, freshness, and packaging details..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:border-[#2E7D32] focus:outline-hidden"
                />
              </div>

              {/* Photo Preset Selector */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1.5">Select Food Image</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {imagePresets.map((preset) => (
                    <button
                      type="button"
                      key={preset.url}
                      onClick={() => setSelectedImage(preset.url)}
                      className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer ${
                        selectedImage === preset.url
                          ? 'border-[#2E7D32] shadow-sm ring-2 ring-[#2E7D32]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-semibold py-0.5 px-1 truncate text-center">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage, Diet & Allergen info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Storage Condition</label>
                  <select
                    value={storageConditions}
                    onChange={(e) => setStorageConditions(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white"
                  >
                    <option value="Hot Holding (>60°C)">Hot Holding (&gt;60°C)</option>
                    <option value="Room Temperature (Dry)">Room Temperature (Dry)</option>
                    <option value="Refrigerated (below 4°C)">Refrigerated (&lt;4°C)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Dietary Classification</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={isVegetarian}
                        onChange={() => setIsVegetarian(true)}
                        className="text-[#2E7D32]"
                      />
                      <span>Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isVegetarian}
                        onChange={() => setIsVegetarian(false)}
                        className="text-[#2E7D32]"
                      />
                      <span>Non-Veg</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Known Allergens</label>
                  <input
                    type="text"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    placeholder="e.g. Nuts, Dairy, None"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Pickup Timing & Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Pickup Deadline Window</label>
                  <select
                    value={pickupHours}
                    onChange={(e) => setPickupHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white"
                  >
                    <option value={2}>Within 2 hours (Urgent)</option>
                    <option value={3}>Within 3 hours (Recommended for warm meals)</option>
                    <option value={5}>Within 5 hours</option>
                    <option value={8}>Within 8 hours (Bakery / Dry Produce)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Special Collection Instructions</label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Park at service gate, ask for Chef"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Food Safety Assistant Checklist (Gemini) */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1B4332] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                    AI Food Safety & FSSAI Compliance
                  </span>
                  <button
                    type="button"
                    onClick={handleCheckFoodSafety}
                    disabled={aiCheckingSafety}
                    className="text-[11px] font-semibold text-[#2E7D32] hover:underline"
                  >
                    {aiCheckingSafety ? 'Verifying...' : 'Re-verify with Gemini'}
                  </button>
                </div>

                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  {aiSafetyReport?.advisoryNote ||
                    'Meals should be packed in clean food-grade containers and collected within safe holding thresholds. Visual & aroma inspection required before digital QR scan.'}
                </p>

                <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32]" /> Packaged in food-grade sealed boxes
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32]" /> Hot food maintained above 60°C
                  </div>
                </div>
              </div>

              {/* Recurring Donation Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded text-[#2E7D32] focus:ring-[#2E7D32]"
                  />
                  <span>Schedule this as a recurring weekly surplus donation</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onCloseCreateModal) onCloseCreateModal();
                  }}
                  className="px-4 py-2 font-semibold text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Food Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Handover Modal */}
      {selectedQrDonation && (
        <QrVerificationModal
          donationId={selectedQrDonation.id}
          foodName={selectedQrDonation.name}
          onClose={() => setSelectedQrDonation(null)}
        />
      )}
    </div>
  );
};
