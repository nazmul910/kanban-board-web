"use client";

import React, { useState } from "react";
import { ITask } from "../../redux/features/task/taskInterface";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  X,
  Trash2,
  Clock,
  User as UserIcon,
  AlignLeft,
  FileText,
} from "lucide-react";

interface TaskDetailModalProps {
  task: ITask | null;
  isOpen: boolean;
  canEdit: boolean;
  onClose: () => void;
  onSave: (taskId: string, title: string, description: string) => Promise<void>;
  onDelete: (task: ITask) => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  canEdit,
  onClose,
  onSave,
  onDelete,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !task) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSaving(true);
      await onSave(task.id, title.trim(), description.trim());
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-[#262f3a] bg-[#0d1117] p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FileText className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold uppercase tracking-wider">
              Task Details
            </span>
            <span className="text-gray-600 font-mono">#{task.id.slice(0, 6)}</span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!canEdit}
              placeholder="Task title..."
              required
              className="text-sm font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-description" className="flex items-center gap-1.5">
              <AlignLeft className="h-3.5 w-3.5" />
              <span>Description</span>
            </Label>
            <textarea
              id="task-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canEdit}
              placeholder="Add more details to this task..."
              className="w-full rounded-xl border border-[#262f3a] bg-[#161b22] px-3.5 py-2.5 text-xs text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
            />
          </div>

          <div className="pt-2 border-t border-[#21262d] grid grid-cols-2 gap-3 text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <UserIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span>Created by: <strong className="text-gray-200">{task.createdBy?.name || "User"}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#21262d] flex items-center justify-between">
            {canEdit ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  onClose();
                  onDelete(task);
                }}
                className="text-xs h-9 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-xs h-9"
              >
                Cancel
              </Button>
              {canEdit && (
                <Button
                  type="submit"
                  variant="emerald"
                  size="sm"
                  isLoading={isSaving}
                  className="text-xs font-bold h-9"
                >
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
