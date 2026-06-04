import React from "react";

export default function Pagination() {
  return (
    <div className="flex justify-center space-x-2 py-4">
      <button className="rounded border border-slate-200 px-3 py-1 text-sm disabled:opacity-50" disabled>
        Previous
      </button>
      <button className="rounded border border-slate-200 px-3 py-1 text-sm disabled:opacity-50" disabled>
        Next
      </button>
    </div>
  );
}
