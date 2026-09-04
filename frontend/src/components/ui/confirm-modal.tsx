"use client";

import React, { useEffect } from "react";
import { X, AlertTriangle, LogOut, Info, CheckCircle2 } from "lucide-react";
import { Button } from "./button";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "emerald" | "default";
  isLoading?: boolean;
  iconType?: "logout" | "warning" | "info" | "success";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone. Please confirm to proceed.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  isLoading = false,
  iconType = "warning",
}: ConfirmModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const renderIcon = () => {
    switch (iconType) {
      case "logout":
        return (
          <div className="h-11 w-11 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shadow-inner">
            <LogOut className="h-5 w-5" />
          </div>
        );
      case "success":
        return (
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        );
      case "info":
        return (
          <div className="h-11 w-11 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
            <Info className="h-5 w-5" />
          </div>
        );
      case "warning":
      default:
        return (
          <div className="h-11 w-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <AlertTriangle className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        onClick={isLoading ? undefined : onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative w-full max-w-md rounded-2xl border border-[#262f3a] bg-[#0d1117] p-6 shadow-2xl transition-all z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Top subtle highlight line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
            variant === "destructive"
              ? "bg-gradient-to-r from-red-500/60 via-red-500 to-rose-400/60"
              : "bg-gradient-to-r from-emerald-500/60 via-emerald-400 to-teal-400/60"
          }`}
        />

        {/* Professional Cross / Close Icon */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-40"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>

        {/* Modal Body */}
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row gap-4 pt-2">
          <div className="shrink-0">{renderIcon()}</div>
          <div className="space-y-1.5 flex-1 pr-6">
            <h3
              id="confirm-modal-title"
              className="text-lg font-bold text-white tracking-tight"
            >
              {title}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto text-xs font-semibold text-gray-300 hover:text-white"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full sm:w-auto text-xs font-bold"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
