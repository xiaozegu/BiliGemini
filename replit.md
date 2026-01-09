# BiliMind - Bilibili Video AI Analysis

## Overview

BiliMind is a web application that analyzes Bilibili videos using AI. Users paste a Bilibili video URL, the app extracts the video's subtitles/transcript via Bilibili's API, and then uses Google Gemini to generate a deep analysis and summary of the video content. Past analyses are stored in a PostgreSQL database for history viewing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for UI transitions
- **Markdown**: react-markdown for rendering AI-generated content
- **Build Tool**: Vite with path aliases (`@/` for client src, `@shared/` for shared code)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Pattern**: RESTful endpoints under `/api/`
- **AI Integration**: Google Gemini via `@google/genai` library using Replit's AI Integrations service
- **External APIs**: Bilibili API for fetching video info and subtitles

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` and `shared/models/chat.ts`
- **Migrations**: Drizzle Kit with `db:push` command
- **Main Tables**:
  - `analysis`: Stores video analyses (url, title, summary, original_content, createdAt)
  - `conversations` and `messages`: Chat functionality (for potential future use)

### API Structure
- `POST /api/analyze`: Submit a Bilibili URL for analysis
- `GET /api/analyze`: Retrieve all past analyses
- Additional routes available in `server/replit_integrations/` for chat, image generation, and batch processing

### Key Design Decisions
1. **Shared Schema**: Zod schemas defined in `shared/routes.ts` are used for both client-side validation and server-side type safety
2. **Monorepo Structure**: Client, server, and shared code coexist with TypeScript path aliases
3. **Replit AI Integrations**: Uses environment variables `AI_INTEGRATIONS_GEMINI_API_KEY` and `AI_INTEGRATIONS_GEMINI_BASE_URL` for Gemini access without requiring personal API keys

## External Dependencies

### AI Services
- **Google Gemini**: Accessed via Replit's AI Integrations service
  - Models: `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.5-flash-image`
  - Environment variables: `AI_INTEGRATIONS_GEMINI_API_KEY`, `AI_INTEGRATIONS_GEMINI_BASE_URL`

### External APIs
- **Bilibili API**: 
  - `api.bilibili.com/x/web-interface/view`: Fetch video metadata (title, description, CID)
  - `api.bilibili.com/x/player/v2`: Fetch subtitle/transcript data

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **Connection**: Uses `pg` Pool with Drizzle ORM

### Key NPM Packages
- `axios`: HTTP client for Bilibili API calls
- `drizzle-orm` + `drizzle-zod`: Database ORM and schema validation
- `@tanstack/react-query`: Client-side data fetching
- `react-markdown`: Rendering AI-generated markdown summaries
- `framer-motion`: Animations
- `date-fns`: Date formatting