import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import session from "express-session";

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

  // Get Video Info (CID and AID)
  const viewRes = await axios.get(`https://api.bilibili.com/x/web-interface/view`, {
    params: { bvid }
  });

  if (viewRes.data.code !== 0) {
    throw new Error(`Failed to fetch video info: ${viewRes.data.message}`);
  }

  const cid = viewRes.data.data.cid;
  const aid = viewRes.data.data.aid;
  const title = viewRes.data.data.title;
  const desc = viewRes.data.data.desc;

  // Get Subtitles
  const playerRes = await axios.get(`https://api.bilibili.com/x/player/v2`, {
    params: { bvid, cid }
  });

  let transcript = "";
  if (playerRes.data.data.subtitle && playerRes.data.data.subtitle.subtitles && playerRes.data.data.subtitle.subtitles.length > 0) {
    const subUrl = "https:" + playerRes.data.data.subtitle.subtitles[0].url;
    const subContentRes = await axios.get(subUrl);
    
    const body = subContentRes.data.body;
    if (Array.isArray(body)) {
      transcript = body.map((item: any) => item.content).join("\n");
    }
  }

  if (!transcript) {
    transcript = `No subtitles found. Description: ${desc}`;
  }

  // Get Comments
  let comments = [];
  try {
    const replyRes = await axios.get(`https://api.bilibili.com/x/v2/reply`, {
      params: { oid: aid, type: 1, ps: 30, sort: 2 } // sort 2 is hot
    });
    if (replyRes.data.code === 0 && replyRes.data.data.replies) {
      comments = replyRes.data.data.replies.map((r: any) => r.content.message);
    }
  } catch (e) {
    console.error("Failed to fetch comments", e);
  }

  return { title, transcript, comments };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup session
  app.use(session({
    secret: process.env.SESSION_SECRET || "bili-mind-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
  }));

  app.post(api.analyze.process.path, async (req, res) => {
    try {
      const { url } = api.analyze.process.input.parse(req.body);
      const sessionId = req.sessionID;
      
      console.log(`Analyzing URL: ${url} for session: ${sessionId}`);
      const { title, transcript, comments } = await getBilibiliInfo(url);
      
      const commentsText = comments.length > 0 ? comments.join("\n") : "暂无评论";

      // Generate Thoughts/Analysis with Gemini
      const prompt = `
        你是一个智能助手，专注于深度视频分析和受众心理剖析。
        视频标题: ${title}
        
        视频字幕/内容:
        ${transcript.substring(0, 20000)}

        观众评论:
        ${commentsText.substring(0, 10000)}

        请阅读以上视频内容和观众评论，并提供以下分析：
        1. 深度分析：分享你对这个视频内容本身的看法、分析和见解。请不要仅仅总结视频内容，而是提供深入的点评和思考。
        2. 受众洞察 (Audience Insight)：
           - 比较视频传达的意图与受众的实际反应。
           - 突出观众正在争论或讨论的具体争议点。
           - 生成一段“元评论” (Meta-commentary)，总结受众的整体情绪和倾向。

        请用中文回答，并使用清晰的 Markdown 格式。
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro", // Using 1.5 Pro as requested/available
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const analysisResult = response.candidates?.[0]?.content?.parts?.[0]?.text || "无法生成分析。";

      // Simple split for now, or just store the whole thing if UI handles it. 
      // User asked to display "Audience Insight" below main summary.
      // We'll store the whole generated text in 'summary' and the UI can render it.
      
      const result = await storage.createAnalysis({
        url,
        title,
        summary: analysisResult,
        originalContent: transcript,
        sessionId,
      });

      res.json(result);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  });

  app.get(api.analyze.list.path, async (req, res) => {
    const sessionId = req.sessionID;
    const results = await storage.getAnalyses(sessionId);
    res.json(results);
  });

  return httpServer;
}
