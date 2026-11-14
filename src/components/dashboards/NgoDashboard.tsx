import React, { useState, useEffect } from 'react';
import type { Donation, NgoRequirement, SmartMatchResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  ShieldCheck,
  Building,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  PlusCircle,
  Key,
  AlertTriangle,
  Users,
  Utensils,
  X,
  Phone,
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeDonations, setActiveDonations] = useState<Donation[]>([]);
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [requirements, setRequirements] = useState<NgoRequirement[]>([]);
  const [activeTab, setActiveTab] = useState<'claims' | 'smart-matches' | 'requirements'>('claims');

  // Verify Delivery Modal state
  const [verifyDonation, setVerifyDonation] = useState<Donation | null>(null);
  const [verifyOtp, setVerifyOtp] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // New Requirement Modal state
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [reqCategory, setReqCategory] = useState<any>('Cooked Meals');
  const [reqQuantity, setReqQuantity] = useState(80);
  const [reqUnit, setReqUnit] = useState('meals');
  const [reqBeneficiaries, setReqBeneficiaries] = useState(80);
  const [reqUrgency, setReqUrgency] = useState<any>('High');
  const [reqArea, setReqArea] = useState('Indiranagar');
  const [reqNotes, setReqNotes] = useState('For evening shelter distribution.');
  const [isSubmittingReq, setIsSubmittingReq] = useState(false);

  const loadData = async () => {
    try {
      const [allDonations, allReqs] = await Promise.all([
        api.getDonations(),
        api.getRequirements(),
      ]);

      // My claims
      const myClaims = allDonations.filter(
        (d) => d.claimedByNgoId === currentUser?.id || ['Claimed', 'Picked Up', 'In Transit', 'Delivered'].includes(d.status)
      );
      setActiveDonations(myClaims);

      // Open available
      const openAvail = allDonations.filter((d) => d.status === 'Available');
      setAvailableDonations(openAvail);

      // Requirements
      setRequirements(allReqs.filter((r) => r.ngoId === currentUser?.id || r.ngoId === 'user_ngo_1'));
    } catch (err) {
      console.error('Failed to load NGO dashboard data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id]);

  const handleClaim = async (donationId: string) => {
    if (!currentUser?.isVerified) {
      alert('Your NGO account is awaiting verification. Please use the demo Admin console to approve or switch to verified Annapoorna Relief.');
      return;
    }

    try {
      await api.claimDonation(donationId, currentUser.id, currentUser.name);
      loadData();
      setActiveTab('claims');
    } catch (err: any) {
      alert(err.message || 'Failed to claim');
    }
  };

  const handleVerifyDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyDonation || !verifyOtp) return;

    setIsVerifying(true);
    setVerifyError(null);
    try {
      await api.verifyDelivery(verifyDonation.id, verifyOtp, currentUser?.name || 'NGO Representative');
      setVerifySuccess(`Delivery of ${verifyDonation.foodName} successfully confirmed!`);
      setTimeout(() => {
        setVerifySuccess(null);
        setVerifyDonation(null);
        setVerifyOtp('');
        loadData();
      }, 2000);
    } catch (err: any) {
      setVerifyError(err.message || 'Invalid delivery OTP.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReq(true);
    try {
      await api.createRequirement({
        ngoId: currentUser?.id || 'user_ngo_1',
        ngoName: currentUser?.name || 'Annapoorna Relief',
        category: reqCategory,
        requiredQuantity: reqQuantity,
        unit: reqUnit,
        beneficiaryCount: reqBeneficiaries,
        area: reqArea,
        urgency: reqUrgency,
        specialNotes: reqNotes,
        isVegetarianOnly: true,
      });
      setIsReqModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReq(false);
    }
  };

  return (
    <div className="py-10 bg-[#F7FAF7] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* NGO Header */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center text-xl font-bold shadow-xs">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B4332]">{currentUser?.name}</h1>
                {currentUser?.isVerified ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> 80G Verified Partner
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Pending Admin Verification
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                {currentUser?.address} · Serving ~{currentUser?.beneficiaryCount || 350} daily beneficiaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReqModalOpen(true)}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Publish Food Requirement
            </button>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Meals Received</p>
            <p className="text-2xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
              {((currentUser?.completedDonationsCount || 60) * 35).toLocaleString()}
            </p>
            <p className="text-[11px] text-[#2E7D32] mt-0.5">Distributed to beneficiaries</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Daily Beneficiaries</p>
            <p className="text-2xl font-extrabold text-[#2E7D32] font-mono tabular-nums mt-1">
              {currentUser?.beneficiaryCount || 350} <span className="text-xs font-sans text-neutral-500 font-normal">people</span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Shelters, care homes & kitchens</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Active Claims & Pickups</p>
            <p className="text-2xl font-extrabold text-[#F4A261] font-mono tabular-nums mt-1">
              {activeDonations.filter((d) => d.status !== 'Delivered').length}
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Under courier dispatch</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Active Food Requests</p>
            <p className="text-2xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
              {requirements.length}
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Open for donor response</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'claims'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
            }`}
          >
            My Claims & Incoming Food ({activeDonations.length})
          </button>
          <button
            onClick={() => setActiveTab('smart-matches')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'smart-matches'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" /> Smart NGO Match Feed ({availableDonations.length})
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'requirements'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
            }`}
          >
            Our Published Requirements ({requirements.length})
          </button>
        </div>

        {activeTab === 'claims' && (
          /* Active Claims Table */
          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7FAF7] text-neutral-500 uppercase tracking-wider text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Donation & Donor</th>
                    <th className="py-3 px-4">Quantity / Plates</th>
                    <th className="py-3 px-4">Courier Status</th>
                    <th className="py-3 px-4">Assigned Volunteer</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Delivery Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {activeDonations.map((d) => (
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
                            <p className="text-[11px] text-neutral-500">{d.donorName} · {d.pickupLocation.area}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-neutral-800 tabular-nums">
                        {d.quantity} {d.unit} (~{d.estimatedMeals} meals)
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-neutral-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#F4A261]" />
                          Deadline: {new Date(d.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {d.assignedVolunteerName ? (
                          <span className="font-bold text-[#1B4332]">{d.assignedVolunteerName}</span>
                        ) : (
                          <span className="text-neutral-400 italic">Assigning courier...</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            d.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : d.status === 'In Transit' || d.status === 'Picked Up'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {d.status === 'In Transit' || d.status === 'Picked Up' || d.status === 'Claimed' ? (
                          <button
                            onClick={() => {
                              setVerifyDonation(d);
                              setVerifyOtp(d.otpCode); // Pre-fill with matching OTP for quick demo testing!
                            }}
                            className="px-3 py-1.5 text-[11px] font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-lg shadow-xs transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Key className="w-3.5 h-3.5" /> Confirm Receipt (OTP)
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center justify-end gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Received & Distributed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'smart-matches' && (
          /* Smart Match Feed */
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                Algorithmic Match Criteria: 40% Proximity + 25% Beneficiary Capacity + 20% Pickup Feasibility + 15% Category Fit
              </span>
              <span className="font-mono font-bold text-emerald-700">{availableDonations.length} Available Listings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDonations.map((d) => {
                // Compute demo match score for this NGO
                const score = d.isVegetarian ? 96 : 82;
                return (
                  <div key={d.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#1B4332] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#2E7D32]" /> {score}% High Match
                        </span>
                        <span className="text-xs font-semibold text-neutral-500 font-mono">
                          ~2.1 km from your center
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#1B4332]">{d.foodName}</h4>
                      <p className="text-xs text-neutral-600 mt-1">{d.description}</p>

                      <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Volume:</span>
                          <strong>{d.quantity} {d.unit} (~{d.estimatedMeals} meals)</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Donor:</span>
                          <strong>{d.donorName} ({d.pickupLocation.area})</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Must collect by:</span>
                          <strong className="text-amber-700">{new Date(d.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaim(d.id)}
                      className="w-full py-2.5 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Claim This Donation Immediately
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          /* NGO Requirements list */
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-[#1B4332]">Our Published Food Relief Needs</h3>
              <button
                onClick={() => setIsReqModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-[#2E7D32] bg-emerald-50 hover:bg-emerald-100 rounded-lg"
              >
                + Add Need
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-neutral-200/80 bg-[#F7FAF7] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1B4332]">{req.category}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {req.urgency} Urgency
                    </span>
                  </div>
                  <p className="text-neutral-700">
                    Required: <strong>{req.requiredQuantity} {req.unit}</strong> for <strong>{req.beneficiaryCount} beneficiaries</strong>
                  </p>
                  <p className="text-[11px] text-neutral-500">Area: {req.area} · {req.specialNotes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CONFIRM RECEIPT / VERIFY DELIVERY MODAL */}
      {verifyDonation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-[#1B4332]">Verify Food Delivery Receipt</h3>
              <button
                onClick={() => setVerifyDonation(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Confirm receiving <strong>{verifyDonation.foodName}</strong> ({verifyDonation.quantity} {verifyDonation.unit}) at your distribution kitchen.
            </p>

            {verifySuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                {verifySuccess}
              </div>
            )}

            {verifyError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                {verifyError}
              </div>
            )}

            <form onSubmit={handleVerifyDeliverySubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-neutral-800 text-xs mb-1">
                  Enter 6-Digit Delivery Verification OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verifyOtp}
                  onChange={(e) => setVerifyOtp(e.target.value)}
                  placeholder="e.g. 482910"
                  className="w-full text-center font-mono text-2xl tracking-widest font-bold px-3 py-2 border border-neutral-300 rounded-xl focus:border-[#2E7D32] focus:outline-hidden"
                />
                <p className="text-[11px] text-neutral-500 mt-1 text-center">
                  Provided by the courier volunteer upon physical arrival.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyDonation(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'Confirming...' : 'Verify Delivery & Finalize'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PUBLISH REQUIREMENT MODAL */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-[#1B4332]">Publish Food Need</h3>
              <button onClick={() => setIsReqModalOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Food Category</label>
                <select
                  value={reqCategory}
                  onChange={(e) => setReqCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white"
                >
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Bakery Products">Bakery Products</option>
                  <option value="Vegetables">Fresh Vegetables</option>
                  <option value="Fruits">Fresh Fruits</option>
                  <option value="Packaged Food">Packaged Food</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Required Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={reqQuantity}
                    onChange={(e) => setReqQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Beneficiary Count</label>
                  <input
                    type="number"
                    min="1"
                    value={reqBeneficiaries}
                    onChange={(e) => setReqBeneficiaries(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Area / Neighborhood</label>
                <input
                  type="text"
                  value={reqArea}
                  onChange={(e) => setReqArea(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Special Delivery Notes</label>
                <input
                  type="text"
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  placeholder="e.g. Vegetarian only, needed by 7 PM"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsReqModalOpen(false)}
                  className="px-4 py-2 font-semibold text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReq}
                  className="px-5 py-2 font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Publish Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
