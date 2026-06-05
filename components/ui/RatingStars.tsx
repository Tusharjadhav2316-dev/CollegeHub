import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxRating?: number;
  showNumeric?: boolean;
  starSize?: number;
}

export const RatingStars = React.forwardRef<HTMLDivElement, RatingStarsProps>(
  (
    {
      className,
      rating,
      maxRating = 5,
      showNumeric = true,
      starSize = 16,
      ...props
    },
    ref
  ) => {
    // Clamp rating between 0 and maxRating
    const activeRating = Math.max(0, Math.min(maxRating, rating));

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1.5", className)}
        aria-label={`Rating: ${activeRating} out of ${maxRating} stars`}
        {...props}
      >
        <div className="flex items-center text-amber-500" aria-hidden="true">
          {[...Array(maxRating)].map((_, index) => {
            const starValue = index + 1;
            const isFull = activeRating >= starValue;
            const isHalf = !isFull && activeRating >= starValue - 0.5;

            if (isFull) {
              return (
                <Star
                  key={index}
                  size={starSize}
                  fill="currentColor"
                  className="stroke-amber-500"
                />
              );
            } else if (isHalf) {
              return (
                <span key={index} className="relative inline-block">
                  <Star
                    size={starSize}
                    className="text-slate-200 dark:text-slate-700 stroke-slate-200 dark:stroke-slate-700"
                  />
                  <span className="absolute inset-0 overflow-hidden w-1/2">
                    <Star
                      size={starSize}
                      fill="currentColor"
                      className="stroke-amber-500"
                    />
                  </span>
                </span>
              );
            } else {
              return (
                <Star
                  key={index}
                  size={starSize}
                  className="text-slate-200 dark:text-slate-700 stroke-slate-200 dark:stroke-slate-700"
                />
              );
            }
          })}
        </div>
        {showNumeric && (
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {activeRating.toFixed(1)}
          </span>
        )}
      </div>
    );
  }
);

RatingStars.displayName = "RatingStars";
export default RatingStars;
