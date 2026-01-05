import { db } from "./db";
import { analysis, type Analysis, type InsertAnalysis } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalyses(): Promise<Analysis[]>;
}

export class DatabaseStorage implements IStorage {
  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const [result] = await db
      .insert(analysis)
      .values(insertAnalysis)
      .returning();
    return result;
  }

  async getAnalyses(): Promise<Analysis[]> {
    return db
      .select()
      .from(analysis)
      .orderBy(desc(analysis.createdAt));
  }
}

export const storage = new DatabaseStorage();
