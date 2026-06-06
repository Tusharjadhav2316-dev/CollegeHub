"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Box, Star } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col w-1/2 relative bg-gradient-to-br from-[#3730a3] via-[#4f46e5] to-[#6d28d9] p-[60px] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[80px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[100px]"></div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10 w-max">
          <div className="bg-white text-indigo-600 p-1.5 rounded-lg">
            <Box className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CampusPilot</span>
        </Link>

        {/* Content Centered */}
        <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full max-w-sm mx-auto mt-[60px]">
          
          {/* Floating College Card */}
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] p-[16px] w-full shadow-2xl mb-[40px]">
            {/* Rank overlay */}
            <div className="absolute -top-3 -right-3 bg-[#F59E0B] text-white text-[12px] font-bold px-[12px] py-[4px] rounded-full shadow-lg">
              #1 Engineering
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative w-[60px] h-[60px] rounded-[12px] overflow-hidden shrink-0">
                <Image src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&q=80" alt="IIT Bombay" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-[16px]">IIT Bombay</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-white text-[13px] font-bold">4.9</span>
                  <span className="text-white/70 text-[11px]">(2,841 reviews)</span>
                </div>
                <div className="mt-2">
                  <span className="inline-block bg-orange-500/20 border border-orange-400/30 text-orange-200 text-[10px] font-bold uppercase tracking-wider px-[8px] py-[2px] rounded-full">
                    Engineering
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="bg-[#1a1a4e]/60 backdrop-blur-md border border-white/10 rounded-[16px] p-[16px] w-full shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                AR
              </div>
              <div>
                <p className="text-white text-[13px] font-semibold leading-snug">
                  &quot;Got into IIT Delhi in my first attempt!&quot;
                </p>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mt-2">
                  Arjun R., JEE 2024
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-[24px] sm:p-[48px] bg-white">
        <div className="w-full max-w-[420px]">
          
          {/* Mobile Logo (hidden on desktop) */}
          <Link href="/" className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Box className="w-5 h-5" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold text-[#0F172A] tracking-tight">CampusPilot</span>
          </Link>

          {/* Desktop Logo centered above form */}
          <div className="hidden lg:flex items-center justify-center gap-2 mb-[32px]">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Box className="w-6 h-6" strokeWidth={3} />
            </div>
            <span className="text-2xl font-bold text-[#0F172A] tracking-tight">CampusPilot</span>
          </div>

          <div className="text-center mb-[32px]">
            <h1 className="text-[28px] font-bold text-[#0F172A]">Welcome back</h1>
            <p className="text-[14px] text-[#64748B] mt-[8px]">Log in to continue your college journey.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-[20px]">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-[500] text-[#0F172A] block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full h-[48px] pl-[44px] pr-[16px] rounded-[8px] border border-[#E2E8F0] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-[15px] text-slate-800"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-[500] text-[#0F172A] block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-[48px] pl-[44px] pr-[44px] rounded-[8px] border border-[#E2E8F0] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-[15px] text-slate-800"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot */}
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-4 h-4 rounded border border-[#E2E8F0] flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                  <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" />
                  <div className="hidden peer-checked:block w-2 h-2 bg-indigo-600 rounded-sm"></div>
                </div>
                <span className="text-[13px] text-[#0F172A]">Remember me</span>
              </label>
              <Link href="#" className="text-[13px] text-indigo-600 font-medium hover:text-indigo-700">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-[48px] bg-gradient-to-br from-[#f97316] to-[#ef4444] text-white font-bold rounded-[8px] hover:shadow-lg transition-all active:scale-[0.98] mt-[8px] flex items-center justify-center"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-[32px]">
            <div className="flex-1 h-[1px] bg-[#E2E8F0]"></div>
            <span className="text-[13px] text-[#64748B]">or continue with</span>
            <div className="flex-1 h-[1px] bg-[#E2E8F0]"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-[16px]">
            <button 
              type="button"
              onClick={() => handleOAuth("google")}
              className="h-[44px] flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] rounded-[8px] hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-[14px] font-medium text-[#0F172A]">Google</span>
            </button>
            <button 
              type="button"
              onClick={() => handleOAuth("github")}
              className="h-[44px] flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] rounded-[8px] hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="text-[14px] font-medium text-[#0F172A]">GitHub</span>
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-[14px] text-[#64748B] mt-[32px]">
            New to CampusPilot?{" "}
            <Link href="/register" className="text-indigo-600 font-bold hover:text-indigo-700">
              Create account &rarr;
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
