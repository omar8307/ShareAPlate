import React, { useState, useEffect } from 'react';
import type { VolunteerTask } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import {
  Bike,
  CheckCircle,
  Clock,
  MapPin,
  Award,
  ArrowRight,
  ShieldCheck,
  Key,
  AlertTriangle,
  QrCode,
  Sparkles,
  X,
  FileCheck,
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [activeTask, setActiveTask] = useState<VolunteerTask | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Pickup Verification modal
  const [verifyingTaskId, setVerifyingTaskId] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [verifyErr, setVerifyErr] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const loadTasks = async () => {
    try {
      const allTasks = await api.getVolunteerTasks();
      setTasks(allTasks);

      // Find my active task
      const mine = allTasks.find(
        (t) => (t.volunteerId === currentUser?.id || t.volunteerId === 'user_vol_1') && t.status !== 'Completed'
      );
      setActiveTask(mine || null);
    } catch (err) {
      console.error('Failed to load volunteer tasks:', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [currentUser?.id]);

  const handleAcceptTask = async (taskId: string) => {
    try {
      await api.acceptVolunteerTask(taskId, currentUser?.id || 'user_vol_1', currentUser?.name || 'Rahul Deshmukh');
      loadTasks();
    } catch (err: any) {
      alert(err.message || 'Failed to accept task');
    }
  };

  const handleVerifyPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !inputCode) return;

    setIsVerifying(true);
    setVerifyErr(null);
    try {
      await api.verifyPickup(
        activeTask.donationId,
        inputCode,
        currentUser?.name || 'Rahul Deshmukh',
        'volunteer'
      );
      setVerifyMsg('Pickup verified! Handover completed. Food is now In Transit.');
      setTimeout(() => {
        setVerifyMsg(null);
        setVerifyingTaskId(null);
        setInputCode('');
        loadTasks();
      }, 1800);
    } catch (err: any) {
      setVerifyErr(err.message || 'Invalid handover code.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTriggerCertificate = () => {
    setIsCertificateOpen(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const completedCount = currentUser?.completedDonationsCount || 38;
  const hoursLogged = currentUser?.totalHoursVolunteered || 72;

  return (
    <div className="py-10 bg-[#F7FAF7] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Volunteer Header */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F4A261] text-white flex items-center justify-center text-xl font-bold shadow-xs">
              🚴
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B4332]">{currentUser?.name}</h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> Active Community Courier
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                {currentUser?.address || 'Indiranagar, Bengaluru'} · Available for 2-wheeler pickups
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerCertificate}
              className="px-4 py-2.5 text-xs font-bold text-[#1B4332] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-[#2E7D32]" /> View Impact Certificate
            </button>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Deliveries Completed</p>
            <p className="text-2xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
              {completedCount} <span className="text-xs font-sans text-neutral-500 font-normal">trips</span>
            </p>
            <p className="text-[11px] text-[#2E7D32] mt-0.5">100% on-time verified</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Volunteer Hours</p>
            <p className="text-2xl font-extrabold text-[#2E7D32] font-mono tabular-nums mt-1">
              {hoursLogged} <span className="text-xs font-sans text-neutral-500 font-normal">hrs</span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Community service time</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Distance Covered</p>
            <p className="text-2xl font-extrabold text-[#F4A261] font-mono tabular-nums mt-1">
              {completedCount * 3.4} <span className="text-xs font-sans text-neutral-500 font-normal">km</span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Across Bengaluru wards</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <p className="text-xs text-neutral-500 font-medium">Earned Badges</p>
            <p className="text-2xl font-extrabold text-[#1B4332] font-mono tabular-nums mt-1">
              {currentUser?.badges?.length || 3}
            </p>
            <p className="text-[11px] text-[#2E7D32] mt-0.5">Volunteer Star & Hero</p>
          </div>
        </div>

        {/* ACTIVE COURIER MISSION CARD */}
        {activeTask ? (
          <div className="bg-white rounded-2xl border-2 border-[#2E7D32] shadow-md p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2E7D32] animate-pulse" />
                <h3 className="text-base font-extrabold text-[#1B4332]">
                  Active Rescue Mission: {activeTask.foodName}
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Status: {activeTask.status}
              </span>
            </div>

            {/* Step-by-Step Route */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <p className="text-[10px] font-bold uppercase text-[#2E7D32] tracking-wider">Step 1: Collection Address</p>
                <p className="font-bold text-xs text-neutral-900">{activeTask.donorName}</p>
                <p className="text-xs text-neutral-700">{activeTask.pickupAddress}</p>
                <p className="text-[11px] text-neutral-500 mt-1">Collect before {new Date(activeTask.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <p className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">Step 2: Delivery Destination</p>
                <p className="font-bold text-xs text-neutral-900">{activeTask.ngoName}</p>
                <p className="text-xs text-neutral-700">{activeTask.deliveryAddress}</p>
                <p className="text-[11px] text-neutral-500 mt-1">Est. Distance: {activeTask.estimatedDistanceKm} km</p>
              </div>
            </div>

            {/* Handover Verification CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-neutral-600">
                Arrived at donor location? Enter the donor's 6-digit OTP to verify handover and transition status.
              </p>

              {activeTask.status === 'Assigned' && (
                <button
                  onClick={() => {
                    setVerifyingTaskId(activeTask.id);
                    setInputCode('829415'); // Pre-fill with matching OTP for quick demo test!
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Key className="w-4 h-4" /> Enter Donor Pickup OTP
                </button>
              )}

              {(activeTask.status === 'Picked Up' || activeTask.status === 'In Transit') && (
                <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#2E7D32]" /> Food is In Transit. Present OTP to NGO on arrival.
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 text-center text-xs text-neutral-500">
            You do not currently have an assigned pickup task. Check the available dispatch board below!
          </div>
        )}

        {/* Available Dispatch Board */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="font-bold text-base text-[#1B4332]">Open Pickup Tasks in Bengaluru</h3>
              <p className="text-xs text-neutral-500">Claim tasks near your route and transport surplus food to shelters</p>
            </div>
          </div>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === 'Available')
              .map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-neutral-200/80 hover:border-[#2E7D32] hover:bg-emerald-50/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-neutral-900">{t.foodName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {t.estimatedDistanceKm} km
                      </span>
                    </div>
                    <div className="text-xs text-neutral-600 flex items-center gap-2">
                      <span>Pickup: {t.donorName}</span>
                      <span>→</span>
                      <span>Drop: {t.ngoName}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">Deadline: {new Date(t.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  <button
                    onClick={() => handleAcceptTask(t.id)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto shrink-0"
                  >
                    Accept This Task
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* VERIFY PICKUP MODAL */}
      {verifyingTaskId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-[#1B4332]">Verify Handover from Donor</h3>
              <button onClick={() => setVerifyingTaskId(null)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Ask donor for their single-use 6-digit pickup OTP to verify physical food collection.
            </p>

            {verifyMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                {verifyMsg}
              </div>
            )}

            {verifyErr && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                {verifyErr}
              </div>
            )}

            <form onSubmit={handleVerifyPickup} className="space-y-4">
              <div>
                <label className="block font-semibold text-neutral-800 text-xs mb-1">
                  6-Digit Handover Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="e.g. 829415"
                  className="w-full text-center font-mono text-2xl tracking-widest font-bold px-3 py-2 border border-neutral-300 rounded-xl focus:border-[#2E7D32] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyingTaskId(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Pickup Handover'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIGITAL VOLUNTEER CERTIFICATE MODAL */}
      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border-4 border-[#2E7D32] p-8 text-center space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsCertificateOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto text-2xl shadow-inner">
              🏅
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#2E7D32]">ShareAPlate Foundation India</p>
              <h2 className="text-2xl font-black text-[#1B4332] mt-1">Certificate of Civic Recognition</h2>
              <p className="text-xs text-neutral-500 mt-1">For Outstanding Contribution to Zero Food Waste & Community Hunger Relief</p>
            </div>

            <div className="p-4 bg-[#F7FAF7] rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-2">
              <p className="text-sm font-bold text-neutral-900">{currentUser?.name}</p>
              <p className="leading-relaxed">
                Has successfully completed <strong>{completedCount} food rescue dispatches</strong>, contributing over <strong>{hoursLogged} volunteer hours</strong> across Bengaluru shelters.
              </p>
              <div className="pt-2 flex items-center justify-center gap-6 font-mono text-[11px] text-neutral-500">
                <span>Date: November 2026</span>
                <span>·</span>
                <span>ID: SAP-VOL-{currentUser?.id.substring(0, 8)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCertificateOpen(false)}
              className="w-full py-2.5 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
