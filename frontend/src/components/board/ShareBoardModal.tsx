"use client";

import React, { useState } from "react";
import { IBoard, BoardRole } from "../../redux/features/board/boardInterface";
import {
  useShareBoardMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} from "../../redux/features/board/boardApi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  X,
  UserPlus,
  Trash2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface ShareBoardModalProps {
  board: IBoard;
  isOpen: boolean;
  isOwner: boolean;
  onClose: () => void;
}

export function ShareBoardModal({
  board,
  isOpen,
  isOwner,
  onClose,
}: ShareBoardModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<BoardRole>("EDITOR");
  const [shareBoard, { isLoading: isSharing }] = useShareBoardMutation();
  const [updateRole] = useUpdateMemberRoleMutation();
  const [removeMember] = useRemoveMemberMutation();

  if (!isOpen) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await shareBoard({
        boardId: board.id,
        email: email.trim(),
        role,
      }).unwrap();
      toast.success(`Board shared with ${email} as ${role}.`);
      setEmail("");
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error(errorObj?.data?.message || "Failed to share board");
    }
  };

  const handleRoleChange = async (memberId: string, newRole: BoardRole) => {
    try {
      await updateRole({
        boardId: board.id,
        memberId,
        role: newRole,
      }).unwrap();
      toast.success("Member role updated.");
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error(errorObj?.data?.message || "Failed to update role");
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      await removeMember({
        boardId: board.id,
        memberId,
      }).unwrap();
      toast.success("Member removed from the board.");
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error(errorObj?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-[#262f3a] bg-[#0d1117] p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Board Members & Sharing</h3>
          </div>
          <p className="text-xs text-gray-400">
            Manage who has access to <strong className="text-gray-200">{board.title}</strong>
          </p>
        </div>

        {isOwner ? (
          <form onSubmit={handleShare} className="space-y-3 pt-2">
            <Label htmlFor="share-email">Invite New Collaborator</Label>
            <div className="flex items-center gap-2">
              <Input
                id="share-email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-xs h-10 flex-1"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as BoardRole)}
                className="h-10 rounded-xl border border-[#262f3a] bg-[#161b22] px-3 text-xs text-gray-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="EDITOR">Editor</option>
                <option value="VIEWER">Viewer</option>
              </select>
              <Button
                type="submit"
                variant="emerald"
                size="sm"
                isLoading={isSharing}
                className="h-10 px-4 text-xs font-bold gap-1.5 shrink-0"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Invite</span>
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-gray-400 italic">
            Only the board owner can invite new members.
          </p>
        )}

        <div className="space-y-2.5 pt-2 border-t border-[#21262d]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Active Members ({1 + (board.members?.length || 0)})
          </span>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#161b22] border border-[#262f3a]">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                  {board.owner.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-200">
                    {board.owner.name}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {board.owner.email}
                  </div>
                </div>
              </div>
              <Badge variant="emerald" className="text-[10px]">
                OWNER
              </Badge>
            </div>

            {board.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#161b22] border border-[#262f3a]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center">
                    {member.user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-200">
                      {member.user.name}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {member.user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <>
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member.id, e.target.value as BoardRole)
                        }
                        className="h-7 rounded-lg border border-[#262f3a] bg-[#0d1117] px-2 text-[11px] text-gray-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="EDITOR">EDITOR</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemove(member.id)}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      {member.role}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
