"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { CollegeCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          CampusPilot Design System
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          A collection of reusable UI components and design patterns for the platform.
        </p>
      </div>

      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Buttons</h2>
        <p className="text-sm text-slate-500">Variants, sizes, and states for user interaction.</p>
        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          {/* Variants */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium (Default)</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* States */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">States</h3>
            <div className="flex flex-wrap gap-4">
              <Button isLoading>Loading State</Button>
              <Button disabled>Disabled State</Button>
              <Button variant="secondary" isLoading>Secondary Loading</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Badges</h2>
        <p className="text-sm text-slate-500">Pill badges used for college categorization, accreditation, and statuses.</p>
        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">College Types</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="government">Government</Badge>
              <Badge variant="private">Private</Badge>
              <Badge variant="deemed">Deemed University</Badge>
              <Badge variant="naac">NAAC A++</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">System Statuses</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success">Active / Approved</Badge>
              <Badge variant="warning">Pending Review</Badge>
              <Badge variant="error">Declined / Closed</Badge>
              <Badge variant="default">Default</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Stars Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Rating Stars</h2>
        <p className="text-sm text-slate-500">Visual ratings indicator for colleges and courses.</p>
        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Full 5 Stars</span>
              <RatingStars rating={5} />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Half Star (4.5)</span>
              <RatingStars rating={4.5} />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Decimal Value (3.2)</span>
              <RatingStars rating={3.2} />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">No Numeric Display</span>
              <RatingStars rating={4.8} showNumeric={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Skeletons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Skeletons</h2>
        <p className="text-sm text-slate-500">Loading state placeholders for cards and text content.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">College Card Skeleton</h3>
            <CollegeCardSkeleton />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Basic Skeletons</h3>
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
