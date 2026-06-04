import React from "react";

export default function RatingStars({
  rating,
  ...props
}: { rating: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex items-center space-x-1" {...props}>
      <span className="text-yellow-400">★</span>
      <span className="text-sm font-medium text-slate-700">{rating.toFixed(1)}</span>
    </div>
  );
}
