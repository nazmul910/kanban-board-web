"use client";

import React from "react";
import { useGetBoardActivitiesQuery } from "../../redux/features/activity/activityApi";
import { X, Activity as ActivityIcon, Clock, CheckCircle2, User, Loader2 } from "lucide-react";

interface ActivityDrawerProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityDrawer({ boardId, isOpen, onClose }: ActivityDrawerProps) {
  const { data, isLoading } = useGetBoardActivitiesQuery(boardId, {
    skip: !isOpen,
  });

  const activities = data?.data || [];

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-[380px] max-w-[90vw] bg-[#0d1117] border-l border-[#21262d] shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#21262d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 emerald-glow-sm">
              <ActivityIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Activity Log</h3>
              <p className="text-[10px] text-gray-400">Real-time audit history</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            aria-label="Close activity drawer"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
              <span className="text-xs">Loading activity timeline...</span>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-1">
              <Clock className="h-8 w-8 mx-auto opacity-40 mb-2" />
              <p className="text-xs font-semibold">No activities recorded yet</p>
              <p className="text-[10px]">Actions like creating, updating, and moving tasks will appear here.</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="p-3 rounded-xl bg-[#161b22] border border-[#262f3a] text-xs space-y-1.5 transition-colors hover:border-emerald-500/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {activity.action.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {new Date(activity.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed text-[11px]">
                  {activity.details}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 pt-1 border-t border-[#21262d]">
                  <User className="h-3 w-3 text-gray-500" />
                  <span>{activity.user?.name || "System User"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
