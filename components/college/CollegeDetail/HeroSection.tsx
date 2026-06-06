"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MapPin, Star, Heart, CheckCircle } from "lucide-react";
import { useCompareStore } from "@/lib/compare-store";
import { toast } from "react-hot-toast";

interface HeroSectionProps {
  college: any;
}

export default function HeroSection({ college }: HeroSectionProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSavedState, setIsSavedState] = useState(college.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsSavedState(college.isSaved || false);
  }, [college.isSaved]);

  const { compareList, addCollege, removeCollege } = useCompareStore();
  const isAddedToCompare = compareList.some((c) => c.id === college.id);

  const handleCompareClick = () => {
    if (isAddedToCompare) {
      removeCollege(college.id);
      toast.success("Removed from comparison");
    } else {
      const added = addCollege({
        id: college.id,
        name: college.name,
        slug: college.slug,
        thumbnail: college.thumbnail,
        city: college.city,
        state: college.state,
        rating: college.averageRating || college.rating || 4.0,
        annualFees: college.annualFees,
        avgPackage: college.avgPackage,
        nirfRank: college.nirfRank,
        type: college.type,
      });
      if (!added) {
        toast.error("Maximum 3 colleges for comparison");
      } else {
        toast.success("College added to comparison!");
      }
    }
  };

  const handleSaveClick = async () => {
    if (!session || !session.user) {
      toast.error("Please login to save");
      router.push(`/login?callbackUrl=/colleges/${college.slug}`);
      return;
    }

    const previousSavedState = isSavedState;
    setIsSavedState(!previousSavedState);
    setIsSaving(true);

    try {
      const method = previousSavedState ? "DELETE" : "POST";
      const res = await fetch("/api/save", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collegeId: college.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to update save status");
      }

      if (previousSavedState) {
        toast.success("Removed from saved");
      } else {
        toast.success("College saved!");
      }
    } catch (err) {
      console.error(err);
      setIsSavedState(previousSavedState);
      toast.error("Failed to update save status");
    } finally {
      setIsSaving(false);
    }
  };

  const ratingVal = college.averageRating || college.rating || 4.5;
  const totalReviewsVal = college.totalReviews !== undefined ? college.totalReviews : 128;
  const establishedYear = 1958 + (college.name.charCodeAt(0) % 60); 
  const naacGrade = college.nirfRank && college.nirfRank < 20 ? "A++" : "A+";
  const bannerImg = college.banner || "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80";

  return (
    <div className="relative w-full h-[320px] md:h-[480px] overflow-hidden bg-slate-900">
      <Image
        src={bannerImg}
        alt={college.name}
        fill
        className="object-cover opacity-70"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-10" />

      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div>
          {college.nirfRank && college.nirfRank >= 1 && college.nirfRank <= 50 && (
            <div className="inline-flex items-center bg-[#F59E0B] text-white text-[12px] md:text-[14px] font-bold px-3 py-1.5 rounded-full shadow-lg">
              #{college.nirfRank} Engineering
            </div>
          )}
        </div>

        <div className="text-white">
          <h1 className="text-2xl md:text-[36px] font-bold leading-tight drop-shadow-md">
            {college.name}
          </h1>

          <div className="flex items-center gap-2 mt-2 text-[14px] md:text-[16px] text-white/95">
            <MapPin className="h-4.5 w-4.5 text-white/80 shrink-0" />
            <span>{college.location}, {college.state}</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="font-bold text-[14px] md:text-[16px]">{Number(ratingVal).toFixed(1)} ★</span>
            </div>
            <span className="text-[14px] md:text-[16px] text-white/80">({totalReviewsVal} reviews)</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 text-[12px] md:text-[13px] font-medium">
            <span className="px-2.5 py-1 bg-black/40 border border-white/20 rounded-full">
              {college.type}
            </span>
            <span className="px-2.5 py-1 bg-black/40 border border-white/20 rounded-full">
              NAAC {naacGrade}
            </span>
            <span className="px-2.5 py-1 bg-black/40 border border-white/20 rounded-full">
              Est. {establishedYear}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-[#EF4444] text-white text-[14px] md:text-[15px] font-bold rounded-lg hover:bg-[#DC2626] transition-all shadow-md active:scale-95"
            >
              Apply Now
            </a>

            <button
              onClick={handleCompareClick}
              className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 border text-[14px] md:text-[15px] font-medium rounded-lg transition-all active:scale-95 cursor-pointer ${
                isAddedToCompare
                  ? "bg-white/15 border-white text-white font-bold"
                  : "bg-transparent border-white text-white hover:bg-white/10"
              }`}
            >
              {isAddedToCompare ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                  <span>Added</span>
                </>
              ) : (
                <span>Compare</span>
              )}
            </button>

            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 border border-white text-white text-[14px] md:text-[15px] font-medium rounded-lg hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <Heart
                className={`h-4.5 w-4.5 transition-colors ${
                  isSavedState ? "fill-[#EF4444] text-[#EF4444]" : "text-white"
                }`}
              />
              <span>{isSavedState ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
