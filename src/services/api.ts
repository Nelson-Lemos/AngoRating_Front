import type {
  AdminReport,
  AdminStats,
  AdminUser,
  Category,
  Company,
  Contributor,
  DistributionData,
  FeedData,
  Location,
  Notification,
  PaginatedResponse,
  RankingBoard,
  RankingResponse,
  Review,
  ReviewComment,
  ScoreHistory,
  ScoreResponse,
  TokenResponse,
  User,
  UserProgress,
} from "../types";

const API_ORIGIN =
  import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "") ||
  (import.meta.env.DEV ? "" : "https://angorating-back.onrender.com");
const API_BASE = `${API_ORIGIN}/api/v1`;
const REQUEST_TIMEOUT_MS = 20_000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

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

function getErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === "object") {
    const body = payload as { detail?: unknown; message?: unknown };
    const detail = body.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (item && typeof item === "object" && "msg" in item) return String(item.msg);
          return String(item);
        })
        .join("; ");
    }
    if (typeof body.message === "string") return body.message;
  }
  if (status === 404) return "Recurso não encontrado.";
  if (status === 422) return "Os dados enviados são inválidos.";
  if (status >= 500) return "O servidor encontrou um erro. Tente novamente.";
  return `Falha na comunicação com a API (${status}).`;
}

