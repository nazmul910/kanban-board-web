"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "../../../redux/features/auth/authApi";
import { useGetBoardByIdQuery } from "../../../redux/features/board/boardApi";
import { Navbar } from "../../../components/layout/Navbar";
import { BoardWorkspace } from "../../../components/board/BoardWorkspace";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const boardId = resolvedParams.id;
  const router = useRouter();

  const { data: userData, isLoading: isUserLoading } = useGetMeQuery();
  const { data: boardData, isLoading: isBoardLoading, error } =
    useGetBoardByIdQuery(boardId);

  const user = userData?.data;
  const board = boardData?.data;

  if (isUserLoading || isBoardLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090a0f]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
          <span className="text-xs font-semibold">Loading board workspace...</span>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090a0f]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 p-4 text-center">
          <div className="p-4 rounded-2xl bg-[#161b22] border border-[#262f3a] max-w-sm">
            <h3 className="text-base font-bold text-white">Board not found</h3>
            <p className="text-xs text-gray-400 mt-1">
              The board you are looking for does not exist or you do not have permission to view it.
            </p>
            <Button
              variant="emerald"
              size="sm"
              onClick={() => router.push("/")}
              className="mt-4 text-xs font-bold gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex flex-col bg-[#090a0f]">
      <Navbar />
      <BoardWorkspace
        key={board.id}
        board={board}
        currentUserId={user?.id || ""}
        onBackToDashboard={() => router.push("/")}
      />
    </div>
  );
}
