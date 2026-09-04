"use client";

import React, { useState } from "react";
import { useCreateBoardMutation } from "../../redux/features/board/boardApi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { X, Kanban, Sparkles } from "lucide-react";
import { IBoard } from "../../redux/features/board/boardInterface";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoardCreated: (board: IBoard) => void;
}

export function CreateBoardModal({
  isOpen,
  onClose,
  onBoardCreated,
}: CreateBoardModalProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createBoard, { isLoading }] = useCreateBoardMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError(null);
    try {
      const res = await createBoard({ title: title.trim() }).unwrap();
      setTitle("");
      onClose();
      if (res.data) {
        onBoardCreated(res.data);
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      setError(errorObj?.data?.message || "Failed to create board");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-[#262f3a] bg-[#0d1117] p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4">
        {/* Professional Cross Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 group transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 duration-200 group-hover:text-red-500 w-4" strokeWidth={2.2} />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 emerald-glow-sm">
            <Kanban className="h-5 w-5 rotate-180" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create New Board</h3>
            <p className="text-xs text-gray-400">Set up a new workflow workspace</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="board-title">Board Title</Label>
            <Input
              id="board-title"
              type="text"
              placeholder="Enter Board Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="text-xs h-10"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#161b22] border border-[#262f3a] flex items-center gap-2 text-[11px] text-gray-400">

            <span>
              Includes standard columns: <strong>To Do</strong>, <strong>In Progress</strong>, and <strong>Done</strong>.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              isLoading={isLoading}
              className="text-xs font-bold h-9 px-4"
            >
              Create Board
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
