import React, { useState } from 'react';
import { THERMAL_SENSORS } from '../data/initialData';
import { SurplusListing } from '../types';

interface SafetyAuditViewProps {
  listings: SurplusListing[];
  onShowToast: (msg: string, tone?: 'info' | 'success' | 'warning') => void;
}

export const SafetyAuditView: React.FC<SafetyAuditViewProps> = ({ listings, onShowToast }) => {
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const handleVerifyCheck = (id: string, code: string) => {
    setResolvedIds((prev) => [...prev, id]);
    onShowToast(`FSSAI thermal seal verified for ${code}.`, 'success');
  };

  return (
    <div className="flex flex-col w-full pb-8 gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
            FSSAI Sec-31 Cold-Chain Compliance
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary">
            Safety &amp; Temperature Telemetry Ledger
          </h1>
          <p className="text-sm text-on-surface-variant">
            Continuous IoT thermal probe tracking across hot-held (&gt;60°C) and chilled (&lt;5°C) rescue carriers
          </p>
        </div>
        <span className="text-xs font-semibold bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full self-start whitespace-nowrap">
          99.4% Cold-Chain Compliance
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THERMAL_SENSORS.map((sensor) => (
          <div
            key={sensor.id}
            className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">{sensor.title}</span>
              <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded font-bold">
                {sensor.statusLabel}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary-container/50 text-secondary flex items-center justify-center font-headline text-lg font-extrabold tabular-nums">
                {sensor.reading}
              </div>
              <div>
                <span className="text-xs text-outline block">{sensor.targetLabel}</span>
                <span className="text-sm text-on-surface font-semibold block">
                  {sensor.deviceLabel}
                </span>
                <span className="text-xs text-secondary block mt-0.5">{sensor.subStatus}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-surface-container flex justify-between text-xs">
              <span className="text-outline">{sensor.footerLabel}</span>
              <span className="font-semibold text-primary">{sensor.footerValue}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm overflow-x-auto">
        <h2 className="font-headline text-lg font-semibold text-primary mb-4">
          Active Manifest Thermal Chain-of-Custody
        </h2>
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-surface-container text-[11px] uppercase tracking-wider text-outline">
              <th className="py-2.5 pr-4">Manifest</th>
              <th className="py-2.5 pr-4">Donor</th>
              <th className="py-2.5 pr-4">Holding Baseline</th>
              <th className="py-2.5 pr-4">Quantity</th>
              <th className="py-2.5 text-right">Audit Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-xs">
            {listings.map((item) => {
              const verified = resolvedIds.includes(item.id);
              return (
                <tr key={item.id} className="hover:bg-surface-container-low/60">
                  <td className="py-3 pr-4 font-mono font-bold text-primary">
                    {item.manifestCode}
                  </td>
                  <td className="py-3 pr-4 font-medium text-on-surface">{item.donorName}</td>
                  <td className="py-3 pr-4 text-secondary font-semibold">{item.tempLabel}</td>
                  <td className="py-3 pr-4 tabular-nums">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      disabled={verified}
                      onClick={() => handleVerifyCheck(item.id, item.manifestCode)}
                      className={`px-3 py-1 rounded text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                        verified
                          ? 'bg-secondary-container text-on-secondary-container cursor-default'
                          : 'bg-primary text-on-primary hover:bg-primary-container'
                      }`}
                    >
                      {verified ? 'Seal Logged ✓' : 'Verify Probe'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
