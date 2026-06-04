export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  type: string;
  naacGrade?: string | null;
  nirfRank?: number | null;
  annualFees: number;
  placementRate: number;
  avgPackage: number;
  thumbnail?: string | null;
  banner?: string | null;
}
