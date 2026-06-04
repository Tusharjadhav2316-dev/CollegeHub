import React from "react";

export default function CollegeDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800">College Details</h1>
      <p className="text-slate-500">Slug: {params.slug}</p>
    </div>
  );
}
