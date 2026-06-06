"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Box, User, CheckCircle2, TrendingUp } from "lucide-react";

const INTERESTS = ["Engineering", "MBA", "Medical", "Design"];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Engineering"]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Please accept the Terms of Service.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, interests: selectedInterests }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      // Automatically sign in after registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error("Login failed after registration");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[100px]"></div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10 w-max">
          <div className="bg-white text-indigo-600 p-1.5 rounded-lg">
            <Box className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CampusPilot</span>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center relative z-10 w-full max-w-md mx-auto mt-[60px]">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-[60px] relative">
            {/* Background connecting lines */}
            <div className="absolute top-5 left-0 w-full h-[2px] flex items-center z-[-1]">
              <div className="w-1/2 h-full bg-white/30"></div>
              <div className="w-1/2 h-full border-t-2 border-dashed border-white/30"></div>
            </div>

            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 relative z-10 bg-transparent px-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-indigo-300 flex items-center justify-center text-white font-bold">1</div>
              <span className="text-[12px] font-bold text-white uppercase tracking-wider">Account</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 relative z-10 bg-[#4a3fcf] px-2">
              <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-[#4a3fcf] flex items-center justify-center text-white/50 font-bold">2</div>
              <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Preferences</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 relative z-10 bg-[#5b3bcf] px-2">
              <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-[#5b3bcf] flex items-center justify-center text-white/50 font-bold">3</div>
              <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Done</span>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-[16px] mb-[48px]">
            {[
              "Search 12,000+ colleges instantly",
              "AI-powered personalised match",
              "Compare up to 4 colleges side-by-side",
              "Free forever — no credit card"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-[16px] text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="flex gap-[16px] mt-auto">
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-[12px] p-[16px] px-[20px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-[20px] font-bold text-white leading-none">4.8M+</span>
              </div>
              <span className="text-[12px] text-white/70 font-semibold">Students</span>
            </div>
            
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-[12px] p-[16px] px-[20px] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-[20px] font-bold text-white leading-none">98%</span>
                </div>
                <span className="text-[12px] text-white/70 font-semibold">Match Accuracy</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-[24px] sm:p-[48px] bg-white">
        <div className="w-full max-w-[480px]">
          
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Box className="w-5 h-5" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold text-[#0F172A] tracking-tight">CampusPilot</span>
          </Link>

          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center justify-center gap-2 mb-[32px]">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Box className="w-6 h-6" strokeWidth={3} />
            </div>
            <span className="text-2xl font-bold text-[#0F172A] tracking-tight">CampusPilot</span>
          </div>

          <div className="text-center mb-[32px]">
            <h1 className="text-[28px] font-bold text-[#0F172A]">Create your account</h1>
            <p className="text-[14px] text-[#64748B] mt-[8px]">Start your college search journey today.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-[20px]">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-[500] text-[#0F172A] block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full h-[48px] pl-[44px] pr-[16px] rounded-[8px] border border-[#E2E8F0] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-[15px] text-slate-800"
                />
              </div>
            </div>

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
              
              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 flex gap-1 h-1.5">
                    <div className="h-full flex-1 rounded-full bg-red-500"></div>
                    <div className="h-full flex-1 rounded-full bg-red-500"></div>
                    <div className="h-full flex-1 rounded-full bg-slate-200"></div>
                    <div className="h-full flex-1 rounded-full bg-slate-200"></div>
                  </div>
                  <span className="text-[12px] text-[#64748B] w-[120px] text-right">Strength: Moderate</span>
                </div>
              )}
            </div>

            {/* Interests Section */}
            <div className="space-y-2 mt-2">
              <label className="text-[14px] font-[500] text-[#0F172A] block">I&apos;m interested in</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-[16px] py-[8px] rounded-full text-[13px] font-medium border transition-colors ${
                        isSelected 
                          ? "bg-indigo-600 border-indigo-600 text-white" 
                          : "bg-white border-[#E2E8F0] text-[#0F172A] hover:border-indigo-300"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mt-4">
              <div className="relative flex items-center justify-center mt-0.5">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 border-[#E2E8F0] rounded cursor-pointer text-indigo-600 focus:ring-indigo-500" 
                />
              </div>
              <span className="text-[13px] text-[#0F172A] leading-snug">
                I agree to the <Link href="#" className="text-indigo-600 font-medium hover:underline">Terms of Service</Link> and <Link href="#" className="text-indigo-600 font-medium hover:underline">Privacy Policy</Link>.
              </span>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-[48px] bg-gradient-to-br from-[#f97316] to-[#ef4444] text-white font-bold rounded-[8px] hover:shadow-lg transition-all active:scale-[0.98] mt-[8px] flex items-center justify-center"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-[32px]">
            <div className="flex-1 h-[1px] bg-[#E2E8F0]"></div>
            <span className="text-[13px] text-[#64748B]">or sign up with</span>
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
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700">
              Log in &rarr;
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
