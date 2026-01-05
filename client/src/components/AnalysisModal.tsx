import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type Analysis } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ExternalLink, MessageSquareText, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Props {
  analysis: Analysis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnalysisModal({ analysis, open, onOpenChange }: Props) {
  const [copied, setCopied] = useState(false);

  if (!analysis) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 bg-white/95 backdrop-blur-xl border-none shadow-2xl overflow-hidden rounded-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border/40 flex items-start justify-between bg-white/50">
          <div className="pr-12">
            <h2 className="text-2xl font-display font-bold text-foreground leading-tight mb-2">
              {analysis.title}
            </h2>
            <a 
              href={analysis.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              View original video on Bilibili
            </a>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-black/5 text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-slate-50/50">
          <Tabs defaultValue="summary" className="h-full flex flex-col">
            <div className="px-6 pt-4 bg-white/50 border-b border-border/40">
              <TabsList className="bg-muted/50 p-1 rounded-xl">
                <TabsTrigger 
                  value="summary"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 font-medium"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  AI Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="transcript"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 font-medium"
                >
                  <MessageSquareText className="w-4 h-4 mr-2" />
                  Full Transcript
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="summary" className="flex-1 p-0 m-0 h-full overflow-hidden relative group">
              <div className="absolute top-4 right-6 z-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="bg-white/80 backdrop-blur hover:bg-white shadow-sm"
                >
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <ScrollArea className="h-full">
                <div className="p-6 max-w-3xl mx-auto">
                  <div className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-slate-600 prose-p:font-serif prose-p:leading-relaxed prose-li:text-slate-600">
                    <ReactMarkdown>{analysis.summary}</ReactMarkdown>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="transcript" className="flex-1 p-0 m-0 h-full overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6 max-w-3xl mx-auto">
                  <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-600 bg-white p-6 rounded-xl border border-border shadow-sm">
                    {analysis.originalContent || "No transcript available for this video."}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
