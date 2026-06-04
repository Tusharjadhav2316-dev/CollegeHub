import React from "react";

export default function SearchBar() {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search colleges..."
        className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        disabled
      />
    </div>
  );
}
