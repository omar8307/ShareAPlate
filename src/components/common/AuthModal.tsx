import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import type { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, demoUsers, switchPersona, register, login } = useAuth();

  const [activeTab, setActiveTab] = useState<'demo' | 'custom'>('demo');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('donor');
  const [phone, setPhone] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [area, setArea] = useState('Indiranagar');
  const [donorType, setDonorType] = useState<'Restaurant' | 'Bakery' | 'Hotel' | 'Household'>('Restaurant');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email);
      } else {
        await register({
          name,
          email,
          role,
          phone,
          organizationName: organizationName || name,
          donorType: role === 'donor' ? donorType : undefined,
          address: `${area}, Bengaluru, Karnataka`,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#F7FAF7]">
          <div>
            <h3 className="text-base font-bold text-[#1B4332]">
              {authModalMode === 'login' ? 'Sign In to ShareAPlate' : 'Join ShareAPlate Community'}
            </h3>
            <p className="text-xs text-neutral-500">Zero food waste, zero hunger in Bengaluru</p>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'demo'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> 1-Click Demo Accounts
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {authModalMode === 'login' ? 'Custom Email Login' : 'Create Account'}
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
              {error}
            </div>
          )}

          {activeTab === 'demo' ? (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500">
                Choose any pre-configured persona to test role-specific dashboards, workflows, and permissions:
              </p>

              <div className="space-y-2">
                {demoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchPersona(u);
                      closeAuthModal();
                    }}
                    className="w-full text-left p-3 rounded-xl border border-neutral-200 hover:border-[#2E7D32] hover:bg-emerald-50/40 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900">{u.name}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                          {u.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {u.organizationName || u.address.split(',')[0]} · {u.location.area}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#2E7D32] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs">
              {authModalMode === 'register' && (
                <>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:border-[#2E7D32] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Select Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['donor', 'ngo', 'volunteer'] as UserRole[]).map((r) => (
                        <button
                          type="button"
                          key={r}
                          onClick={() => setRole(r)}
                          className={`py-2 rounded-lg font-semibold uppercase text-[11px] border transition-all cursor-pointer ${
                            role === r
                              ? 'border-[#2E7D32] bg-emerald-50 text-[#1B4332]'
                              : 'border-neutral-200 text-neutral-600'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {role === 'donor' && (
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Donor Type</label>
                      <select
                        value={donorType}
                        onChange={(e) => setDonorType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white"
                      >
                        <option value="Restaurant">Restaurant</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Hotel">Hotel / Banquet</option>
                        <option value="Household">Household</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Organization / Brand Name</label>
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="e.g. Green Kitchen Bengaluru"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Bengaluru Neighborhood</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Indiranagar, HSR Layout, Koramangala"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:border-[#2E7D32] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 00000"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:border-[#2E7D32] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2.5 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading
                  ? 'Processing...'
                  : authModalMode === 'login'
                  ? 'Sign In'
                  : 'Complete Registration'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => openAuthModal(authModalMode === 'login' ? 'register' : 'login')}
                  className="text-neutral-500 hover:text-[#2E7D32] text-[11px]"
                >
                  {authModalMode === 'login'
                    ? "Don't have an account? Sign Up"
                    : 'Already registered? Sign In'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
