import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="py-6 px-4 sm:px-8 border-b border-border/40 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-lg shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Bili<span className="text-primary">Mind</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">How it works</a>
          <a href="#" className="hover:text-primary transition-colors">About</a>
        </nav>
      </div>
    </header>
  );
}
