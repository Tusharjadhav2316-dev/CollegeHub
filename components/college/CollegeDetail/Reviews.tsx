"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import RatingStars from "@/components/ui/RatingStars";

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string | Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ReviewsProps {
  collegeId: string;
  collegeSlug: string;
  initialReviews: Review[];
  totalCount: number;
}

export default function Reviews({ collegeId, collegeSlug, initialReviews, totalCount }: ReviewsProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // Local reviews and pagination state
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [totalReviewsCount, setTotalReviewsCount] = useState(totalCount);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(totalCount / 10));
  const [sortBy, setSortBy] = useState("recent"); // "recent" | "highest" | "lowest"
  const [loading, setLoading] = useState(false);

  // Form states
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Re-fetch reviews when page changes
  useEffect(() => {
    if (page > 1) {
      fetchReviews(page);
    } else {
      setReviews(initialReviews);
      setTotalPages(Math.ceil(totalCount / 10));
      setTotalReviewsCount(totalCount);
    }
  }, [page, initialReviews, totalCount]);

  const fetchReviews = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?collegeId=${collegeId}&page=${p}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setTotalPages(data.pagination.totalPages);
        setTotalReviewsCount(data.pagination.totalCount);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sort reviews locally
  const sortedReviews = React.useMemo(() => {
    const reviewsCopy = [...reviews];
    if (sortBy === "highest") {
      return reviewsCopy.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === "lowest") {
      return reviewsCopy.sort((a, b) => a.rating - b.rating);
    }
    // Default is recent (already ordered desc by API, but double check with date just in case)
    return reviewsCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [reviews, sortBy]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formTitle.trim() || formTitle.trim().length < 3) {
      setErrorMessage("Title must be at least 3 characters long.");
      return;
    }
    if (!formBody.trim() || formBody.trim().length < 50) {
      setErrorMessage("Review details must be at least 50 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          collegeId,
          rating: formRating,
          title: formTitle,
          body: formBody
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSuccessMessage("Review submitted successfully!");
      setFormTitle("");
      setFormBody("");
      setFormRating(5);
      
      // Optimistically add the new review to the top of the list
      const newReview: Review = {
        ...data.review,
        createdAt: new Date().toISOString()
      };
      
      setReviews(prev => [newReview, ...prev]);
      setTotalReviewsCount(prev => prev + 1);
      setTotalPages(prev => Math.max(1, Math.ceil((totalReviewsCount + 1) / 10)));
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit review. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* TOP SECTION - WRITE A REVIEW */}
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6">
        <h3 className="text-lg font-bold text-[#0F172A] mb-4">Write a Review</h3>

        {!session || !session.user ? (
          <div className="bg-[#F8F9FF] border border-[#E2E8F0] rounded-[12px] p-6 text-center space-y-3.5">
            <MessageSquare className="h-10 w-10 text-indigo-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-[#0F172A]">Share your experience</h4>
              <p className="text-sm text-[#64748B] max-w-sm mx-auto">
                Login with your email or social account to write an authentic review about placements, faculty, and campus life.
              </p>
            </div>
            <button
              onClick={() => router.push(`/login?callbackUrl=/colleges/${collegeSlug}`)}
              className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold rounded-[8px] transition-colors cursor-pointer"
            >
              Login to Write Review
            </button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-[8px] p-3 flex items-center gap-2">
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold rounded-[8px] p-3 flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Rating Selector */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0F172A]">Overall Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        (hoverRating !== null ? star <= hoverRating : star <= formRating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div className="space-y-1.5">
              <label htmlFor="review-title" className="text-sm font-bold text-[#0F172A]">Review Title</label>
              <input
                id="review-title"
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Summarize your experience (e.g. Excellent placement rate and campus life)"
                required
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[8px] text-sm text-[#0F172A] placeholder-[#64748B] bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-colors"
              />
            </div>

            {/* Review Body */}
            <div className="space-y-1.5">
              <label htmlFor="review-body" className="text-sm font-bold text-[#0F172A]">Review Details</label>
              <textarea
                id="review-body"
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                placeholder="Share detailed experience about academics, placements, facilities, hostel, and campus culture... (minimum 50 characters)"
                required
                rows={5}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[8px] text-sm text-[#0F172A] placeholder-[#64748B] bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-colors"
              />
              <div className="text-right text-[11px] font-semibold text-[#64748B]">
                {formBody.length}/50 characters minimum
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold rounded-[8px] transition-colors inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Review</span>
              )}
            </button>
          </form>
        )}
      </div>

      {/* BOTTOM SECTION - ALL REVIEWS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#0F172A]">
            Student Reviews ({totalReviewsCount})
          </h3>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-[#64748B]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-[8px] text-xs font-semibold text-[#0F172A] bg-white focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-[#4F46E5] animate-spin" />
          </div>
        ) : sortedReviews.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-8 text-center text-sm font-semibold text-[#64748B]">
            Be the first to review this college
          </div>
        ) : (
          <div className="space-y-4">
            {sortedReviews.map((review) => {
              const initials = review.user?.name 
                ? review.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                : "U";

              return (
                <div key={review.id} className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 space-y-3.5">
                  <div className="flex items-center gap-3">
                    {review.user?.image ? (
                      <img 
                        src={review.user.image} 
                        alt={review.user.name || "User"} 
                        className="h-10 w-10 rounded-full object-cover border border-[#E2E8F0]"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                    )}
                    <div>
                      <div className="text-[14px] font-bold text-[#0F172A]">
                        {review.user?.name || "Anonymous User"}
                      </div>
                      <div className="mt-0.5">
                        <RatingStars rating={review.rating} showNumeric={false} starSize={12} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-[14px] font-bold text-[#0F172A]">{review.title}</h4>
                    <p className="text-[13px] leading-relaxed text-[#64748B] whitespace-pre-wrap">{review.body}</p>
                  </div>

                  <div className="text-[11px] font-semibold text-[#64748B]">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  className="p-2 border border-[#E2E8F0] rounded-[8px] bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 text-[#64748B]" />
                </button>
                <span className="text-xs font-bold text-[#0F172A]">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-2 border border-[#E2E8F0] rounded-[8px] bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4 text-[#64748B]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
