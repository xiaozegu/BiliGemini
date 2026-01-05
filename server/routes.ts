import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

async function getBilibiliInfo(url: string) {
  // Extract BVID
  const bvidMatch = url.match(/(BV[a-zA-Z0-9]+)/);
  if (!bvidMatch) {
    throw new Error("Invalid Bilibili URL. Could not find BV ID.");
  }
  const bvid = bvidMatch[1];

  // Get Video Info (CID)
  const viewRes = await axios.get(`https://api.bilibili.com/x/web-interface/view`, {
    params: { bvid }
  });

  if (viewRes.data.code !== 0) {
    throw new Error(`Failed to fetch video info: ${viewRes.data.message}`);
  }

  const cid = viewRes.data.data.cid;
  const title = viewRes.data.data.title;
  const desc = viewRes.data.data.desc;

  // Get Subtitles
  const playerRes = await axios.get(`https://api.bilibili.com/x/player/v2`, {
    params: { bvid, cid }
  });

  let transcript = "";
  if (playerRes.data.data.subtitle && playerRes.data.data.subtitle.subtitles && playerRes.data.data.subtitle.subtitles.length > 0) {
    // Prefer English or Chinese, but just take the first one for now
    const subUrl = "https:" + playerRes.data.data.subtitle.subtitles[0].url;
    const subContentRes = await axios.get(subUrl);
    
    // Parse BCC (JSON format)
    const body = subContentRes.data.body;
    if (Array.isArray(body)) {
      transcript = body.map((item: any) => item.content).join("\n");
    }
  }

  // Fallback to description if no transcript
  if (!transcript) {
    transcript = `No subtitles found. Description: ${desc}`;
  }

  return { title, transcript };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.analyze.process.path, async (req, res) => {
    try {
      const { url } = api.analyze.process.input.parse(req.body);
      
      console.log(`Analyzing URL: ${url}`);
      const { title, transcript } = await getBilibiliInfo(url);
      console.log(`Fetched video: ${title}, transcript length: ${transcript.length}`);

      // Generate Summary with Gemini
      const prompt = `
        You are an intelligent assistant.
        Video Title: ${title}
        Transcript/Content:
        ${transcript.substring(0, 30000)} // Truncate to avoid huge context if needed, though Gemini 3 Pro has large context.

        Please provide a comprehensive summary of this video in Markdown format. 
        Focus on the key points and takeaways.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const summary = response.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate summary.";

      const result = await storage.createAnalysis({
        url,
        title,
        summary,
        originalContent: transcript,
      });

      res.json(result);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  });

  app.get(api.analyze.list.path, async (req, res) => {
    const results = await storage.getAnalyses();
    res.json(results);
  });

  return httpServer;
}
