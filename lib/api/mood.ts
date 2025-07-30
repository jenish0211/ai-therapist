interface MoodEntry {
  score: number;
  note?: string;
}

interface MoodHistoryItem {
  _id: string;
  score: number;
  note?: string;
  timestamp: string;
}

interface MoodStats {
  average: number;
  count: number;
  highest: number;
  lowest: number;
  history: MoodHistoryItem[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function trackMood(
  data: MoodEntry
): Promise<ApiResponse<MoodHistoryItem>> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch("/api/mood", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to track mood");
  }

  return response.json();
}

export async function getMoodHistory(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<ApiResponse<MoodHistoryItem[]>> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const response = await fetch(`/api/mood/history?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch mood history");
  }

  return response.json();
}

export async function getMoodStats(
  period: "week" | "month" | "year" = "week"
): Promise<ApiResponse<MoodStats>> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`/api/mood/stats?period=${period}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch mood statistics");
  }

  return response.json();
}
