import React from "react";
import { Bell, Trophy, CheckCircle, Calendar, Trash2, X, Eye, Sparkles } from "lucide-react";
import { AppNotification } from "../types";

interface NotificationCenterProps {
  notifications: AppNotification[];
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({
  notifications,
  onToggleRead,
  onDelete,
  onMarkAllRead,
  onClearAll,
  isOpen,
  onClose,
}: NotificationCenterProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "achievement":
        return <Trophy className="text-yellow-500 w-5 h-5" />;
      case "completed":
        return <CheckCircle className="text-emerald-500 w-5 h-5" />;
      case "reminder":
        return <Calendar className="text-blue-400 w-5 h-5" />;
      default:
        return <Bell className="text-indigo-400 w-5 h-5" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-slideIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-850 rounded-lg text-emerald-400">
              <Bell size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-serif">Runway Alert Center</h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Panel */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 bg-slate-950/30 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <button 
              type="button"
              onClick={onMarkAllRead}
              className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-1"
            >
              <Eye size={12} /> Mark all read
            </button>
            <button 
              type="button"
              onClick={onClearAll}
              className="text-slate-400 hover:text-rose-400 transition flex items-center gap-1"
            >
              <Trash2 size={12} /> Clear all
            </button>
          </div>
        )}

        {/* Notification Scroll List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/40">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-slate-500">
                <Bell size={20} className="opacity-40 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">Quiet Study Space</p>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
                  Reminders, achievements, and scheduled revision schedules will appear as you progress.
                </p>
              </div>
            </div>
          ) : (
            notifications.map((notif, index) => (
              <div 
                key={notif.id} 
                className={`pt-3 first:pt-0 flex gap-3 group relative transition-colors ${
                  !notif.read ? "bg-emerald-950/5 -mx-4 px-4 py-2 border-l-2 border-emerald-500" : ""
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className={`text-xs font-semibold ${!notif.read ? "text-slate-100" : "text-slate-300"}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[9px] text-slate-500 font-mono whitespace-nowrap self-start">
                      {formatTime(notif.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    {notif.message}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => onToggleRead(notif.id)}
                        className="text-[9px] text-emerald-400 hover:text-emerald-300 font-mono font-semibold"
                      >
                        Keep unread
                      </button>
                    )}
                    {notif.read && (
                      <button
                        type="button"
                        onClick={() => onToggleRead(notif.id)}
                        className="text-[9px] text-slate-500 hover:text-slate-400 font-mono"
                      >
                        Mark unread
                      </button>
                    )}
                  </div>
                </div>

                {/* Individual delete button */}
                <button
                  type="button"
                  onClick={() => onDelete(notif.id)}
                  title="Delete notice"
                  className="opacity-0 group-hover:opacity-100 absolute right-2.5 top-2 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bottom Tip Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[10px] text-slate-500 leading-relaxed flex items-center gap-1.5 justify-center">
          <Sparkles size={11} className="text-[#5A6344]" />
          <span>Completed steps automatically schedule active recall.</span>
        </div>
      </div>
    </>
  );
}
