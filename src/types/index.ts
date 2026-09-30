export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN" | "MODERATOR" | "EDITOR";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Location {
  id: string;
  name: string;
  type: string;
  provinces?: { id: string; name: string }[];
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  category_id: string;
  location_id: string;
  owner_id?: string | null;
  category_name: string | null;
  location_name: string | null;
  is_verified: boolean;
  is_active: boolean;
  score: number;
  total_reviews: number;
  confidence_level: string;
  quality_score?: number;
  service_score?: number;
  price_score?: number;
  reliability_score?: number;
  experience_score?: number;
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  user_id?: string;
  company_id?: string;
  user_name?: string | null;
  company_name?: string | null;
  quality: number;
  service: number;
  price: number;
  reliability: number;
  experience: number;
  is_valid?: boolean;
  agree_count?: number;
  disagree_count?: number;
  comment_count?: number;
  created_at: string;
}

export interface ReviewComment {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface ScoreHistory {
  id: string;
  score: number;
  total_reviews: number;
  created_at: string;
}

export interface ScoreResponse {
  company_id: string;
  score: number;
  quality_score: number;
  service_score: number;
  price_score: number;
  reliability_score: number;
  experience_score: number;
  total_reviews: number;
  confidence_level: string;
  updated_at: string | null;
}

export type RankingBoard = "rating" | "volume" | "recent";

export interface RankingItem {
  company_id: string;
  name: string;
  slug: string;
  kind: string | null;
  category_name: string | null;
  location_name: string | null;
  rating: number;
  score: number;
  total_reviews: number;
  confidence_level: string;
  verification_status: string | null;
  last_review_at: string | null;
  rank: number | null;
}

export interface RankingResponse {
  board: RankingBoard;
  items: RankingItem[];
  total: number;
  note: string | null;
}

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  code?: string;
}

export interface FeedUser {
  id: string;
  name: string;
  username: string | null;
  reputation: number;
  level: string;
}

export interface FeedCompany {
  id: string;
  name: string;
  slug: string;
  kind: string;
  verification_status: string;
}

export interface FeedReview {
  id: string;
  rating: number;
  comment: string | null;
  criteria: Record<string, number>;
  created_at: string;
  user: FeedUser | null;
  company: FeedCompany | null;
  photo_count: number;
  comment_count: number;
}

export interface NeedsReviewsItem {
  id: string;
  name: string;
  slug: string;
  review_count: number;
  category_name: string | null;
  location_name: string | null;
}

export interface FeedData {
  recent_reviews: FeedReview[];
  needs_reviews: NeedsReviewsItem[];
}

export interface DistributionData {
  total_reviews: number;
  average: number;
  distribution: { stars: number; count: number; percentage: number }[];
  user_vote: number | null;
  community_agreement: number | null;
}

export interface Contributor {
  rank: number;
  user_id: string;
  name: string;
  username: string | null;
  total_reviews: number;
  approved_contributions: number;
  approval_rate: number;
  reputation: number;
  level: string;
}

export interface UserProgress {
  reviews: {
    total: number;
    published: number;
    pending: number;
    rejected: number;
    edited: number;
  };
  contributions: {
    total: number;
    approved: number;
    rejected: number;
  };
  photos_approved: number;
  reputation: {
    score: number;
    level: string;
    open_signals: number;
  };
  last_30_days: number;
}

export interface Notification {
  id: string;
  type: string;
  content: string;
  entity_type: string | null;
  entity_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  total_companies: number;
  total_reviews: number;
  pending_reports: number;
  total_categories: number;
  total_locations: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface AdminReport {
  id: string;
  user_id: string;
  review_id: string;
  company_id: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
}

export interface QuickRateCandidate {
  id: string;
  name: string;
  category_name: string | null;
  score: number;
  total_reviews: number;
}