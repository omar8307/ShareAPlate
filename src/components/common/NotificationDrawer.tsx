import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { X, Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';

export const NotificationDrawer: React.FC<{ onNavigateToDonation?: (id: string) => void }> = ({
  onNavigateToDonation,
}) => {
  const { notifications, unreadCount, isOpen, setIsOpen, markAsRead } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-neutral-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-[#F7FAF7]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2E7D32]" />
            <h3 className="font-bold text-sm text-[#1B4332]">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#F4A261] text-white text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.isRead) markAsRead(notif.id);
                }}
                className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-neutral-50/60 border-neutral-200/60 text-neutral-600'
                    : 'bg-emerald-50/50 border-emerald-200 text-neutral-900 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold text-[11px] ${notif.isRead ? 'text-neutral-700' : 'text-[#1B4332]'}`}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-600">{notif.message}</p>
                {!notif.isRead && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif.id);
                      }}
                      className="text-[10px] text-[#2E7D32] font-semibold hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark as read
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
