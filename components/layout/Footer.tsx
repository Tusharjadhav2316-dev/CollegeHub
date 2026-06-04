import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
      <div className="mx-auto max-w-7xl px-4">
        <p>&copy; {new Date().getFullYear()} CampusPilot. All rights reserved.</p>
      </div>
    </footer>
  );
}
