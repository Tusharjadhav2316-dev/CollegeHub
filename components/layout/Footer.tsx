import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12">
          
          {/* Column 1: Logo & Tagline */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span>CampusPilot</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering students to discover, compare, and choose the right academic path. Smart decisions for a better future.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/discover" className="text-sm hover:text-white transition-colors">
                  Discover Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm hover:text-white transition-colors">
                  Compare Tool
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="text-sm hover:text-white transition-colors">
                  Top Rankings
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="text-sm hover:text-white transition-colors">
                  Scholarships
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Counsellors
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Exam Prep
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Social Icons */}
          <div className="flex space-x-6 order-2 md:order-1">
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 2.39.109 3.436 1.166 3.548 3.545.045.926.05 1.28.05 3.71 0 2.43-.005 2.784-.05 3.71-.113 2.379-1.157 3.437-3.549 3.545-.925.044-1.28.054-3.71.054-2.43 0-2.784-.01-3.71-.054-2.39-.109-3.436-1.166-3.548-3.545-.045-.926-.05-1.28-.05-3.71 0-2.43.005-2.784.05-3.71.112-2.379 1.156-3.436 3.548-3.545.926-.044 1.28-.054 3.71-.054zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-slate-400 order-1 md:order-2">
            &copy; {currentYear} CampusPilot. All rights reserved. Built for students worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