async function readPayload(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function redirectToLogin() {
  if (window.location.pathname !== "/login") window.location.assign("/login");
}

async function request<T>(path: string, options: RequestInit = {}, allowRefresh = true): Promise<T> {
  const tokens = getTokens();
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body !== undefined && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (tokens.access && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${tokens.access}`);
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("A API demorou demasiado tempo a responder.", 0);
    }
    throw new ApiError("Não foi possível contactar a API.", 0, error);
  } finally {
    window.clearTimeout(timeout);
  }

  const payload = await readPayload(response);
  if (response.status === 401) {
    const isAuthRequest = path.startsWith("/auth/login") ||
      path.startsWith("/auth/register") || path.startsWith("/auth/refresh");
    if (allowRefresh && tokens.refresh && !isAuthRequest) {
      try {
        const refreshed = await request<TokenResponse>(
          "/auth/refresh",
          { method: "POST", body: JSON.stringify({ refresh_token: tokens.refresh }) },
          false,
        );
        setTokens(refreshed.access_token, refreshed.refresh_token);
        return request<T>(path, options, false);
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          clearTokens();
          redirectToLogin();
        }
        throw error;
      }
    }
    if (!isAuthRequest) {
      clearTokens();
      redirectToLogin();
    }
  }

  if (!response.ok) throw new ApiError(getErrorMessage(payload, response.status), response.status, payload);
  return payload as T;
}

function rankingQuery(params?: { category_id?: string; location_id?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.category_id) search.set("category_id", params.category_id);
  if (params?.location_id) search.set("location_id", params.location_id);
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  return search;
}

function getRanking(board: RankingBoard, params?: { category_id?: string; location_id?: string; limit?: number }) {
  const search = rankingQuery(params);
  search.set("board", board);
  return request<RankingResponse>(`/rankings?${search}`);
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      request<User>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<TokenResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    refresh: async (refreshToken: string) => {
      const tokens = await request<TokenResponse>(
        "/auth/refresh",
        { method: "POST", body: JSON.stringify({ refresh_token: refreshToken }) },
        false,
      );
      setTokens(tokens.access_token, tokens.refresh_token);
      return tokens;
    },
    me: () => request<User>("/auth/me"),
    saveTokens: setTokens,
    clearTokens,
  },
  companies: {
    list: (params?: { category_id?: string; location_id?: string; q?: string; skip?: number; limit?: number }) => {
      const search = new URLSearchParams();
      if (params?.category_id) search.set("category_id", params.category_id);
      if (params?.location_id) search.set("location_id", params.location_id);
      if (params?.q) search.set("q", params.q);
      if (params?.skip !== undefined) search.set("skip", String(params.skip));
      if (params?.limit !== undefined) search.set("limit", String(params.limit));
      return request<PaginatedResponse<Company>>(`/companies?${search}`);
    },
    get: (id: string) => request<Company>(`/companies/${id}`),
    create: (data: { name: string; description?: string; category_id: string; location_id: string }) =>
      request<{ id: string; name: string; slug: string; message: string }>("/companies", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<{ name: string; description: string; logo: string | null; category_id: string; location_id: string }>) =>
      request<{ id: string; name: string; message: string }>(`/companies/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
  reviews: {
    create: (companyId: string, data: {
      quality: number; service: number; price: number; reliability: number; experience: number;
    }, opts?: { mode?: "new" | "update" }) =>
      request<{ id: string; message: string; mode: string }>(`/companies/${companyId}/reviews`, {
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
      request<{ agree_count: number; disagree_count: number }>(`/reviews/${reviewId}/agree`, { method: "POST" }),
    disagree: (reviewId: string) =>
      request<{ agree_count: number; disagree_count: number }>(`/reviews/${reviewId}/disagree`, { method: "POST" }),
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
    get: (limit = 20, filters?: { category_id?: string; location_id?: string }) => {
      const search = new URLSearchParams({ limit: String(limit) });
      if (filters?.category_id) search.set("category_id", filters.category_id);
      if (filters?.location_id) search.set("location_id", filters.location_id);
      return request<FeedData>(`/feed?${search}`);
    },
    contributors: (limit = 10) => request<{ items: Contributor[] }>(`/contributors?limit=${limit}`),
    myProgress: () => request<UserProgress>("/me/progress"),
  },
  notifications: {
    list: () => request<{ items: Notification[] }>("/notifications"),
    count: () => request<{ count: number }>("/notifications/count"),
    markRead: (id: string) =>
      request<{ id: string; is_read: boolean }>(`/notifications/${id}/read`, { method: "PUT" }),
    markAllRead: () => request<{ message: string }>("/notifications/read-all", { method: "PUT" }),
  },
  score: {
    get: (companyId: string) => request<ScoreResponse>(`/companies/${companyId}/score`),
    history: (companyId: string) => request<{ items: ScoreHistory[] }>(`/companies/${companyId}/history`),
  },
  rankings: {
    boards: () => request<{ boards: { id: RankingBoard; label: string; note: string }[] }>("/rankings/boards"),
    get: getRanking,
    top: (params?: Parameters<typeof getRanking>[1]) => getRanking("rating", params),
    mostRated: (params?: Parameters<typeof getRanking>[1]) => getRanking("volume", params),
    recent: (params?: Parameters<typeof getRanking>[1]) => getRanking("recent", params),
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
    stats: () => request<AdminStats>("/admin/stats"),
    users: (skip = 0, limit = 20) =>
      request<PaginatedResponse<AdminUser>>(`/admin/users?skip=${skip}&limit=${limit}`),
    toggleUserActive: (userId: string) =>
      request<{ id: string; is_active: boolean }>(`/admin/users/${userId}/toggle-active`, { method: "PUT" }),
    reports: (status?: string, skip = 0, limit = 20) => {
      const search = new URLSearchParams({ skip: String(skip), limit: String(limit) });
      if (status) search.set("status", status);
      return request<PaginatedResponse<AdminReport>>(`/admin/reports?${search}`);
    },
    invalidateReview: (reviewId: string) =>
      request<{ id: string; is_valid: boolean }>(`/admin/reviews/${reviewId}/invalidate`, { method: "PUT" }),
    restoreReview: (reviewId: string) =>
      request<{ id: string; is_valid: boolean }>(`/admin/reviews/${reviewId}/restore`, { method: "PUT" }),
    resolveReport: (reportId: string) =>
      request<{ id: string; status: string }>(`/admin/reports/${reportId}/resolve`, { method: "PUT" }),
  },
};