import { Header } from "@/components/Header";
import { AnalysisInput } from "@/components/AnalysisInput";
import { AnalysisCard } from "@/components/AnalysisCard";
import { AnalysisModal } from "@/components/AnalysisModal";
import { useAnalyses } from "@/hooks/use-analysis";
import { useState } from "react";
import { type Analysis } from "@shared/schema";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: analyses, isLoading, error, refetch } = useAnalyses();
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero & Input Section */}
        <AnalysisInput onSuccess={() => refetch()} />

        {/* Results Section */}
        <section className="max-w-7xl mx-auto mt-12 md:mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              Recent Analyses
              <span className="text-sm font-normal text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {analyses?.length || 0}
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Loading your library...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 text-center max-w-md mx-auto">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 text-destructive">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Unable to load analyses</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't fetch your history. Please check your connection and try again.
              </p>
              <button 
                onClick={() => refetch()}
                className="text-primary font-semibold hover:underline"
              >
                Try again
              </button>
            </div>
          ) : analyses?.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-white/30">
              <div className="max-w-sm mx-auto">
                <h3 className="text-lg font-bold text-foreground mb-2">No videos analyzed yet</h3>
                <p className="text-muted-foreground">
                  Paste a Bilibili URL above to generate your first AI summary.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses?.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <AnalysisCard 
                    analysis={analysis} 
                    onClick={() => setSelectedAnalysis(analysis)} 
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <AnalysisModal 
        analysis={selectedAnalysis} 
        open={!!selectedAnalysis} 
        onOpenChange={(open) => !open && setSelectedAnalysis(null)} 
      />
      
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/40 mt-12 bg-white/50">
        <p>© 2024 BiliMind. Powered by Gemini 3.0 Pro.</p>
      </footer>
    </div>
  );
}
