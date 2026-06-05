export interface UserType {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CollegeType {
  id: string;
  name: string;
  slug: string;
  city?: string | null;
  state: string;
  location: string;
  type: string;
  annualFees: number;
  avgPackage: number;
  rating: number;
  nirfRank?: number | null;
  thumbnail: string;
  description: string;
  createdAt: Date | string;
}

export interface CourseType {
  id: string;
  name: string;
  duration: number;
  fees: number;
  seats?: number | null;
  collegeId: string;
}

export interface ReviewType {
  id: string;
  rating: number;
  title: string;
  body: string;
  userId: string;
  collegeId: string;
  createdAt: Date | string;
}

export interface SavedCollegeType {
  id: string;
  userId: string;
  collegeId: string;
  savedAt: Date | string;
}

export interface CollegeFilters {
  search?: string;
  state?: string;
  city?: string;
  type?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
