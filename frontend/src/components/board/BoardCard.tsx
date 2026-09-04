"use client";

import React from "react";
import { IBoard } from "../../redux/features/board/boardInterface";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Clock, ArrowRight, Trash2 } from "lucide-react";

interface BoardCardProps {
  board: IBoard;
  currentUserId?: string;
  onClick: () => void;
  onDelete: (board: IBoard) => void;
}

export function BoardCard({
  board,
  currentUserId,
  onClick,
  onDelete,
}: BoardCardProps) {
  const isOwner = board.ownerId === currentUserId;
  const memberCount = 1 + (board.members?.length || 0);

  return (
    <Card
      onClick={onClick}
      className="border border-[#21262d] bg-[#0d1117] hover:border-emerald-500/40 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5 group flex flex-col justify-between cursor-pointer"
    >
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {board.title}
          </CardTitle>
          {isOwner && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(board);
              }}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Delete board"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <CardDescription className="text-xs text-gray-400 flex items-center gap-2.5 pt-1">
          <span>{board._count?.columns ?? (board.columns?.length || 3)} Columns</span>
          <span>•</span>
          <span>{memberCount} {memberCount === 1 ? "Member" : "Members"}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <div className="pt-3 border-t border-[#1c222c] flex items-center justify-between">
          <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(board.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
            <span>Open</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
