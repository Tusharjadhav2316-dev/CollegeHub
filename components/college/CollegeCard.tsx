"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MapPin, Star, Heart } from "lucide-react";
import { useCompareStore } from "@/lib/compare-store";
import { formatFees, cn } from "@/lib/utils";

export interface CollegeCardProps {
  id: string;
  name: string;
  slug: string;
  city?: string | null;
  state: string;
  type: string;
  rating: number;
  avgPackage: number;
  annualFees: number;
  nirfRank?: number | null;
  thumbnail: string;
  description?: string | null;
  className?: string;
  initialSaved?: boolean;
  viewMode?: "grid" | "list";
  rank?: number;
}

export default function CollegeCard({
  id,
  name,
  slug,
  city,
  state,
  type,
  rating,
  avgPackage,
  annualFees,
  nirfRank,
  thumbnail,
  description,
  className,
  initialSaved = false,
  viewMode = "grid",
  rank,
}: CollegeCardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { compareList, addCollege, removeCollege } = useCompareStore();

  const [isMounted, setIsMounted] = useState(false);
  const [imgSrc, setImgSrc] = useState(thumbnail || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80");

  useEffect(() => {
    if (thumbnail) {
      setImgSrc(thumbnail);
    }
    setIsMounted(true);
  }, [thumbnail]);

  const location = city ? `${city}, ${state}` : state;
  
  // Checking if in compare list
  const isCompared = isMounted && compareList.some((c) => c.id === id);

  // Rating review count deterministically based on name length
  const reviewCount = Math.floor(((name.charCodeAt(0) + name.charCodeAt(name.length - 1 || 0)) * 7) % 400) + 800;

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCompared) {
      removeCollege(id);
    } else {
      const added = addCollege({
        id,
        name,
        slug,
        thumbnail,
        city,
        state,
        rating,
        annualFees,
        avgPackage,
        nirfRank,
        type,
      });
      if (!added) {
        alert("Maximum 4 colleges can be compared");
      }
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-white border border-[#E2E8F0] rounded-[16px] overflow-visible shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      {/* Top Image Banner */}
      <div className="relative overflow-hidden bg-slate-100 aspect-[16/9] w-full rounded-t-[15px]">
        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
          priority={false}
          onError={() => setImgSrc("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80")}
        />

        {/* Rank Badge overlapping top left */}
        {((rank && rank >= 1) || (nirfRank && nirfRank >= 1 && nirfRank <= 10)) && (
          <div className="absolute -top-3 -left-3 bg-[#FBBF24] text-white text-[14px] font-[900] px-[12px] py-[6px] rounded-br-[12px] rounded-tl-[12px] rounded-tr-[4px] rounded-bl-[4px] shadow-md z-10 border-2 border-white">
            #{rank || nirfRank}
          </div>
        )}
      </div>

      {/* College Info Section */}
      <div className="flex flex-col flex-1 px-[24px] pt-[20px] pb-[16px]">
        
        {/* Small label row */}
        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.15em] mb-1.5">
          {type || "COLLEGE NAME"}
        </span>

        {/* Name */}
        <h3 className="text-[20px] font-bold text-[#0F172A] leading-tight group-hover:text-[#4F46E5] transition-colors line-clamp-1 mb-2">
          <Link href={`/colleges/${slug}`} className="absolute inset-0 z-0"></Link>
          {name}
        </h3>

        {/* Location Row */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <MapPin className="h-[15px] w-[15px] shrink-0 text-[#94A3B8]" />
          <span className="text-[14px] font-medium text-[#64748B] truncate">{location}</span>
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-1 mb-6">
          <Star className="h-[15px] w-[15px] fill-[#F59E0B] text-[#F59E0B]" />
          <span className="text-[14px] font-bold text-[#0F172A]">{rating.toFixed(1)}</span>
          <span className="text-[13px] font-medium text-[#94A3B8]">({reviewCount.toLocaleString()} reviews)</span>
        </div>

        <div className="mt-auto relative z-10 flex flex-col gap-[16px]">
          {/* Annual Fees Row */}
          <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-[16px]">
            <span className="text-[13px] font-medium text-[#64748B]">Annual Fees</span>
            <span className="text-[15px] font-extrabold text-[#0F172A]">{formatFees(annualFees)}<span className="text-[11px] font-semibold text-[#94A3B8]">/yr</span></span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-[16px]">
            {/* Compare Toggle (Heart) */}
            <button
              onClick={handleCompareToggle}
              type="button"
              className="flex items-center gap-2 text-[14px] font-bold text-[#0F172A] hover:text-[#EF4444] transition-colors cursor-pointer"
            >
              <Heart
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  isCompared ? "fill-[#EF4444] text-[#EF4444] stroke-[#EF4444]" : "stroke-[#64748B]"
                )}
                strokeWidth={2.5}
              />
              Compare
            </button>

            {/* View Details Button */}
            <Link
              href={`/colleges/${slug}`}
              className="inline-flex items-center justify-center px-[24px] py-[10px] text-[14px] font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#EF4444] hover:shadow-lg hover:-translate-y-[1px] rounded-[10px] active:scale-[0.98] transition-all duration-200 border border-white/10"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
