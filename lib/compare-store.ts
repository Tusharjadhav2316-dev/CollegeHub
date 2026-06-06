import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompareCollege {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  city?: string | null;
  state: string;
  rating: number;
  annualFees: number;
  avgPackage: number;
  nirfRank?: number | null;
  type: string;
}

interface CompareState {
  compareList: CompareCollege[];
  addCollege: (college: CompareCollege) => boolean;
  removeCollege: (collegeId: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareList: [],
      addCollege: (college) => {
        const list = get().compareList;
        if (list.some((c) => c.id === college.id)) {
          return true; // Already exists
        }
        if (list.length >= 3) {
          return false; // Limit reached
        }
        set({ compareList: [...list, college] });
        return true;
      },
      removeCollege: (collegeId) => {
        set({
          compareList: get().compareList.filter((c) => c.id !== collegeId),
        });
      },
      clearCompare: () => {
        set({ compareList: [] });
      },
    }),
    {
      name: "campuspilot-compare",
    }
  )
);
