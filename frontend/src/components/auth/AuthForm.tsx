"use client";

import React, { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../../redux/features/auth/authApi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Kanban, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

interface AuthFormProps {
  onSuccess?: () => void;
}

interface ApiErrorResponse {
  data?: {
    message?: string;
  };
  error?: string;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const isLoading = isLoginLoading || isRegisterLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await login({ email, password }).unwrap();
        toast.success(res.message || "Logged in successfully!");
        if (onSuccess) onSuccess();
      } else {
        await register({ name, email, password }).unwrap();
        toast.success("Account created successfully. You can now sign in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err: unknown) {
      const apiErr = err as ApiErrorResponse;
      const msg =
        apiErr?.data?.message ||
        apiErr?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="border border-[#262f3a] bg-[#0d1117]/95 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400" />

        <CardHeader className="space-y-3 text-center pt-8 pb-4">
          <div className="flex justify-center items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 emerald-glow-sm">
              <Kanban className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white">
              KANBAN
            </span>
          </div>

          <div>
            <CardTitle className="text-2xl font-black text-white">
              {isLogin ? "Welcome Back" : "Create an Account"}
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs mt-1">
              {isLogin
                ? "Enter your credentials to access your workspace"
                : "Register to collaborate and manage projects"}
            </CardDescription>
          </div>

          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#161b22] border border-[#262f3a] mt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isLogin
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isLogin
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Register
            </button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-2">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2 pb-8">
            <Button
              type="submit"
              variant="emerald"
              className="w-full text-sm font-bold tracking-wide"
              isLoading={isLoading}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
