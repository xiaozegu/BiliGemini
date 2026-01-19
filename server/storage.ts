import { db } from "./db";
import { analysis, type Analysis, type InsertAnalysis } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalyses(sessionId: string): Promise<Analysis[]>;
}

export class DatabaseStorage implements IStorage {
  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const [result] = await db
      .insert(analysis)
      .values(insertAnalysis)
      .returning();
    return result;
  }

  async getAnalyses(sessionId: string): Promise<Analysis[]> {
    return db
      .select()
      .from(analysis)
      .where(eq(analysis.sessionId, sessionId))
      .orderBy(desc(analysis.createdAt));
  }
}

export const storage = new DatabaseStorage();
