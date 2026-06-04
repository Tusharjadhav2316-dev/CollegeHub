import React from "react";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <span className="text-xl font-bold text-indigo-600">CampusPilot</span>
        <div className="space-x-4">
          <span className="text-sm text-slate-600">Navbar Placeholder</span>
        </div>
      </div>
    </nav>
  );
}
