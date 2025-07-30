interface ActivityEntry {
  type: string;
  name: string;
  description?: string;
  duration?: number;
}

interface Activity {
  _id: string;
  type: string;
  name: string;
  description?: string;
  duration?: number;
  timestamp: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function logActivity(
  data: ActivityEntry
): Promise<ApiResponse<Activity>> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch("/api/activity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to log activity");
  }

  return response.json();
}
