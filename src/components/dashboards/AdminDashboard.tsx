import React, { useState, useEffect } from 'react';
import type { User, Donation, ImpactStats } from '../../types';
import { api } from '../../services/api';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Users,
  Utensils,
  Layers,
  Search,
  Filter,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [activeTab, setActiveTab] = useState<'verification' | 'donations' | 'users'>('verification');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [demoUsers, allDonations, analyticsRes] = await Promise.all([
        api.getDemoUsers(),
        api.getDonations(),
        api.getAnalytics(),
      ]);
      setUsers(demoUsers);
      setDonations(allDonations);
      setStats(analyticsRes.stats);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyNgo = async (ngoId: string, action: 'approve' | 'reject') => {
    try {
      await api.verifyNgo(ngoId, action);
      setActionMsg(
        action === 'approve'
          ? 'NGO successfully approved and granted donation claiming privileges!'
          : 'NGO application rejected.'
      );
      setTimeout(() => setActionMsg(null), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    }
  };

  const pendingNgos = users.filter((u) => u.role === 'ngo' && !u.isVerified);
  const verifiedNgos = users.filter((u) => u.role === 'ngo' && u.isVerified);

  return (
    <div className="py-10 bg-[#F7FAF7] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center text-xl font-bold shadow-xs">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B4332]">Platform Operations Console</h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                ShareAPlate Bengaluru Governance, Verification & Audit Authority
              </p>
            </div>
          </div>

          <div className="text-xs text-neutral-600 bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-200">
            System Status: <strong className="text-[#2E7D32]">Healthy</strong> · RBAC Enforced
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            {actionMsg}
          </div>
        )}

        {/* 4 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Pending NGO Reviews</p>
            <p className="text-2xl font-extrabold text-[#F4A261] font-mono tabular-nums mt-1">
              {pendingNgos.length}
            </p>
            <p className="text-[11px] text-amber-600 mt-0.5">Requires 80G document review</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Verified NGO Partners</p>
            <p className="text-2xl font-extrabold text-[#2E7D32] font-mono tabular-nums mt-1">
              {verifiedNgos.length}
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Licensed to claim food</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Total Food Rescued</p>
            <p className="text-2xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
              {stats?.totalFoodRescuedKg.toLocaleString() || '1,420'} kg
            </p>
            <p className="text-[11px] text-[#2E7D32] mt-0.5">{stats?.totalMealsProvided || '3,550'} meals</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Registered Accounts</p>
            <p className="text-2xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
              {users.length}
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Donors, NGOs & Couriers</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
            }`}
          >
            NGO Verification Queue ({pendingNgos.length})
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'donations'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
            }`}
          >
            Donation Audit Log ({donations.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
            }`}
          >
            Manage Users ({users.length})
          </button>
        </div>

        {activeTab === 'verification' && (
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-bold text-sm text-[#1B4332]">Pending NGO Verification Requests</h3>
                <p className="text-xs text-neutral-500">
                  Review submitted 80G tax exemptions and Darpan certificates before granting claiming access.
                </p>
              </div>
            </div>

            {pendingNgos.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                All NGO applications are verified and up to date!
              </div>
            ) : (
              <div className="space-y-4">
                {pendingNgos.map((ngo) => (
                  <div
                    key={ngo.id}
                    className="p-5 rounded-2xl border border-neutral-200 bg-[#F7FAF7] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1B4332]">{ngo.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Awaiting Review
                        </span>
                      </div>
                      <p className="text-neutral-600">{ngo.address}</p>
                      <div className="flex items-center gap-3 text-neutral-500 pt-1">
                        <span>Phone: {ngo.phone}</span>
                        <span>·</span>
                        <span>Capacity: ~{ngo.beneficiaryCount || 100} daily</span>
                      </div>

                      {/* Documents */}
                      <div className="pt-2 flex items-center gap-2 text-[11px] text-neutral-600">
                        <FileText className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>Submitted docs:</span>
                        {(ngo.verificationDocuments || ['NGO_Darpan_2026.pdf']).map((doc) => (
                          <span key={doc} className="font-mono text-[#2E7D32] bg-white px-2 py-0.5 rounded border border-neutral-200">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleVerifyNgo(ngo.id, 'reject')}
                        className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleVerifyNgo(ngo.id, 'approve')}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <ShieldCheck className="w-4 h-4" /> Approve & Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-neutral-100 bg-[#F7FAF7] flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-700">Platform-Wide Donation Audit Trail</h3>
              <span className="text-xs text-neutral-500">{donations.length} total records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Donor</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Claiming NGO</th>
                    <th className="py-3 px-4">Courier</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-neutral-50/60">
                      <td className="py-3 px-4 font-bold text-neutral-900">{d.foodName}</td>
                      <td className="py-3 px-4 text-neutral-600">{d.donorName}</td>
                      <td className="py-3 px-4 font-mono tabular-nums">{d.quantity} {d.unit}</td>
                      <td className="py-3 px-4 text-neutral-700">{d.claimedByNgoName || '—'}</td>
                      <td className="py-3 px-4 text-neutral-700">{d.assignedVolunteerName || '—'}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7FAF7] text-neutral-500 uppercase tracking-wider text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Name / Organization</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Area</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Completed Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50/60">
                      <td className="py-3 px-4 font-bold text-neutral-900">
                        {u.organizationName || u.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#1B4332]">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{u.location.area}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{u.email}</td>
                      <td className="py-3 px-4 font-mono tabular-nums text-neutral-700">
                        {u.completedDonationsCount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
