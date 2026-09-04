"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ITask } from "../../redux/features/task/taskInterface";
import { GripVertical, Trash2, Edit3, User as UserIcon } from "lucide-react";

interface TaskCardProps {
  task: ITask;
  canEdit: boolean;
  onEdit: (task: ITask) => void;
  onDelete: (task: ITask) => void;
  isOverlay?: boolean;
}

export function TaskCard({
  task,
  canEdit,
  onEdit,
  onDelete,
  isOverlay = false,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: !canEdit || isOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative rounded-xl border p-3.5 transition-all duration-200 select-none ${
        canEdit ? "cursor-grab active:cursor-grabbing" : ""
      } ${
        isDragging
          ? "opacity-30 border-emerald-500/50 bg-[#161b22]/50"
          : isOverlay
          ? "border-emerald-500/60 bg-[#161b22] shadow-2xl shadow-emerald-500/20 scale-105 cursor-grabbing"
          : "border-[#262f3a] bg-[#161b22]/90 hover:border-emerald-500/40 hover:bg-[#1a212b] shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {canEdit && (
            <div
              className="mt-0.5 text-gray-500 group-hover:text-emerald-400 p-0.5 rounded transition-colors touch-none shrink-0"
              aria-label="Drag task handle"
            >
              <GripVertical className="h-4 w-4" />
            </div>
          )}

          <div
            className="flex-1 min-w-0"
            onClick={() => onEdit(task)}
          >
            <h4 className="text-xs font-bold text-gray-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {canEdit && !isOverlay && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="h-6 w-6 rounded-md flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit3 className="h-3 w-3" />
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="h-6 w-6 rounded-md flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#21262d] flex items-center justify-between text-[10px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[9px]">
            {task.createdBy?.name ? (
              task.createdBy.name[0].toUpperCase()
            ) : (
              <UserIcon className="h-3 w-3" />
            )}
          </div>
          <span className="truncate max-w-[120px]">
            {task.createdBy?.name || "Member"}
          </span>
        </div>

        <span className="text-[9px] text-gray-500 font-mono">
          #{task.id.slice(0, 4)}
        </span>
      </div>
    </div>
  );
}
