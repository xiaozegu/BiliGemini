import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type AnalyzeInput, type AnalyzeResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

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

export function useAnalyzeVideo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AnalyzeInput) => {
      // Validate input before sending using the shared schema if needed,
      // but api.analyze.process.input.parse handles it on server too.
      
      const res = await fetch(api.analyze.process.path, {
        method: api.analyze.process.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.analyze.process.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 500) {
           const error = api.analyze.process.responses[500].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to analyze video");
      }

      return api.analyze.process.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.analyze.list.path] });
      toast({
        title: "分析完成",
        description: "Gemini 已成功生成视频思考内容。",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "分析失败",
        description: error.message || "请检查链接是否有效，或稍后重试。",
        variant: "destructive",
      });
    },
  });
}
