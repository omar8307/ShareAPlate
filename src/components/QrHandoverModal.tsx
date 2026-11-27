import React from 'react';

interface QrHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifestId: string;
  shelterName: string;
  volunteerName: string;
  payload: string;
  otpCode?: string;
  onPrintReceipt: () => void;
}

export const QrHandoverModal: React.FC<QrHandoverModalProps> = ({
  isOpen,
  onClose,
  manifestId,
  shelterName,
  volunteerName,
  payload,
  otpCode,
  onPrintReceipt,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-4 relative">
        <button
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <div className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-secondary font-bold">
            Secure Handover Token
          </span>
          <h3 id="qr-modal-title" className="font-headline text-2xl font-bold text-primary mt-1 tabular-nums">
            {manifestId}
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Present this cryptographic barcode to the verified ShareAMeal courier at kitchen dispatch loading bay.
          </p>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-xl shadow-md border-4 border-surface-container flex flex-col items-center justify-center gap-2">
          <svg className="w-48 h-48 text-primary" fill="currentColor" viewBox="0 0 100 100">
            <rect fill="none" height="28" rx="2" stroke="currentColor" strokeWidth="4" width="28" x="5" y="5" />
            <rect fill="currentColor" height="16" rx="1" width="16" x="11" y="11" />
            <rect fill="none" height="28" rx="2" stroke="currentColor" strokeWidth="4" width="28" x="67" y="5" />
            <rect fill="currentColor" height="16" rx="1" width="16" x="73" y="11" />
            <rect fill="none" height="28" rx="2" stroke="currentColor" strokeWidth="4" width="28" x="5" y="67" />
            <rect fill="currentColor" height="16" rx="1" width="16" x="11" y="73" />
            <rect height="6" width="6" x="38" y="8" />
            <rect height="6" width="6" x="48" y="14" />
            <rect height="6" width="6" x="56" y="8" />
            <rect height="6" width="6" x="38" y="24" />
            <rect height="8" width="8" x="48" y="28" />
            <rect height="6" width="8" x="8" y="38" />
            <rect height="6" width="6" x="22" y="46" />
            <rect height="8" width="8" x="36" y="38" />
            <rect height="8" width="8" x="48" y="44" />
            <rect height="8" width="6" x="62" y="38" />
            <rect height="6" width="6" x="76" y="38" />
            <rect height="6" width="6" x="88" y="44" />
            <rect height="6" width="6" x="8" y="52" />
            <rect height="6" width="8" x="38" y="54" />
            <rect height="6" width="6" x="52" y="58" />
            <rect height="6" width="8" x="64" y="50" />
            <rect height="6" width="14" x="78" y="54" />
            <rect height="8" width="8" x="38" y="68" />
            <rect height="6" width="6" x="52" y="70" />
            <rect height="8" width="8" x="64" y="68" />
            <rect height="6" width="8" x="78" y="72" />
            <rect height="8" width="8" x="38" y="84" />
            <rect height="8" width="6" x="50" y="84" />
            <rect height="8" width="14" x="64" y="84" />
            <rect height="6" width="8" x="84" y="86" />
          </svg>
          {otpCode && (
            <span className="font-mono text-sm font-bold text-primary tracking-widest bg-surface-container-low px-3 py-1 rounded">
              OTP: {otpCode}
            </span>
          )}
        </div>

        <div className="bg-surface-container-low w-full p-3 rounded-lg flex flex-col gap-1.5 text-left text-xs">
          <div className="flex justify-between gap-2">
            <span className="text-outline">Assigned Shelter:</span>
            <span className="font-semibold text-on-surface text-right">{shelterName}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-outline">Authorized Courier:</span>
            <span className="font-semibold text-on-surface text-right">{volunteerName}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-outline">Verified Quantity:</span>
            <span className="text-secondary font-bold text-right tabular-nums">{payload}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            className="w-1/2 bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            onClick={onClose}
            type="button"
          >
            Dismiss
          </button>
          <button
            className="w-1/2 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold py-2.5 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            onClick={onPrintReceipt}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
