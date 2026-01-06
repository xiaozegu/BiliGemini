import { useState } from "react";
import { useAnalyzeVideo, useAnalyses } from "@/hooks/use-analyze";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalysisCard } from "@/components/AnalysisCard";
import { Loader2, Sparkles, History, Search } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const { mutate: analyze, isPending } = useAnalyzeVideo();
  const { data: analyses, isLoading: isLoadingHistory } = useAnalyses();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    analyze({ url }, {
      onSuccess: () => setUrl("") 
    });
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-20">
      <div className="bg-white border-b border-gray-200 pb-12 pt-16 md:pt-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Google Gemini 3.0 Pro</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
              Bilibili 视频 <span className="text-indigo-600">AI 深度解析</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              一键提取视频字幕，让 AI 为您提炼核心观点与深度思考。
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto mt-8 bg-white p-2 rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="粘贴 Bilibili 视频链接 (例如 https://www.bilibili.com/video/BV...)"
                className="pl-12 border-none bg-transparent shadow-none focus-visible:ring-0 h-12 md:h-14"
                disabled={isPending}
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              disabled={isPending || !url}
              className="md:w-auto w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在深度思考...
                </>
              ) : (
                "开始智能分析"
              )}
            </Button>
          </form>
          
          {isPending && (
            <p className="text-sm text-gray-500 animate-pulse">
              正在获取视频字幕并请求 Gemini 3.0 进行分析，请稍候...
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-8 text-gray-800">
          <History className="w-5 h-5" />
          <h2 className="text-xl font-bold">分析历史</h2>
        </div>

        {isLoadingHistory ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {analyses && analyses.length > 0 ? (
              analyses.map((analysis) => (
                <div key={analysis.id}>
                  <AnalysisCard analysis={analysis} />
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <History className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无分析记录</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  快去复制一个 Bilibili 视频链接，体验 AI 的深度解读能力吧！
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
