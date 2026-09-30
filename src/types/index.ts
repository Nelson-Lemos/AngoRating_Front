export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "USER" | "BUSINESS" | "ADMIN";
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
  owner_id: string | null;
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
  user_id: string;
  company_id: string;
  user_name?: string;
  company_name?: string;
  quality: number;
  service: number;
  price: number;
  reliability: number;
  experience: number;
  is_valid: boolean;
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

export interface RankingItem {
  company_id: string;
  company_name: string;
  slug: string;
  category_name: string | null;
  location_name: string | null;
  score: number;
  total_reviews: number;
  confidence_level: string;
  trend: number | null;
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

export interface FeedData {
  recent_reviews: FeedReview[];
  trending: RankingItem[];
  active_battle: BattleData | null;
  active_wave: WaveData | null;
}

export interface FeedReview {
  id: string;
  user_name: string;
  company_id: string;
  company_name: string;
  quality: number;
  service: number;
  price: number;
  reliability: number;
  experience: number;
  created_at: string;
}

export interface BattleData {
  id: string;
  title: string;
  company_a_id: string;
  company_a_name: string;
  company_a_score: number;
  company_b_id: string;
  company_b_name: string;
  company_b_score: number;
  votes_a: number;
  votes_b: number;
  total_votes: number;
  user_vote?: string | null;
  expires_at: string | null;
}

export interface WaveData {
  id: string;
  title: string;
  description: string;
  company_votes: WaveCompanyVote[];
  total_votes: number;
  ends_at: string;
}

export interface WaveCompanyVote {
  company_id: string;
  company_name: string;
  votes: number;
  percentage: number;
}

export interface DistributionData {
  total_reviews: number;
  average: number;
  distribution: { stars: number; count: number; percentage: number }[];
  user_vote: number | null;
  community_agreement: number | null;
}

export interface UserXP {
  total_xp: number;
  level: string;
  next_level: string | null;
  xp_to_next: number | null;
  badges: UserBadge[];
  rank_percentile: number | null;
}

export interface UserBadge {
  type: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface Challenge {
  id: string;
  type: string;
  description: string;
  target: number;
  current: number;
  xp_reward: number;
  completed: boolean;
  week_iso: string;
}

export interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  total_xp: number;
  level: string;
  total_reviews: number;
  rank: number;
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

export interface QuickRateCandidate {
  id: string;
  name: string;
  category_name: string | null;
  score: number;
  total_reviews: number;
}
