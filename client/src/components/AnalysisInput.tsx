import { useState } from "react";
import { useAnalyzeVideo } from "@/hooks/use-analysis";
import { ArrowRight, Loader2, Video, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onSuccess: () => void;
}

export function AnalysisInput({ onSuccess }: Props) {
  const [url, setUrl] = useState("");
  const { mutate: analyze, isPending } = useAnalyzeVideo();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!url.includes("bilibili.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Bilibili video URL.",
        variant: "destructive",
      });
      return;
    }

    analyze({ url }, {
      onSuccess: () => {
        setUrl("");
        toast({
          title: "Analysis Complete",
          description: "Video has been successfully analyzed by Gemini 3.0 Pro.",
        });
        onSuccess();
      },
      onError: (error) => {
        toast({
          title: "Analysis Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 relative z-10">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Gemini 3.0 Pro</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground mb-6">
            Summarize Bilibili Videos <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              in Seconds
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get instant, AI-powered summaries and transcripts from any Bilibili video. 
            Save time and extract key insights effortlessly.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-white p-2 rounded-2xl shadow-xl shadow-primary/5 border border-border">
            <div className="pl-4 text-muted-foreground">
              <Video className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Bilibili video URL here..."
              className="flex-1 bg-transparent border-none px-4 py-4 text-lg focus:ring-0 placeholder:text-muted-foreground/50 text-foreground"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending || !url}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-center"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 text-center text-sm text-muted-foreground overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                <span>Fetching transcript and generating summary... this may take up to 30 seconds.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
