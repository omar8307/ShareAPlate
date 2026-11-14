import React, { useState, useMemo } from 'react';
import type { Donation, FoodCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Search,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  X,
  Phone,
} from 'lucide-react';

interface MarketplaceProps {
  donations: Donation[];
  onRefresh: () => void;
  onOpenNewDonation?: () => void;
  onSelectDonationOnMap?: (donation: Donation) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  donations,
  onRefresh,
  onOpenNewDonation,
  onSelectDonationOnMap,
}) => {
  const { currentUser, openAuthModal } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('Available');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const categories = [
    'All',
    'Cooked Meals',
    'Bakery Products',
    'Vegetables',
    'Fruits',
    'Packaged Food',
    'Dairy Products',
  ];

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const matchesSearch =
        d.foodName.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase()) ||
        d.donorName.toLowerCase().includes(search.toLowerCase()) ||
        d.pickupLocation.area.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || d.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'All' || d.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [donations, search, selectedCategory, selectedStatus]);

  const handleClaim = async (donation: Donation) => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    if (currentUser.role !== 'ngo') {
      setClaimError('Only registered NGO relief organizations can claim food donations. Please switch to an NGO persona in the top bar to test.');
      return;
    }

    if (!currentUser.isVerified) {
      setClaimError('Your NGO account is currently pending verification by the ShareAPlate compliance team. Please use the Admin console to approve this NGO or switch to verified Annapoorna Relief.');
      return;
    }

    setIsClaiming(true);
    setClaimError(null);
    try {
      await api.claimDonation(donation.id, currentUser.id, currentUser.organizationName || currentUser.name);
      setClaimSuccessMessage(`Successfully claimed ${donation.foodName}! Pickup task dispatched to community volunteers.`);
      onRefresh();
      setTimeout(() => {
        setClaimSuccessMessage(null);
        setSelectedDonation(null);
      }, 2500);
    } catch (err: any) {
      setClaimError(err.message || 'Failed to claim donation.');
    } finally {
      setIsClaiming(false);
    }
  };

  const formatDeadline = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="py-10 bg-[#F7FAF7] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight">
              Food Rescue Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Active surplus food donations from restaurants, hotels, and bakeries across Bengaluru.
            </p>
          </div>

          {currentUser?.role === 'donor' && onOpenNewDonation && (
            <button
              onClick={onOpenNewDonation}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              + Post New Donation
            </button>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search food by name, restaurant, or area (e.g., Indiranagar, Pulao)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-[#2E7D32] focus:bg-white transition-all"
              />
            </div>

            {/* Status Segmented Buttons */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl w-full md:w-auto overflow-x-auto whitespace-nowrap">
              {['Available', 'Claimed', 'In Transit', 'All'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    selectedStatus === st
                      ? 'bg-white text-[#1B4332] shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap text-xs">
            <span className="text-neutral-400 text-[11px] font-semibold mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#2E7D32] text-white font-semibold'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Donations Grid */}
        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-800">No food donations match your filter</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
              Try adjusting your category or status filter, or check back soon as restaurants post lunch & dinner surplus.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#2E7D32] bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => {
              const isAvailable = donation.status === 'Available';
              return (
                <div
                  key={donation.id}
                  className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 hover:border-[#2E7D32]/40 transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Image Slot */}
                    <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                      <img
                        src={donation.imageUrl}
                        alt={donation.foodName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            donation.status === 'Available'
                              ? 'bg-emerald-600 text-white'
                              : donation.status === 'Claimed'
                              ? 'bg-amber-600 text-white'
                              : donation.status === 'In Transit'
                              ? 'bg-blue-600 text-white'
                              : 'bg-neutral-700 text-white'
                          }`}
                        >
                          {donation.status}
                        </span>

                        {donation.isVegetarian && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-emerald-800 backdrop-blur-xs">
                            Veg
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            donation.urgency === 'Urgent'
                              ? 'bg-rose-600 text-white'
                              : donation.urgency === 'High'
                              ? 'bg-amber-500 text-white'
                              : 'bg-white/90 text-neutral-700 backdrop-blur-xs'
                          }`}
                        >
                          {donation.urgency} Urgency
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="text-xs text-neutral-500 font-medium flex items-center justify-between">
                          <span>{donation.category}</span>
                          <span className="font-semibold text-neutral-800">
                            {donation.estimatedMeals} Plates / {donation.quantity} {donation.unit}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#1B4332] mt-1 leading-snug line-clamp-1">
                          {donation.foodName}
                        </h3>
                        <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                          {donation.description}
                        </p>
                      </div>

                      {/* Location & Time Info */}
                      <div className="space-y-1.5 pt-2 border-t border-neutral-100 text-xs text-neutral-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                          <span className="truncate">{donation.pickupLocation.area} · {donation.donorName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#F4A261] shrink-0" />
                          <span>Collect before <strong className="text-neutral-800">{formatDeadline(donation.pickupDeadline)}</strong></span>
                        </div>
                      </div>

                      {/* Dietary / Allergens */}
                      <div className="flex flex-wrap items-center gap-1 text-[11px] text-neutral-500 pt-1">
                        <span>Allergens:</span>
                        <span className="text-neutral-700 font-medium">
                          {donation.allergens.join(', ') || 'None'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 pb-5 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedDonation(donation)}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#2E7D32] hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Details & Timeline
                    </button>

                    {isAvailable ? (
                      <button
                        onClick={() => handleClaim(donation)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        Claim Food
                      </button>
                    ) : (
                      <span className="text-xs text-neutral-500 font-medium italic">
                        Claimed by {donation.claimedByNgoName?.split(' ')[0] || 'NGO'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail & Claim Modal / Drawer */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                <h3 className="text-base font-bold text-[#1B4332]">Donation Dossier</h3>
                <span className="text-xs text-neutral-500 font-mono">#{selectedDonation.id}</span>
              </div>
              <button
                onClick={() => setSelectedDonation(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-700">
              {claimSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  {claimSuccessMessage}
                </div>
              )}

              {claimError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  {claimError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-sm text-[#1B4332]">{selectedDonation.foodName}</h4>
                  <p className="text-xs text-neutral-600 mt-1">{selectedDonation.description}</p>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <p>
                      <strong>Category:</strong> {selectedDonation.category}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {selectedDonation.quantity} {selectedDonation.unit} (~{selectedDonation.estimatedMeals} meals)
                    </p>
                    <p>
                      <strong>Storage Mode:</strong> {selectedDonation.storageConditions}
                    </p>
                    <p>
                      <strong>Packaging:</strong> {selectedDonation.packagingType}
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 space-y-2">
                  <h5 className="font-semibold text-neutral-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2E7D32]" /> Food Safety Audit
                  </h5>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    {selectedDonation.aiSafetyNotes || 'Food inspected by donor. Meets ShareAPlate preparation and packaging quality standards.'}
                  </p>
                  <div className="pt-2 border-t border-neutral-200/60 text-[11px] space-y-1">
                    <p><strong>Prepared:</strong> {new Date(selectedDonation.preparationTime).toLocaleString()}</p>
                    <p><strong>Pickup Window:</strong> {formatDeadline(selectedDonation.pickupStartTime)} – {formatDeadline(selectedDonation.pickupDeadline)}</p>
                  </div>
                </div>
              </div>

              {/* Pickup Address */}
              <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl space-y-1.5">
                <p className="font-semibold text-[#1B4332] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2E7D32]" /> Pickup Address & Contact
                </p>
                <p className="text-xs font-medium text-neutral-800">{selectedDonation.pickupLocation.address}</p>
                {selectedDonation.pickupLocation.specialInstructions && (
                  <p className="text-[11px] text-neutral-600 italic">
                    Note: "{selectedDonation.pickupLocation.specialInstructions}"
                  </p>
                )}
                <div className="flex items-center gap-4 pt-1 text-[11px] text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#2E7D32]" /> {selectedDonation.donorPhone}
                  </span>
                  <span>Donor: {selectedDonation.donorName}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h5 className="font-semibold text-neutral-900 mb-2">Audit Status Timeline</h5>
                <div className="space-y-2 border-l-2 border-neutral-200 ml-2 pl-3">
                  {selectedDonation.statusHistory.map((hist, idx) => (
                    <div key={idx} className="relative text-[11px]">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                      <p className="font-semibold text-neutral-900">
                        {hist.status} <span className="font-normal text-neutral-500">by {hist.updatedBy} ({hist.actorRole})</span>
                      </p>
                      <p className="text-neutral-400 font-mono text-[10px]">{new Date(hist.timestamp).toLocaleTimeString()}</p>
                      {hist.note && <p className="text-neutral-600 mt-0.5">{hist.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <button
                onClick={() => setSelectedDonation(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {onSelectDonationOnMap && (
                  <button
                    onClick={() => {
                      onSelectDonationOnMap(selectedDonation);
                      setSelectedDonation(null);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-[#1B4332] bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
                  >
                    View on Map
                  </button>
                )}

                {selectedDonation.status === 'Available' && (
                  <button
                    disabled={isClaiming}
                    onClick={() => handleClaim(selectedDonation)}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isClaiming ? 'Claiming...' : 'Claim This Donation'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
