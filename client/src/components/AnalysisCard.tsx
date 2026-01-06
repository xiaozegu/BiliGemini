import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, FileText, Sparkles, Video, ExternalLink } from "lucide-react";
import { useState } from "react";
import { type Analysis } from "@shared/schema";
import { Button } from "./ui/button";

interface AnalysisCardProps {
  analysis: Analysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      {/* Header Section */}
      <div className="p-6 md:p-8 border-b border-border/50 bg-gradient-to-br from-card to-secondary/30">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <Video className="w-4 h-4" />
              <span>Bilibili 视频</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight font-display">
              {analysis.title}
            </h3>
            <a 
              href={analysis.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {analysis.url}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full whitespace-nowrap">
            {analysis.createdAt ? format(new Date(analysis.createdAt), "yyyy-MM-dd HH:mm") : "Unknown Date"}
          </div>
        </div>
      </div>

      {/* Gemini Thoughts Section */}
      <div className="p-6 md:p-8 bg-background">
        <div className="flex items-center gap-2 mb-6 text-primary">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold font-display">Gemini 的深度思考</h4>
        </div>
        
        <div className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-strong:text-foreground prose-strong:font-semibold
          prose-li:text-muted-foreground
          prose-code:bg-muted prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
        ">
          <ReactMarkdown>{analysis.summary}</ReactMarkdown>
        </div>
      </div>

      {/* Collapsible Transcript Section */}
      {analysis.originalContent && (
        <div className="border-t border-border/50 bg-muted/30">
          <button
            onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
            className="w-full flex items-center justify-between p-4 px-8 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>查看原始字幕内容</span>
            </div>
            {isTranscriptOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {isTranscriptOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-8 pt-0">
                  <div className="bg-background rounded-xl p-4 border border-border text-sm text-muted-foreground font-mono leading-relaxed max-h-96 overflow-y-auto scrollbar-thin whitespace-pre-wrap">
                    {analysis.originalContent}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
