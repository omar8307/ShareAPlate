import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { X, QrCode, Copy, Check, ShieldCheck, Key } from 'lucide-react';

interface QrVerificationModalProps {
  donationId: string;
  foodName: string;
  onClose: () => void;
}

export const QrVerificationModal: React.FC<QrVerificationModalProps> = ({
  donationId,
  foodName,
  onClose,
}) => {
  const [qrData, setQrData] = useState<{ dataUrl: string; token: string; otp: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadQr() {
      try {
        const res = await api.getDonationQr(donationId);
        setQrData(res);
      } catch (err) {
        console.error('Failed to load QR code:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQr();
  }, [donationId]);

  const copyOtp = () => {
    if (qrData?.otp) {
      navigator.clipboard.writeText(qrData.otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden text-center p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B4332]">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            Digital Handover Verification
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#1B4332]">{foodName}</h3>
          <p className="text-xs text-neutral-500 mt-0.5">Show this to the collecting volunteer or NGO representative</p>
        </div>

        {/* QR Code Container */}
        <div className="bg-[#F7FAF7] p-4 rounded-2xl border border-neutral-200 inline-block mx-auto">
          {loading ? (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-neutral-400">
              Generating secure QR...
            </div>
          ) : qrData ? (
            <img
              src={qrData.dataUrl}
              alt="Handover verification QR code"
              className="w-48 h-48 mx-auto rounded-lg shadow-xs"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-neutral-400">
              QR Code unavailable
            </div>
          )}
        </div>

        {/* 6-Digit OTP Fallback */}
        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-1">
          <p className="text-[11px] font-semibold text-[#1B4332] flex items-center justify-center gap-1">
            <Key className="w-3.5 h-3.5 text-[#2E7D32]" /> Offline 6-Digit Handover OTP
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-2xl font-extrabold tracking-widest text-[#1B4332] tabular-nums">
              {qrData?.otp || '------'}
            </span>
            <button
              onClick={copyOtp}
              className="p-1.5 rounded-md text-neutral-500 hover:text-[#2E7D32] hover:bg-emerald-100 transition-colors"
              title="Copy OTP"
            >
              {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-neutral-500">
            For courier devices unable to scan QR codes.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
