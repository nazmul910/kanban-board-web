"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
  pointerWithin,
  CollisionDetection,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { IBoard, BoardRole } from "../../redux/features/board/boardInterface";
import { IColumn } from "../../redux/features/column/columnInterface";
import { ITask } from "../../redux/features/task/taskInterface";
import {
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
} from "../../redux/features/column/columnApi";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useMoveTaskMutation,
} from "../../redux/features/task/taskApi";
import {
  useDeleteBoardMutation,
  useUpdateBoardMutation,
} from "../../redux/features/board/boardApi";
import { KanbanColumn } from "../column/KanbanColumn";
import { TaskCard } from "../task/TaskCard";
import { TaskDetailModal } from "../task/TaskDetailModal";
import { ShareBoardModal } from "./ShareBoardModal";
import { ActivityDrawer } from "../activity/ActivityDrawer";
import { ConfirmModal } from "../ui/confirm-modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Plus,
  Share2,
  Activity as ActivityIcon,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";

interface BoardWorkspaceProps {
  board: IBoard;
  currentUserId: string;
  onBackToDashboard: () => void;
}

export function BoardWorkspace({
  board,
  currentUserId,
  onBackToDashboard,
}: BoardWorkspaceProps) {
  const isOwner = board.ownerId === currentUserId;
  const userMember = board.members?.find((m) => m.userId === currentUserId);
  const userRole: BoardRole = isOwner ? "OWNER" : userMember?.role || "VIEWER";
  const canEdit = userRole === "OWNER" || userRole === "EDITOR";

  // Mutations
  const [createColumn] = useCreateColumnMutation();
  const [updateColumn] = useUpdateColumnMutation();
  const [deleteColumn] = useDeleteColumnMutation();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [moveTask] = useMoveTaskMutation();
  const [deleteBoard] = useDeleteBoardMutation();
  const [updateBoard] = useUpdateBoardMutation();

  // Local drag-and-drop state with instant server prop synchronization
  const [columns, setColumns] = useState<IColumn[]>(board.columns || []);
  const [prevColumnsProp, setPrevColumnsProp] = useState(board.columns);

  if (board.columns !== prevColumnsProp) {
    setPrevColumnsProp(board.columns);
    setColumns(board.columns || []);
  }

  const [activeTask, setActiveTask] = useState<ITask | null>(null);
  const [originalColumnId, setOriginalColumnId] = useState<string | null>(null);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  // Confirmation Modals
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<ITask | null>(null);
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);

  // Form states
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isSubmittingColumn, setIsSubmittingColumn] = useState(false);

  // Board Title edit & sync
  const [isEditingBoardTitle, setIsEditingBoardTitle] = useState(false);
  const [boardTitle, setBoardTitle] = useState(board.title);
  const [prevBoardTitle, setPrevBoardTitle] = useState(board.title);
  if (board.title !== prevBoardTitle) {
    setPrevBoardTitle(board.title);
    setBoardTitle(board.title);
  }

  // Sensor
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Helper to find a column by id (either column ID or task ID)
  const findColumn = (id: string, cols: IColumn[]): IColumn | undefined => {
    const directCol = cols.find((c) => c.id === id);
    if (directCol) return directCol;
    return cols.find((c) => c.tasks.some((t) => t.id === id));
  };

  // Robust Collision Detection: Checks pointerWithin first, falls back to closestCorners
  const collisionDetectionStrategy: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    return closestCorners(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (!canEdit) return;
    const { active } = event;
    const activeData = active.data.current;
    if (activeData?.type === "Task") {
      setActiveTask(activeData.task);
      const col = findColumn(String(active.id), columns);
      setOriginalColumnId(col ? col.id : null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!canEdit) return;
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const activeCol = findColumn(activeId, columns);
    const overCol = findColumn(overId, columns);

    if (!activeCol || !overCol) return;

    // Moving between DIFFERENT columns during DragOver
    if (activeCol.id !== overCol.id) {
      setColumns((prevCols) => {
        const srcCol = prevCols.find((c) => c.id === activeCol.id);
        const dstCol = prevCols.find((c) => c.id === overCol.id);
        if (!srcCol || !dstCol) return prevCols;

        const srcTasks = [...srcCol.tasks];
        const dstTasks = [...dstCol.tasks];

        const activeIndex = srcTasks.findIndex((t) => t.id === activeId);
        if (activeIndex === -1) return prevCols;

        const [movedItem] = srcTasks.splice(activeIndex, 1);
        const updatedMovedItem = { ...movedItem, columnId: dstCol.id };

        const overIndex = dstTasks.findIndex((t) => t.id === overId);
        const insertIndex = overIndex >= 0 ? overIndex : dstTasks.length;

        dstTasks.splice(insertIndex, 0, updatedMovedItem);

        return prevCols.map((c) => {
          if (c.id === srcCol.id) return { ...c, tasks: srcTasks };
          if (c.id === dstCol.id) return { ...c, tasks: dstTasks };
          return c;
        });
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const sourceColId = originalColumnId;

    setActiveTask(null);
    setOriginalColumnId(null);

    if (!canEdit || !over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeCol = findColumn(activeId, columns);
    const overCol = findColumn(overId, columns);

    if (!activeCol) return;

    const destinationColumnId = activeCol.id;
    let destinationIndex = 0;

    // Check if reordering within the same column
    if (sourceColId === activeCol.id && overCol && overCol.id === activeCol.id) {
      const oldIndex = activeCol.tasks.findIndex((t) => t.id === activeId);
      const newIndex = activeCol.tasks.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reorderedTasks = arrayMove(activeCol.tasks, oldIndex, newIndex);
        setColumns((prev) =>
          prev.map((c) =>
            c.id === activeCol.id ? { ...c, tasks: reorderedTasks } : c
          )
        );
        destinationIndex = newIndex;
      } else if (oldIndex !== -1) {
        // Did not change position
        return;
      }
    } else {
      // Moved across columns
      const idx = activeCol.tasks.findIndex((t) => t.id === activeId);
      destinationIndex = idx !== -1 ? idx : activeCol.tasks.length;
    }

    try {
      await moveTask({
        id: activeId,
        boardId: board.id,
        destinationColumnId,
        destinationIndex,
      }).unwrap();
    } catch (err) {
      console.error("Failed to persist task movement:", err);
      setColumns(board.columns || []);
    }
  };

  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    try {
      setIsSubmittingColumn(true);
      await createColumn({
        boardId: board.id,
        title: newColumnTitle.trim(),
      }).unwrap();
      setNewColumnTitle("");
      setIsAddingColumn(false);
    } finally {
      setIsSubmittingColumn(false);
    }
  };

  const handleSaveBoardTitle = async () => {
    if (boardTitle.trim() && boardTitle !== board.title) {
      await updateBoard({
        id: board.id,
        title: boardTitle.trim(),
      }).unwrap();
    }
    setIsEditingBoardTitle(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#090a0f]">
      {/* Board Sub-header / Toolbar */}
      <div className="px-4 sm:px-6 py-3 border-b border-[#21262d] bg-[#0d1117]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="h-8 w-8 rounded-xl bg-[#161b22] border border-[#262f3a] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer hover:scale-105 active:scale-95"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {isEditingBoardTitle ? (
            <div className="flex items-center gap-1.5">
              <Input
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                autoFocus
                className="h-8 text-sm font-bold py-1 px-2.5 max-w-[240px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveBoardTitle();
                  if (e.key === "Escape") {
                    setBoardTitle(board.title);
                    setIsEditingBoardTitle(false);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSaveBoardTitle}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setBoardTitle(board.title);
                  setIsEditingBoardTitle(false);
                }}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white/10 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-black text-white truncate max-w-[280px] sm:max-w-md">
                {board.title}
              </h2>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setIsEditingBoardTitle(true)}
                  className="text-gray-500 hover:text-white transition-colors cursor-pointer p-1 rounded-lg"
                  title="Rename Board"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              )}
              <Badge
                variant={userRole === "OWNER" ? "emerald" : "default"}
                className="text-[10px] uppercase font-bold"
              >
                {userRole}
              </Badge>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            className="text-xs h-8 gap-1.5 font-semibold"
          >
            <Share2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Collaborators</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#262f3a] text-gray-300">
              {1 + (board.members?.length || 0)}
            </span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsActivityDrawerOpen(true)}
            className="text-xs h-8 gap-1.5 font-semibold"
          >
            <ActivityIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Timeline</span>
          </Button>

          {isOwner && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteBoardModalOpen(true)}
              className="text-xs h-8 px-2.5 font-semibold"
              title="Delete Board"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Columns Area */}
      <div className="flex-1 overflow-x-auto p-4 sm:p-6 select-none">
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-start gap-4 h-full pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                canEdit={canEdit}
                onAddTask={async (colId, title) => {
                  await createTask({
                    boardId: board.id,
                    columnId: colId,
                    title,
                  }).unwrap();
                }}
                onEditColumn={async (colId, title) => {
                  await updateColumn({
                    boardId: board.id,
                    id: colId,
                    title,
                  }).unwrap();
                }}
                onDeleteColumn={(colId) => setColumnToDelete(colId)}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={(task) => setTaskToDelete(task)}
              />
            ))}

            {canEdit && (
              <div className="w-[280px] shrink-0">
                {isAddingColumn ? (
                  <form
                    onSubmit={handleAddColumn}
                    className="p-3.5 rounded-2xl border border-[#262f3a] bg-[#0d1117] space-y-3"
                  >
                    <Input
                      type="text"
                      placeholder="Column name (e.g. Under Review)..."
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      autoFocus
                      className="text-xs h-9"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="submit"
                        size="sm"
                        variant="emerald"
                        isLoading={isSubmittingColumn}
                        className="text-xs h-8 font-bold"
                      >
                        Add Column
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsAddingColumn(false);
                          setNewColumnTitle("");
                        }}
                        className="text-xs h-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingColumn(true)}
                    className="w-full py-3.5 px-4 rounded-2xl border border-dashed border-[#262f3a] hover:border-emerald-500/50 bg-[#0d1117]/60 hover:bg-[#161b22] text-gray-400 hover:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer group"
                  >
                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span>Add Another Column</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <DragOverlay>
            {activeTask && (
              <TaskCard
                task={activeTask}
                canEdit={false}
                onEdit={() => {}}
                onDelete={() => {}}
                isOverlay
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        key={editingTask?.id || "none"}
        task={editingTask}
        isOpen={!!editingTask}
        canEdit={canEdit}
        onClose={() => setEditingTask(null)}
        onSave={async (taskId, title, description) => {
          await updateTask({
            boardId: board.id,
            id: taskId,
            title,
            description,
          }).unwrap();
        }}
        onDelete={(task) => {
          setEditingTask(null);
          setTaskToDelete(task);
        }}
      />

      {/* Share Board Modal */}
      <ShareBoardModal
        board={board}
        isOpen={isShareModalOpen}
        isOwner={isOwner}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Activity Timeline Drawer */}
      <ActivityDrawer
        boardId={board.id}
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
      />

      {/* Confirm Modal for Delete Task */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={async () => {
          if (taskToDelete) {
            await deleteTask({
              boardId: board.id,
              id: taskToDelete.id,
            }).unwrap();
            setTaskToDelete(null);
          }
        }}
        variant="destructive"
        title="Delete Task?"
        description={`Are you sure you want to permanently delete "${taskToDelete?.title}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />

      {/* Confirm Modal for Delete Column */}
      <ConfirmModal
        isOpen={!!columnToDelete}
        onClose={() => setColumnToDelete(null)}
        onConfirm={async () => {
          if (columnToDelete) {
            await deleteColumn({
              boardId: board.id,
              id: columnToDelete,
            }).unwrap();
            setColumnToDelete(null);
          }
        }}
        variant="destructive"
        title="Delete Column?"
        description="Are you sure you want to delete this column? All tasks contained in this column will be permanently removed."
        confirmText="Yes, Delete Column"
        cancelText="Cancel"
      />

      {/* Confirm Modal for Delete Board */}
      <ConfirmModal
        isOpen={isDeleteBoardModalOpen}
        onClose={() => setIsDeleteBoardModalOpen(false)}
        onConfirm={async () => {
          await deleteBoard(board.id).unwrap();
          setIsDeleteBoardModalOpen(false);
          onBackToDashboard();
        }}
        variant="destructive"
        title="Delete Entire Board?"
        description={`Are you sure you want to delete "${board.title}"? All columns, tasks, and historical activities will be permanently deleted.`}
        confirmText="Yes, Delete Board"
        cancelText="Cancel"
      />
    </div>
  );
}
