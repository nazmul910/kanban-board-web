"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "../redux/features/auth/authApi";
import { useAppSelector } from "../redux/hooks";
import {
  useGetBoardsQuery,
  useDeleteBoardMutation,
} from "../redux/features/board/boardApi";
import { AuthForm } from "../components/auth/AuthForm";
import { Navbar } from "../components/layout/Navbar";
import { BoardCard } from "../components/board/BoardCard";
import { CreateBoardModal } from "../components/board/CreateBoardModal";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ConfirmModal } from "../components/ui/confirm-modal";
import {
  Columns,
  Kanban,
  Loader2,
  Plus,
  Users,
  FolderKanban,
  LayoutDashboard,
} from "lucide-react";
import { IBoard } from "../redux/features/board/boardInterface";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();
  const { isLoading: isMeLoading } = useGetMeQuery();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: boardsData, isLoading: isBoardsLoading } = useGetBoardsQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  const [deleteBoard] = useDeleteBoardMutation();

  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<IBoard | null>(null);

  const boards = boardsData?.data || [];

  if (isMeLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090a0f] text-gray-200">
        <div className="relative flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 emerald-glow">
            <Kanban className="h-7 w-7 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Loading workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-gray-100">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

        {!isAuthenticated ? (
          <div className="w-full flex flex-col items-center justify-center py-6">
            <div className="text-center mb-8 max-w-lg">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Project Management, <span className="text-emerald-400">Streamlined</span>
              </h1>
              <p className="text-gray-400 text-sm mt-2.5 max-w-md mx-auto">
                Collaborate with your team, manage workflows, and organize your sprints in one central workspace.
              </p>
            </div>

            <AuthForm />
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto py-6 space-y-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#0d1117]/90 border border-[#21262d] shadow-xl backdrop-blur-md">
              <div className="grid md:flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl emerald-glow-sm">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Welcome back, {user?.name}
                    </h2>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage your active boards, collaborate, and progress.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="emerald"
                  size="sm"
                  onClick={() => setIsCreateBoardOpen(true)}
                  className="gap-2 text-xs font-bold shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Board</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border border-[#21262d] bg-[#0d1117]/80 hover:border-emerald-500/30 transition-all duration-200">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Active Boards
                    </span>
                    <FolderKanban className="h-4 w-4 text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="text-2xl font-extrabold text-white">
                    {boards.length}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Boards accessible by you
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#21262d] bg-[#0d1117]/80 hover:border-emerald-500/30 transition-all duration-200">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Collaboration
                    </span>
                    <Users className="h-4 w-4 text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="text-2xl font-extrabold text-white">
                    {boards.reduce((acc, b) => acc + (b.members?.length || 0), 0) + 1}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Total member connections
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Columns className="h-4 w-4 text-emerald-400" />
                  <span>Your Kanban Boards</span>
                </h3>
                <span className="text-xs text-gray-400">
                  {boards.length} total {boards.length === 1 ? "board" : "boards"}
                </span>
              </div>

              {isBoardsLoading ? (
                <div className="flex items-center justify-center p-12 text-gray-400 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                  <span className="text-xs">Loading your boards...</span>
                </div>
              ) : boards.length === 0 ? (
                <Card className="border border-dashed border-[#262f3a] bg-[#0d1117]/50 p-12 text-center space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <LayoutDashboard className="h-7 w-7" />
                  </div>
                  <div className="max-w-sm mx-auto space-y-1">
                    <h4 className="text-base font-bold text-white">No boards yet</h4>
                    <p className="text-xs text-gray-400">
                      Create your first Kanban board to start organizing sprint tasks with drag-and-drop.
                    </p>
                  </div>
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => setIsCreateBoardOpen(true)}
                    className="gap-2 text-xs font-bold"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Your First Board</span>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {boards.map((board) => (
                    <BoardCard
                      key={board.id}
                      board={board}
                      currentUserId={user?.id}
                      onClick={() => router.push(`/boards/${board.id}`)}
                      onDelete={(b) => setBoardToDelete(b)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <CreateBoardModal
        isOpen={isCreateBoardOpen}
        onClose={() => setIsCreateBoardOpen(false)}
        onBoardCreated={(newBoard) => {
          router.push(`/boards/${newBoard.id}`);
        }}
      />

      <ConfirmModal
        isOpen={!!boardToDelete}
        onClose={() => setBoardToDelete(null)}
        onConfirm={async () => {
          if (boardToDelete) {
            await deleteBoard(boardToDelete.id).unwrap();
            toast.success("Board deleted successfully.");
            setBoardToDelete(null);
          }
        }}
        variant="destructive"
        title="Delete Board?"
        description={`Are you sure you want to delete "${boardToDelete?.title}"? All associated columns, tasks, and activity records will be permanently removed.`}
        confirmText="Yes, Delete Board"
        cancelText="Cancel"
      />
    </div>
  );
}
