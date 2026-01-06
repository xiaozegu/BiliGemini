import { useState } from "react";
import { useAnalyzeVideo, useAnalyses } from "@/hooks/use-analyze";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalysisCard } from "@/components/AnalysisCard";
import { Loader2, Sparkles, History, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const { mutate: analyze, isPending } = useAnalyzeVideo();
  const { data: analyses, isLoading: isLoadingHistory } = useAnalyses();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Optimistic reset or handle via onSuccess if preferred
    analyze({ url }, {
      onSuccess: () => setUrl("") 
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Hero Section */}
      <div className="bg-background border-b border-border/40 pb-12 pt-16 md:pt-24 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Google Gemini 3.0 Pro</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground font-display mb-4">
              Bilibili 视频 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600">AI 深度解析</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              一键提取视频字幕，让 AI 为您提炼核心观点与深度思考。
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto mt-8 bg-card p-2 rounded-2xl shadow-xl shadow-black/5 border border-border/50"
          >
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
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
              variant="gradient"
              disabled={isPending || !url}
              className="md:w-auto w-full rounded-xl"
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
          </motion.form>
          
          {isPending && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground animate-pulse"
            >
              正在获取视频字幕并请求 Gemini 3.0 进行分析，请稍候...
            </motion.p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-8 text-foreground/80">
          <History className="w-5 h-5" />
          <h2 className="text-xl font-bold font-display">分析历史</h2>
        </div>

        {isLoadingHistory ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-card rounded-3xl animate-pulse border border-border/50" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {analyses && analyses.length > 0 ? (
              analyses.map((analysis) => (
                <motion.div key={analysis.id} variants={item}>
                  <AnalysisCard analysis={analysis} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                variants={item}
                className="text-center py-20 bg-card rounded-3xl border border-dashed border-border"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                  <History className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">暂无分析记录</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  快去复制一个 Bilibili 视频链接，体验 AI 的深度解读能力吧！
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
