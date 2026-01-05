import { formatDistanceToNow } from "date-fns";
import { FileText, Clock, ExternalLink } from "lucide-react";
import { type Analysis } from "@shared/schema";
import { motion } from "framer-motion";

interface Props {
  analysis: Analysis;
  onClick: () => void;
}

export function AnalysisCard({ analysis, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>

      <div className="flex-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-3">
          <span className="bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
             <FileText className="w-3 h-3" />
             AI Summary
          </span>
        </div>
        
        <h3 className="text-lg font-bold font-display text-foreground leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {analysis.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {analysis.summary.replace(/[#*`]/g, '')}
        </p>
      </div>

      <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground mt-2">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDistanceToNow(new Date(analysis.createdAt || Date.now()), { addSuffix: true })}</span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary font-medium">
          View Details
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
}
