"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "../../redux/features/auth/authApi";
import { useGetBoardsQuery } from "../../redux/features/board/boardApi";
import { useGetBoardActivitiesQuery } from "../../redux/features/activity/activityApi";
import { Navbar } from "../../components/layout/Navbar";
import { Card, CardContent, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Activity as ActivityIcon,
  Clock,
  CheckCircle2,
  User,
  ArrowLeft,
  Filter,
  Loader2,
  FolderKanban,
  FileText,
  MoveRight,
  Trash2,
  Share2,
} from "lucide-react";

export default function ActivityPage() {
  const router = useRouter();
  const { isLoading: isMeLoading } = useGetMeQuery();
  const { data: boardsData, isLoading: isBoardsLoading } = useGetBoardsQuery();

  const boards = boardsData?.data || [];
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  const activeBoardId = selectedBoardId || boards[0]?.id || "";

  const { data: activitiesData, isLoading: isActivitiesLoading } =
    useGetBoardActivitiesQuery(activeBoardId, {
      skip: !activeBoardId,
    });

  const rawActivities = activitiesData?.data || [];

  const filteredActivities = rawActivities.filter((activity) => {
    if (selectedFilter === "ALL") return true;
    return activity.action === selectedFilter;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE_TASK":
        return (
          <Badge variant="emerald" className="text-[10px] gap-1">
            <FileText className="h-3 w-3" />
            <span>Task Created</span>
          </Badge>
        );
      case "MOVE_TASK":
        return (
          <Badge variant="default" className="text-[10px] gap-1">
            <MoveRight className="h-3 w-3" />
            <span>Task Moved</span>
          </Badge>
        );
      case "DELETE_TASK":
        return (
          <Badge variant="destructive" className="text-[10px] gap-1">
            <Trash2 className="h-3 w-3" />
            <span>Task Deleted</span>
          </Badge>
        );
      case "SHARE_BOARD":
        return (
          <Badge variant="outline" className="text-[10px] gap-1 text-sky-400 border-sky-500/30">
            <Share2 className="h-3 w-3" />
            <span>Board Shared</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>{action.replace(/_/g, " ")}</span>
          </Badge>
        );
    }
  };

  if (isMeLoading || isBoardsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090a0f]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
          <span className="text-xs font-semibold">Loading activity timeline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-gray-100">
      <Navbar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#0d1117]/90 border border-[#21262d] shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="h-9 w-9 rounded-xl bg-[#161b22] border border-[#262f3a] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer hover:scale-105 active:scale-95"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ActivityIcon className="h-5 w-5 text-emerald-400" />
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Activity Timeline
                </h1>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Audit trail and live event history across your projects
              </p>
            </div>
          </div>

          {boards.length > 0 && (
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-gray-400" />
              <select
                value={activeBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                className="h-10 rounded-xl border border-[#262f3a] bg-[#161b22] px-3 text-xs font-semibold text-gray-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {boards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 shrink-0">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </span>
          {[
            { label: "All Events", value: "ALL" },
            { label: "Created Tasks", value: "CREATE_TASK" },
            { label: "Moved Tasks", value: "MOVE_TASK" },
            { label: "Updated Tasks", value: "UPDATE_TASK" },
            { label: "Deleted Tasks", value: "DELETE_TASK" },
            { label: "Collaborations", value: "SHARE_BOARD" },
          ].map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => setSelectedFilter(pill.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedFilter === pill.value
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                  : "bg-[#161b22] text-gray-400 hover:text-white border border-[#262f3a]"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {boards.length === 0 ? (
          <Card className="border border-dashed border-[#262f3a] bg-[#0d1117]/50 p-12 text-center">
            <p className="text-sm text-gray-400">
              No boards available to show activities.
            </p>
            <Button
              variant="emerald"
              size="sm"
              onClick={() => router.push("/")}
              className="mt-4 text-xs font-bold"
            >
              Go to Dashboard
            </Button>
          </Card>
        ) : isActivitiesLoading ? (
          <div className="flex items-center justify-center p-12 text-gray-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
            <span className="text-xs">Loading activity records...</span>
          </div>
        ) : filteredActivities.length === 0 ? (
          <Card className="border border-dashed border-[#262f3a] bg-[#0d1117]/50 p-12 text-center space-y-2">
            <Clock className="h-8 w-8 mx-auto text-gray-600 mb-2" />
            <CardTitle className="text-base text-gray-300">
              No activities found
            </CardTitle>
            <p className="text-xs text-gray-500">
              {selectedFilter === "ALL"
                ? "No actions have been performed on this board yet."
                : "No matching activities for this filter."}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className="border border-[#21262d] bg-[#0d1117] hover:border-emerald-500/30 transition-all duration-200"
              >
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      {activity.user?.name ? activity.user.name[0].toUpperCase() : <User className="h-4 w-4" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">
                          {activity.user?.name || "Member"}
                        </span>
                        {getActionBadge(activity.action)}
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {activity.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0 self-end sm:self-center">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(activity.createdAt).toLocaleDateString()}{" "}
                      {new Date(activity.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
