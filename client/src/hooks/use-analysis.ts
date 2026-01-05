import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type AnalyzeInput, type AnalyzeResponse } from "@shared/routes";

// GET /api/analyze - List all past analyses
export function useAnalyses() {
  return useQuery({
    queryKey: [api.analyze.list.path],
    queryFn: async () => {
      const res = await fetch(api.analyze.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analyses");
      return api.analyze.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/analyze - Create a new analysis
export function useAnalyzeVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AnalyzeInput) => {
      // Validate input before sending
      const validated = api.analyze.process.input.parse(data);
      
      const res = await fetch(api.analyze.process.path, {
        method: api.analyze.process.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        // Try to parse error message if available
        try {
          const errorData = await res.json();
          if (res.status === 400) {
            const parsedError = api.analyze.process.responses[400].parse(errorData);
            throw new Error(parsedError.message || "Invalid request");
          }
          if (res.status === 500) {
            const parsedError = api.analyze.process.responses[500].parse(errorData);
            throw new Error(parsedError.message || "Server error");
          }
        } catch (e) {
          // Fallback if parsing fails
          if (e instanceof Error && e.message !== "Invalid request" && e.message !== "Server error") {
             throw e; // Rethrow specific errors
          }
        }
        throw new Error("Failed to analyze video. Please check the URL and try again.");
      }

      return api.analyze.process.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate the list so the new item shows up immediately
      queryClient.invalidateQueries({ queryKey: [api.analyze.list.path] });
    },
  });
}
