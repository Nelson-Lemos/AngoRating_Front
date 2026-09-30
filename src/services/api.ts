import type {
  User,
  Company,
  Review,
  ReviewComment,
  Category,
  Location,
  ScoreHistory,
  RankingItem,
  PaginatedResponse,
  TokenResponse,
  FeedData,
  BattleData,
  WaveData,
  DistributionData,
  UserXP,
  Challenge,
  LeaderboardEntry,
  Notification,
} from "../types";

const BASE = "/api/v1";

function getTokens(): { access: string | null; refresh: string | null } {
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  };
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const { access } = getTokens();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (access) {
    headers["Authorization"] = `Bearer ${access}`;
  }
  const res = await fetch(`${BASE}${url}`, { ...options, headers });
  if (res.status === 401) {
    clearTokens();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(error.detail || error.message || "Erro na requisição");
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      request<User>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<TokenResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    refresh: (refresh_token: string) =>
      request<TokenResponse>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token }),
      }),
    me: () => request<User>("/auth/me"),
    saveTokens: setTokens,
    clearTokens,
  },
  companies: {
    list: (params?: {
      category_id?: string;
      location_id?: string;
      q?: string;
      skip?: number;
      limit?: number;
    }) => {
      const sp = new URLSearchParams();
      if (params?.category_id) sp.set("category_id", params.category_id);
      if (params?.location_id) sp.set("location_id", params.location_id);
      if (params?.q) sp.set("q", params.q);
      if (params?.skip) sp.set("skip", String(params.skip));
      if (params?.limit) sp.set("limit", String(params.limit));
      return request<PaginatedResponse<Company>>(`/companies?${sp}`);
    },
    get: (id: string) => request<Company>(`/companies/${id}`),
    create: (data: { name: string; description?: string; category_id: string; location_id: string }) =>
      request<{ id: string; name: string; slug: string; message: string }>("/companies", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<{ name: string; description: string; category_id: string; location_id: string }>) =>
      request<{ id: string; name: string; message: string }>(`/companies/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
  reviews: {
    create: (companyId: string, data: {
      quality: number; service: number; price: number; reliability: number; experience: number;
    }, opts?: { mode?: "new" | "update" }) =>
      request<{ id: string; message: string; mode?: string }>(`/companies/${companyId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ company_id: companyId, ...data, mode: opts?.mode }),
      }),
    list: (companyId: string, skip = 0, limit = 20) =>
      request<PaginatedResponse<Review>>(`/companies/${companyId}/reviews?skip=${skip}&limit=${limit}`),
    myReviews: (skip = 0, limit = 20) =>
      request<PaginatedResponse<Review>>(`/users/me/reviews?skip=${skip}&limit=${limit}`),
    distribution: (companyId: string) =>
      request<DistributionData>(`/companies/${companyId}/reviews/distribution`),
    agree: (reviewId: string) =>
      request<{ agree_count: number; disagree_count: number }>(`/reviews/${reviewId}/agree`, {
        method: "POST",
      }),
    disagree: (reviewId: string) =>
      request<{ agree_count: number; disagree_count: number }>(`/reviews/${reviewId}/disagree`, {
        method: "POST",
      }),
    voteStats: (reviewId: string) =>
      request<{ agree_count: number; disagree_count: number; user_vote: boolean | null }>(`/reviews/${reviewId}/stats`),
    comments: {
      list: (reviewId: string, skip = 0, limit = 20) =>
        request<PaginatedResponse<ReviewComment>>(`/reviews/${reviewId}/comments?skip=${skip}&limit=${limit}`),
      add: (reviewId: string, content: string) =>
        request<ReviewComment>(`/reviews/${reviewId}/comments`, {
          method: "POST",
          body: JSON.stringify({ content }),
        }),
    },
  },
  feed: {
    get: (limit = 20) =>
      request<FeedData>(`/feed?limit=${limit}`),
  },
  battles: {
    active: () =>
      request<BattleData | null>("/battles/active"),
    vote: (companyAId: string, companyBId: string, votedFor: string) =>
      request<{ votes_a: number; votes_b: number; total_votes: number; user_vote: string }>("/battles/vote", {
        method: "POST",
        body: JSON.stringify({ company_a_id: companyAId, company_b_id: companyBId, voted_for: votedFor }),
      }),
  },
  waves: {
    active: () =>
      request<WaveData | null>("/waves/active"),
  },
  gamification: {
    me: () =>
      request<UserXP>("/gamification/me"),
    leaderboard: (limit = 10) =>
      request<{ items: LeaderboardEntry[] }>(`/gamification/leaderboard?limit=${limit}`),
    challenges: () =>
      request<{ items: Challenge[] }>("/gamification/challenges"),
  },
  notifications: {
    list: () =>
      request<{ items: Notification[] }>("/notifications"),
    count: () =>
      request<{ count: number }>("/notifications/count"),
    markRead: (id: string) =>
      request<{ id: string; is_read: boolean }>(`/notifications/${id}/read`, { method: "PUT" }),
    markAllRead: () =>
      request<{ message: string }>("/notifications/read-all", { method: "PUT" }),
  },
  score: {
    get: (companyId: string) => request<any>(`/companies/${companyId}/score`),
    history: (companyId: string) =>
      request<{ items: ScoreHistory[] }>(`/companies/${companyId}/history`),
  },
  rankings: {
    top: (params?: { category_id?: string; location_id?: string; limit?: number }) => {
      const sp = new URLSearchParams();
      if (params?.category_id) sp.set("category_id", params.category_id);
      if (params?.location_id) sp.set("location_id", params.location_id);
      if (params?.limit) sp.set("limit", String(params.limit));
      return request<{ items: RankingItem[] }>(`/rankings/top?${sp}`);
    },
    trending: (params?: { category_id?: string; location_id?: string; limit?: number }) => {
      const sp = new URLSearchParams();
      if (params?.category_id) sp.set("category_id", params.category_id);
      if (params?.location_id) sp.set("location_id", params.location_id);
      if (params?.limit) sp.set("limit", String(params.limit));
      return request<{ items: RankingItem[] }>(`/rankings/trending?${sp}`);
    },
    mostRated: (params?: { category_id?: string; location_id?: string; limit?: number }) => {
      const sp = new URLSearchParams();
      if (params?.category_id) sp.set("category_id", params.category_id);
      if (params?.location_id) sp.set("location_id", params.location_id);
      if (params?.limit) sp.set("limit", String(params.limit));
      return request<{ items: RankingItem[] }>(`/rankings/most-rated?${sp}`);
    },
    rising: (params?: { category_id?: string; location_id?: string; limit?: number }) => {
      const sp = new URLSearchParams();
      if (params?.category_id) sp.set("category_id", params.category_id);
      if (params?.location_id) sp.set("location_id", params.location_id);
      if (params?.limit) sp.set("limit", String(params.limit));
      return request<{ items: RankingItem[] }>(`/rankings/rising?${sp}`);
    },
    declining: (params?: { category_id?: string; location_id?: string; limit?: number }) => {
      const sp = new URLSearchParams();
      if (params?.category_id) sp.set("category_id", params.category_id);
      if (params?.location_id) sp.set("location_id", params.location_id);
      if (params?.limit) sp.set("limit", String(params.limit));
      return request<{ items: RankingItem[] }>(`/rankings/declining?${sp}`);
    },
  },
  categories: {
    list: () => request<{ items: Category[] }>("/categories"),
    get: (id: string) => request<Category>(`/categories/${id}`),
  },
  locations: {
    list: () => request<{ items: Location[] }>("/locations"),
  },
  reports: {
    create: (data: { review_id: string; company_id: string; reason: string; description?: string }) =>
      request<{ id: string; message: string }>("/reports", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  admin: {
    stats: () => request<any>("/admin/stats"),
    users: (skip = 0, limit = 20) =>
      request<PaginatedResponse<any>>(`/admin/users?skip=${skip}&limit=${limit}`),
    toggleUserActive: (userId: string) =>
      request<{ id: string; is_active: boolean }>(`/admin/users/${userId}/toggle-active`, { method: "PUT" }),
    reports: (status?: string, skip = 0, limit = 20) => {
      const sp = new URLSearchParams({ skip: String(skip), limit: String(limit) });
      if (status) sp.set("status", status);
      return request<PaginatedResponse<any>>(`/admin/reports?${sp}`);
    },
    invalidateReview: (reviewId: string) =>
      request<{ id: string; is_valid: boolean }>(`/admin/reviews/${reviewId}/invalidate`, { method: "PUT" }),
    restoreReview: (reviewId: string) =>
      request<{ id: string; is_valid: boolean }>(`/admin/reviews/${reviewId}/restore`, { method: "PUT" }),
    resolveReport: (reportId: string) =>
      request<{ id: string; status: string }>(`/admin/reports/${reportId}/resolve`, { method: "PUT" }),
  },
};
