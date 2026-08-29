# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**KimScript** is an AI-powered web application that analyzes viral social media videos and generates custom marketing scripts. The platform allows users to paste video URLs (TikTok, Instagram Reels, YouTube Shorts), transcribes the audio using OpenAI Whisper, analyzes the content for viral mechanics, and generates tailored scripts based on user's brand/product information.

## Architecture Overview

This is a full-stack TypeScript application with the following architecture:

### Monorepo Structure
- **`client/`** - React frontend with Vite build system
- **`server/`** - Express.js backend API server  
- **`shared/`** - Shared TypeScript types and database schema
- **`migrations/`** - Drizzle ORM database migrations

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Wouter (routing) + Framer Motion + Radix UI
- **Backend**: Express.js + TypeScript + Drizzle ORM + PostgreSQL
- **AI Services**: OpenAI GPT-3.5-turbo + Whisper API
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Drizzle ORM
- **Build System**: Vite (frontend) + tsx (backend)
- **Deployment**: Docker + Railway/Render

### Key Frontend Components
- **Landing Page**: High-conversion landing page with hero section, features, demo
- **Authentication**: Login/signup with Supabase
- **Analysis Form**: URL input and brand information collection
- **Results Display**: Video analysis and generated script presentation
- **Dashboard**: User's script history and analytics
- **Analytics Dashboard**: Performance metrics and user behavior insights

### Key Backend Services
- **Video Processor** (`videoProcessor.ts`): Handles video URL validation, content extraction, and transcription
- **OpenAI Service** (`openai.ts`): Manages AI analysis and script generation with expert prompting
- **Cache System** (`cache.ts`): Implements video content caching to optimize costs
- **Analytics Engine**: Tracks user behavior, performance metrics, and viral prediction scores

### Database Schema
The application uses a comprehensive analytics-focused schema:
- **Users & Sessions**: Authentication and user management
- **Scripts**: Core video analysis and generated script storage with viral scoring
- **Analytics Events**: Detailed user interaction tracking
- **Performance Metrics**: AI accuracy and system performance monitoring  
- **Daily Analytics**: Aggregated metrics for reporting
- **User Behavior Analytics**: Individual user pattern analysis

## Common Development Commands

### Development
```powershell
npm run dev          # Start development server (client + server)
npm run build        # Build client for production
npm run start        # Start production server
npm run check        # TypeScript type checking
```

### Database
```powershell
npm run db:push      # Push schema changes to database
npx drizzle-kit generate  # Generate new migration
npx drizzle-kit migrate   # Run pending migrations
```

### Testing & Analysis
```powershell
node test-real-analysis.js        # Test video analysis with real URLs
node test-complete-analysis.js    # Complete analysis workflow test
node verify-real-analysis.js      # Verify analysis accuracy
node demo-real-analysis.js        # Demo analysis functionality
```

### Deployment
```powershell
docker build -t kimscript .       # Build Docker image
docker run -p 5000:5000 kimscript # Run containerized app
```

## Environment Configuration

Required environment variables:
```
NODE_ENV=development|production
PORT=5000
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## AI Integration Details

### Video Processing Pipeline
1. **URL Validation**: Supports TikTok, Instagram, YouTube URLs
2. **Content Extraction**: Uses yt-dlp for video/audio extraction  
3. **Transcription**: OpenAI Whisper API with Spanish language optimization
4. **Analysis**: GPT-3.5-turbo with expert viral content analysis prompts
5. **Script Generation**: Custom script creation based on user's brand/product

### AI Prompting Strategy
The OpenAI service uses sophisticated prompts designed by marketing experts:
- **Viral Analysis**: Neurociencia del engagement, psychological triggers, hook identification
- **Framework Detection**: AIDA, PAS, Hook-Story-CTA, storytelling structures  
- **Performance Prediction**: Viral potential scoring, engagement rate estimation
- **Script Adaptation**: Brand-specific tone and message adaptation

## Development Patterns

### Frontend Patterns
- **Component Architecture**: Radix UI components with shadcn/ui styling system
- **State Management**: React Query for server state, React Context for client state
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system (Electric Blue #00CFFF, Deep Violet #7A00FF)
- **Animations**: Framer Motion for smooth transitions and micro-interactions

### Backend Patterns
- **Route Organization**: Centralized route registration in `routes.ts`
- **Error Handling**: Global error middleware with structured error responses
- **Caching Strategy**: File-based caching for video content to reduce API costs
- **Concurrency Management**: Limited concurrent video processing (max 3)
- **CORS Configuration**: Multi-domain support for various deployment environments

### Database Patterns
- **Schema-First**: Drizzle ORM with centralized schema definition
- **Analytics-Heavy**: Extensive event tracking and performance metrics
- **Indexing Strategy**: Optimized indexes for analytics queries
- **Type Safety**: Full TypeScript integration with runtime validation

## Key Configuration Files

- **`vite.config.ts`**: Frontend build configuration with path aliases
- **`tsconfig.json`**: TypeScript configuration covering client/server/shared
- **`drizzle.config.ts`**: Database ORM configuration
- **`tailwind.config.ts`**: Design system and component styling
- **`Dockerfile`**: Multi-stage build with video processing dependencies
- **`render.yaml`**: Deployment configuration for Render platform

## Deployment Architecture

### Docker Container
- **Base**: Node.js 20 Alpine for minimal footprint
- **Dependencies**: FFmpeg, yt-dlp for video processing
- **Health Checks**: `/api/health` endpoint monitoring
- **Port**: 5000 (configurable via PORT env var)

### Production Considerations
- **Video Processing**: Requires FFmpeg and yt-dlp system dependencies
- **OpenAI API**: Cost-optimized with GPT-3.5-turbo and caching
- **Database**: PostgreSQL with connection pooling
- **Static Assets**: Client build served via Express in production
- **CORS**: Configured for multiple domains including Vercel deployments

## Analytics & Monitoring

The application implements comprehensive analytics:
- **User Behavior Tracking**: Page views, analysis requests, script generations
- **Performance Metrics**: AI processing times, accuracy scores, user satisfaction
- **Viral Prediction**: ML-based scoring for content viral potential
- **Business Intelligence**: Daily aggregated metrics for growth tracking

## Development Tips

- Use the diagnostic endpoints (`/api/diagnostic`, `/api/diagnostic/video`) for system health monitoring
- Video processing is CPU/memory intensive - test with realistic concurrency limits
- The AI prompts are highly tuned - preserve the expert knowledge in modifications
- Caching is critical for cost management - ensure cache invalidation strategies are maintained
- Database indexes are optimized for analytics queries - review before schema changes