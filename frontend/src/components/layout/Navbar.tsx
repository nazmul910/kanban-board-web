"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "../../redux/hooks";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ConfirmModal } from "../ui/confirm-modal";
import {
  Kanban,
  LogOut,
  User,
  Menu,
  X,
  LayoutDashboard,
  Layers,
  Activity,
  Settings,
} from "lucide-react";

export function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const [logout, { isLoading }] = useLogoutMutation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleConfirmLogout = async () => {
    try {
      await logout().unwrap();
      setIsLogoutModalOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { name: "Overview", icon: LayoutDashboard, href: "/" },
    { name: "Boards", icon: Layers, href: "/" },
    { name: "Activity", icon: Activity, href: "/activity" },
    { name: "Settings", icon: Settings, href: "#" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#21262d] bg-[#090a0f]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Desktop Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 emerald-glow-sm">
                <Kanban className="h-5 w-5" />
              </div>
              <span className="text-base font-black tracking-wider text-white">
                KANBAN
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center gap-1 ml-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#161b22] transition-all duration-150 cursor-pointer"
                  >
                    <link.icon className="h-3.5 w-3.5 text-gray-400" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Desktop User profile & actions */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#262f3a]">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {user.name ? (
                      user.name[0].toUpperCase()
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-gray-200 leading-none">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-gray-400 leading-none mt-1">
                      {user.email}
                    </div>
                  </div>
                  <Badge variant="default" className="text-[10px] py-0 px-2 ml-1">
                    Active
                  </Badge>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="text-xs h-9 text-gray-300 hover:text-red-400 hover:border-red-500/40"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Badge variant="outline" className="text-xs text-gray-400">
                Not Authenticated
              </Badge>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="h-10 w-10 rounded-xl bg-[#161b22] border border-[#262f3a] text-gray-300 hover:text-emerald-400 hover:border-emerald-500/40 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Smooth Mobile Sidebar / Drawer */}
      <div
        className={`fixed inset-0 z-50 sm:hidden transition-visibility duration-300 ${
          isMobileMenuOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {/* Sidebar Drawer Panel */}
        <div
          className={`fixed inset-y-0 left-0 w-[280px] max-w-[85vw] bg-[#0d1117] border-r border-[#21262d] shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-[#21262d] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 emerald-glow-sm">
                <Kanban className="h-4 w-4" />
              </div>
              <span className="text-sm font-black tracking-wider text-white">
                KANBAN
              </span>
            </div>

            {/* Sleek Professional Close Cross Icon */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
              aria-label="Close mobile menu"
            >
              <X className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* User Profile Card if logged in */}
            {user ? (
              <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#262f3a] space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    {user.name ? (
                      user.name[0].toUpperCase()
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <Badge variant="default" className="text-[10px] py-0.5 px-2">
                    Active Session
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#161b22]/60 border border-[#21262d] text-center">
                <p className="text-xs text-gray-400">Welcome to Kanban</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Please sign in to continue</p>
              </div>
            )}

            {/* Navigation items */}
            {user && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2">
                  Navigation
                </span>
                <nav className="space-y-1 pt-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:text-emerald-400 hover:bg-[#161b22] transition-colors cursor-pointer"
                    >
                      <link.icon className="h-4 w-4 text-emerald-400/80" />
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Drawer Footer / Logout Action */}
          {user && (
            <div className="p-4 border-t border-[#21262d]">
              <Button
                variant="destructive"
                className="w-full text-xs font-semibold justify-center gap-2 h-10"
                onClick={() => {
                  setIsLogoutModalOpen(true);
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Logout */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoading}
        iconType="logout"
        variant="destructive"
        title="Log Out of Kanban?"
        description="Are you sure you want to end your active session? You will be redirected to the sign-in screen."
        confirmText="Yes, Log Out"
        cancelText="Cancel"
      />
    </>
  );
}
