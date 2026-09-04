"use client";

import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IColumn } from "../../redux/features/column/columnInterface";
import { ITask } from "../../redux/features/task/taskInterface";
import { TaskCard } from "../task/TaskCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Layers,
} from "lucide-react";

interface KanbanColumnProps {
  column: IColumn;
  canEdit: boolean;
  onAddTask: (columnId: string, title: string) => Promise<void>;
  onEditColumn: (columnId: string, title: string) => Promise<void>;
  onDeleteColumn: (columnId: string) => void;
  onEditTask: (task: ITask) => void;
  onDeleteTask: (task: ITask) => void;
}

export function KanbanColumn({
  column,
  canEdit,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const handleSaveTitle = async () => {
    if (editedTitle.trim() && editedTitle !== column.title) {
      await onEditColumn(column.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setIsSubmittingTask(true);
      await onAddTask(column.id, newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAddingTask(false);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const taskIds = column.tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-[300px] shrink-0 rounded-2xl border transition-colors duration-200 bg-[#0d1117] ${
        isOver
          ? "border-emerald-500/60 bg-emerald-950/10"
          : "border-[#21262d]"
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 pb-2.5 border-b border-[#21262d] flex items-center justify-between gap-2">
        {isEditingTitle ? (
          <div className="flex items-center gap-1.5 flex-1">
            <Input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="h-8 text-xs font-bold py-1 px-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") {
                  setEditedTitle(column.title);
                  setIsEditingTitle(false);
                }
              }}
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedTitle(column.title);
                setIsEditingTitle(false);
              }}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white/10 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-200 truncate">
              {column.title}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#161b22] text-gray-400 border border-[#262f3a]">
              {column.tasks.length}
            </span>
          </div>
        )}

        {canEdit && !isEditingTitle && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#161b22] transition-colors cursor-pointer"
              title="Edit column title"
            >
              <Edit2 className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteColumn(column.id)}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Delete column"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Task List (Droppable & Sortable) */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-270px)] min-h-[140px]">
        <SortableContext
          items={taskIds}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              canEdit={canEdit}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {column.tasks.length === 0 && !isAddingTask && (
          <div className="h-24 rounded-xl border border-dashed border-[#262f3a] flex flex-col items-center justify-center text-center p-3 text-gray-500">
            <Layers className="h-5 w-5 mb-1 opacity-40" />
            <span className="text-[11px]">No tasks yet</span>
            {canEdit && (
              <span className="text-[10px] text-gray-600 mt-0.5">
                Drag a task here or add one below
              </span>
            )}
          </div>
        )}
      </div>

      {/* Column Footer: Add Task Button / Form */}
      {canEdit && (
        <div className="p-3 pt-1 border-t border-[#21262d]/50">
          {isAddingTask ? (
            <form onSubmit={handleCreateTask} className="space-y-2">
              <Input
                type="text"
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                autoFocus
                className="text-xs h-9"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  variant="emerald"
                  isLoading={isSubmittingTask}
                  className="text-xs h-8 px-3 font-bold"
                >
                  Add
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskTitle("");
                  }}
                  className="text-xs h-8 px-3"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingTask(true)}
              className="w-full py-2 px-3 rounded-xl border border-transparent hover:border-[#262f3a] bg-transparent hover:bg-[#161b22] text-gray-400 hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Task</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
