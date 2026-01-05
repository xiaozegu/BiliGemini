import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analysis = pgTable("analysis", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  originalContent: text("original_content"), // The transcript
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analysis).omit({ 
  id: true, 
  createdAt: true 
});

export type Analysis = typeof analysis.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

// Request/Response types for the API
export const analyzeRequestSchema = z.object({
  url: z.string().url().min(1, "URL is required"),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
