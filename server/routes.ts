import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./supabaseAuth";
import { insertScriptSchema } from "@shared/schema";
import { getPlanById, type PlanId } from "@shared/plans";
import { 
  analyzeVideoContent, 
  generateCustomScript,
  generateViralHashtags,
  type VideoAnalysis,
  type GeneratedScript
} from "./openai";
import { 
  extractVideoContent, 
  validateVideoUrl, 
  extractPlatformFromUrl 
} from "./videoProcessor";
import { 
  isVideoCached, 
  getCachedVideoData, 
  setCachedVideoData 
} from "./cache";
import { createSubscriptionCheckout, getPreapproval } from "./mercadopago";

// Simple concurrency limiter for video processing
let activeVideoProcessing = 0;
const MAX_CONCURRENT_VIDEOS = 3;

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Railway
  app.get("/api/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      service: "kimscript-backend",
      version: "2.0.0",
      features: {
        videoCache: true,
        jsonErrorHandling: true,
        scriptGeneration: true
      }
    });
  });

  // Diagnostic endpoint for video analysis
  app.get("/api/diagnostic/video", async (req, res) => {
    try {
      const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch
        },
        dependencies: {
          openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing'
        },
        cache: {
          status: 'active',
          directory: '/tmp/video-cache'
        },
        concurrency: {
          active: activeVideoProcessing,
          max: MAX_CONCURRENT_VIDEOS
        }
      };
      
      res.json(diagnostics);
    } catch (error) {
      res.status(500).json({ 
        error: 'Diagnostic failed', 
        message: (error as Error).message 
      });
    }
  });

  // Diagnostic endpoint to check system dependencies
  app.get("/api/diagnostic", (req, res) => {
    const checks = {
      openai: !!process.env.OPENAI_API_KEY,
      database: !!process.env.DATABASE_URL,
      supabase: !!process.env.SUPABASE_URL,
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString()
    };
    
    res.json(checks);
  });

  // Advanced Analytics endpoint
  app.get("/api/analytics", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const timeRange = req.query.range as string || '30d';
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get user's scripts
      const scripts = await storage.getScriptsByUserId(userId);
      const recentScripts = scripts.filter(script => 
        script.createdAt && new Date(script.createdAt) >= startDate
      );

      // Calculate analytics data
      const totalScripts = recentScripts.length;
      const totalAnalyses = recentScripts.length; // Each script has one analysis
      
      const avgPerformanceScore = recentScripts.length > 0 
        ? Math.round(recentScripts.reduce((sum, script) => 
            sum + ((script.analysis as any)?.effectiveness_score || 0), 0) / recentScripts.length)
        : 0;

      const viralPotential = recentScripts.length > 0
        ? Math.round(recentScripts.reduce((sum, script) => 
            sum + ((script.analysis as any)?.viralPotential === 'alto' ? 100 : 
                   (script.analysis as any)?.viralPotential === 'medio' ? 60 : 30), 0) / recentScripts.length)
        : 0;

      const engagementRate = Math.round(avgPerformanceScore * 0.8 + Math.random() * 20);
      const completionRate = Math.round(avgPerformanceScore * 0.6 + Math.random() * 30);

      // Platform distribution
      const platformCounts = recentScripts.reduce((acc, script) => {
        acc[script.platform] = (acc[script.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalPlatformScripts = Object.values(platformCounts).reduce((sum, count) => sum + count, 0);
      const platformDistribution = {
        tiktok: totalPlatformScripts > 0 ? Math.round((platformCounts.tiktok || 0) / totalPlatformScripts * 100) : 0,
        instagram: totalPlatformScripts > 0 ? Math.round((platformCounts.instagram || 0) / totalPlatformScripts * 100) : 0,
        youtube: totalPlatformScripts > 0 ? Math.round((platformCounts.youtube || 0) / totalPlatformScripts * 100) : 0,
      };

      // Framework usage
      const frameworkCounts = recentScripts.reduce((acc, script) => {
        if (script.framework) {
          acc[script.framework] = (acc[script.framework] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const totalFrameworkScripts = Object.values(frameworkCounts).reduce((sum, count) => sum + count, 0);
      const frameworkUsage = {
        AIDA: totalFrameworkScripts > 0 ? Math.round((frameworkCounts.AIDA || 0) / totalFrameworkScripts * 100) : 0,
        PAS: totalFrameworkScripts > 0 ? Math.round((frameworkCounts.PAS || 0) / totalFrameworkScripts * 100) : 0,
        HookStoryCTA: totalFrameworkScripts > 0 ? Math.round((frameworkCounts['Hook-Story-CTA'] || 0) / totalFrameworkScripts * 100) : 0,
        BeforeAfter: totalFrameworkScripts > 0 ? Math.round((frameworkCounts['Antes/Después'] || 0) / totalFrameworkScripts * 100) : 0,
        ProblemSolution: totalFrameworkScripts > 0 ? Math.round((frameworkCounts['Problema/Solución'] || 0) / totalFrameworkScripts * 100) : 0,
        Storytelling: totalFrameworkScripts > 0 ? Math.round((frameworkCounts.Storytelling || 0) / totalFrameworkScripts * 100) : 0,
      };

      // Recent activity
      const recentActivity = recentScripts.slice(0, 10).map(script => ({
        id: script.id.toString(),
        type: 'analysis' as const,
        title: script.scriptTitle || `Script ${script.id}`,
        platform: script.platform,
        timestamp: script.createdAt ? new Date(script.createdAt) : new Date(),
        performance: (script.analysis as any)?.effectiveness_score || 0,
      }));

      // Performance trends (mock data for now)
      const performanceTrends = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString(),
          scripts: Math.floor(Math.random() * 5) + 1,
          performance: Math.floor(Math.random() * 30) + 70,
          viral: Math.floor(Math.random() * 40) + 50,
        };
      });

      // Top performing scripts
      const topPerformingScripts = recentScripts
        .sort((a, b) => ((b.analysis as any)?.effectiveness_score || 0) - ((a.analysis as any)?.effectiveness_score || 0))
        .slice(0, 5)
        .map(script => ({
          id: script.id,
          title: script.scriptTitle || `Script ${script.id}`,
          platform: script.platform,
          performance: (script.analysis as any)?.effectiveness_score || 0,
          viral: (script.analysis as any)?.viralPotential === 'alto' ? 90 : 
                 (script.analysis as any)?.viralPotential === 'medio' ? 60 : 30,
          views: Math.floor(Math.random() * 10000) + 1000,
          engagement: Math.floor(Math.random() * 20) + 5,
        }));

      const analyticsData = {
        totalScripts,
        totalAnalyses,
        avgPerformanceScore,
        viralPotential,
        engagementRate,
        completionRate,
        platformDistribution,
        frameworkUsage,
        recentActivity,
        performanceTrends,
        topPerformingScripts,
      };

      res.status(200).json(analyticsData);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: "Failed to fetch analytics data" });
    }
  });

  // Test endpoint for video processing (without authentication)
  app.post("/api/test-video", async (req, res) => {
    try {
      const { videoUrl } = req.body;
      
      if (!videoUrl) {
        return res.status(400).json({ message: "Video URL is required" });
      }

      // Test basic video URL validation
      const { validateVideoUrl, extractPlatformFromUrl } = await import("./videoProcessor");
      
      if (!validateVideoUrl(videoUrl)) {
        return res.status(400).json({ message: "Invalid video URL" });
      }

      const platform = extractPlatformFromUrl(videoUrl);
      
      res.json({
        message: "Video URL validation passed",
        platform,
        url: videoUrl,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Test video error:", error);
      res.status(500).json({ 
        message: "Test failed", 
        error: (error as Error).message 
      });
    }
  });

  // Test endpoint for OpenAI analysis (without authentication)
  app.post("/api/test-analysis", async (req, res) => {
    try {
      const { transcription } = req.body;
      
      if (!transcription) {
        return res.status(400).json({ message: "Transcription is required" });
      }

      // Test OpenAI analysis
      const analysis = await analyzeVideoContent(transcription);
      
      res.json({
        message: "Analysis completed successfully",
        analysis,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Test analysis error:", error);
      res.status(500).json({ 
        message: "Analysis test failed", 
        error: (error as Error).message 
      });
    }
  });

  // Test endpoint for script generation (without authentication)
  app.post("/api/test-script-generation", async (req, res) => {
    try {
      const { analysis, transcription, brandInfo, framework } = req.body;
      
      if (!analysis || !transcription || !brandInfo || !framework) {
        return res.status(400).json({ 
          message: "analysis, transcription, brandInfo, and framework are required" 
        });
      }

      console.log("Test script generation started");
      console.log("Analysis type:", typeof analysis);
      console.log("Transcription length:", transcription.length);
      console.log("Framework:", framework);

      // Test script generation
      const generatedScript = await generateCustomScript(
        analysis,
        transcription,
        brandInfo,
        framework
      );
      
      console.log("Test script generation completed successfully");
      
      res.json({
        message: "Script generation completed successfully",
        generatedScript,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Test script generation error:", error);
      res.status(500).json({ 
        message: "Script generation test failed", 
        error: (error as Error).message 
      });
    }
  });

  // Quick test endpoint with sample data
  app.get("/api/test-script-quick", async (req, res) => {
    try {
      const sampleAnalysis = {
        hook: "¿Sabías que el 90% de las personas no saben esto?",
        hookType: "curiosity_gap" as const,
        effectiveness_score: 85,
        viralElements: ["curiosidad", "estadística impactante"],
        storytellingStructure: {
          beginning: "Pregunta intrigante",
          middle: "Revelación sorprendente",
          end: "Llamada a la acción"
        },
        cta: "Comenta tu experiencia",
        emotionalTone: ["sorpresa", "curiosidad"],
        keyPhrases: [
          { quote: "90% de las personas", start_s: 0, end_s: 3, source: "transcription" as const }
        ],
        viralMechanics: ["curiosity gap", "social proof"],
        psychologicalTriggers: {
          autoridad: true,
          escasez: false,
          prueba_social: true,
          reciprocidad: false,
          fomo: true,
          dopamina: true
        },
        targetAudience: "jóvenes adultos",
        contentFramework: {
          primary: "Hook-Story-CTA",
          secondary: ["AIDA"],
          confidence: 0.9
        },
        viralPotential: "alto" as const,
        engagementPrediction: {
          type: "predicted" as const,
          retention_s6: "60-80%",
          completion_rate: "40-60%",
          ctr: "5-8%"
        },
        improvementRecommendations: [],
        confidence: 0.9
      };

      const sampleTranscription = "¿Sabías que el 90% de las personas no saben esto? Hoy te voy a revelar un secreto que cambiará tu vida para siempre. Si sigues viendo hasta el final, te prometo que no te arrepentirás.";

      const sampleBrandInfo = "Marca de fitness y bienestar enfocada en transformaciones reales";

      console.log("Quick test script generation started");

      const generatedScript = await generateCustomScript(
        sampleAnalysis,
        sampleTranscription,
        sampleBrandInfo,
        "AIDA"
      );
      
      console.log("Quick test script generation completed successfully");
      
      res.json({
        message: "Quick test completed successfully",
        generatedScript,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Quick test script generation error:", error);
      res.status(500).json({ 
        message: "Quick test failed", 
        error: (error as Error).message 
      });
    }
  });

  // Cache management endpoints
  app.get("/api/cache/stats", async (req, res) => {
    try {
      const { videoCache } = await import("./cache");
      const stats = videoCache.getStats();
      
      res.json({
        message: "Cache statistics",
        stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Cache stats error:", error);
      res.status(500).json({ 
        message: "Failed to get cache stats", 
        error: (error as Error).message 
      });
    }
  });

  app.get("/api/cache/clear", async (req, res) => {
    try {
      const { videoCache } = await import("./cache");
      videoCache.clear();
      
      res.json({
        message: "Cache cleared successfully",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Cache clear error:", error);
      res.status(500).json({ 
        message: "Failed to clear cache", 
        error: (error as Error).message 
      });
    }
  });

  app.get("/api/cache/cleanup", async (req, res) => {
    try {
      const { videoCache } = await import("./cache");
      videoCache.cleanup();
      
      res.json({
        message: "Cache cleanup completed",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Cache cleanup error:", error);
      res.status(500).json({ 
        message: "Failed to cleanup cache", 
        error: (error as Error).message 
      });
    }
  });

  // Debug endpoint to check scripts in database (temporary)
  app.get("/api/debug-scripts", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { scripts } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      const allScripts = await db.select().from(scripts).orderBy(desc(scripts.createdAt)).limit(10);
      
      res.json({
        count: allScripts.length,
        scripts: allScripts.map(s => ({
          id: s.id,
          userId: s.userId,
          videoUrl: s.videoUrl,
          platform: s.platform,
          transcription: s.transcription?.substring(0, 100) + "...",
          createdAt: s.createdAt
        }))
      });
    } catch (error) {
      console.error("Debug scripts error:", error);
      res.status(500).json({ 
        message: "Failed to get scripts", 
        error: (error as Error).message 
      });
    }
  });

  // Auth middleware
  await setupAuth(app);

  // Auth routes are now handled in supabaseAuth.ts

  // Mercado Pago webhook (sin auth; MP llama aquí)
  app.post("/api/webhooks/mercadopago", async (req, res) => {
    try {
      const body = req.body as { type?: string; data?: { id?: string } };
      const type = body?.type;
      const preapprovalId = body?.data?.id;
      if (!type || !preapprovalId) {
        return res.status(400).json({ message: "Faltan type o data.id" });
      }
      if (type !== "subscription_preapproval" && type !== "payment") {
        return res.status(200).json({ ok: true });
      }
      const preapproval = await getPreapproval(preapprovalId);
      const status = (preapproval.status ?? "").toLowerCase();
      const ourSubscriptionId = preapproval.external_reference ? parseInt(preapproval.external_reference, 10) : null;
      if (!ourSubscriptionId || isNaN(ourSubscriptionId)) {
        console.warn("Webhook MP: sin external_reference en preapproval", preapprovalId);
        return res.status(200).json({ ok: true });
      }
      const sub = await storage.getSubscriptionById(ourSubscriptionId);
      if (!sub) {
        console.warn("Webhook MP: suscripción no encontrada", ourSubscriptionId);
        return res.status(200).json({ ok: true });
      }
      const updates: { status: string; mercadopagoPaymentId: string; mercadopagoPreferenceId?: string } = {
        status: status === "authorized" ? "paid" : status,
        mercadopagoPaymentId: preapprovalId,
      };
      if (preapproval.preapproval_plan_id ?? sub.mercadopagoPreferenceId) {
        updates.mercadopagoPreferenceId = preapproval.preapproval_plan_id ?? sub.mercadopagoPreferenceId ?? undefined;
      }
      await storage.updateSubscription(sub.id, updates);
      if (status === "authorized") {
        await storage.updateUserSubscriptionPlan(sub.userId, sub.planId);
      }
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Webhook Mercado Pago:", err);
      res.status(500).json({ message: "Error procesando webhook" });
    }
  });

  // Crear checkout de suscripción (Mercado Pago) – devuelve init_point para redirigir
  app.post("/api/subscription/create-checkout", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { planId } = req.body as { planId?: PlanId };
      if (!planId || !["lite", "creator", "profesional"].includes(planId)) {
        return res.status(400).json({ message: "planId inválido (lite, creator, profesional)" });
      }
      const plan = getPlanById(planId);
      if (!plan || plan.priceUsd <= 0) {
        return res.status(400).json({ message: "Plan no disponible para pago" });
      }
      const baseUrl = process.env.FRONTEND_URL || process.env.VITE_API_URL?.replace("/api", "") || "https://www.kimscript.com";
      const sub = await storage.createSubscription({
        userId,
        planId,
        status: "pending",
        amountUsd: plan.priceUsd,
        currency: "USD",
      });
      const backUrl = `${baseUrl}/checkout/success?subscription_id=${sub.id}`;
      const { initPoint, preapprovalPlanId } = await createSubscriptionCheckout({
        planId,
        subscriptionId: sub.id,
        backUrl,
      });
      await storage.updateSubscription(sub.id, { mercadopagoPreferenceId: preapprovalPlanId });
      res.json({ initPoint, subscriptionId: sub.id });
    } catch (err) {
      console.error("Create subscription checkout:", err);
      res.status(500).json({ message: (err as Error).message || "Error al crear checkout" });
    }
  });

  // Video analysis endpoint (first step: transcribe and analyze only)
  app.post("/api/analyze-video", isAuthenticated, async (req: any, res) => {
    try {
      console.log("=== VIDEO ANALYSIS REQUEST START ===");
      const { videoUrl } = req.body;
      const userId = req.user.id;

      // Plan limit: free plan has a max number of analyses (credits)
      let userPlan: PlanId = "free";
      try {
        const dbUser = await storage.getUser(userId) ?? await storage.getUserLegacy(userId);
        if (dbUser?.subscriptionPlan) userPlan = dbUser.subscriptionPlan as PlanId;
      } catch (_) {}
      const plan = getPlanById(userPlan);
      if (plan) {
        const scripts = await storage.getScriptsByUserId(userId);
        if (scripts.length >= plan.credits) {
          return res.status(403).json({
            message: "Has alcanzado el límite de tu plan. Mejora tu plan para seguir analizando videos.",
            code: "PLAN_LIMIT_REACHED",
          });
        }
      }

      console.log("Video URL:", videoUrl);
      console.log("User ID:", userId);

      // Check concurrency limit
      if (activeVideoProcessing >= MAX_CONCURRENT_VIDEOS) {
        console.log("Concurrency limit reached:", activeVideoProcessing, "/", MAX_CONCURRENT_VIDEOS);
        return res.status(429).json({ 
          message: "Demasiados videos procesándose simultáneamente. Por favor, espera un momento e intenta de nuevo." 
        });
      }

      // Validate inputs
      if (!videoUrl) {
        console.log("Error: No video URL provided");
        return res.status(400).json({ message: "Video URL is required" });
      }

      if (!validateVideoUrl(videoUrl)) {
        console.log("Error: Invalid video URL:", videoUrl);
        return res.status(400).json({ message: "Invalid video URL. Please use TikTok, Instagram, or YouTube URLs." });
      }

      const platform = extractPlatformFromUrl(videoUrl);
      console.log("Platform detected:", platform);
      
      // Increment active processing counter
      activeVideoProcessing++;

      // Check if video is already cached
      let transcription = "";
      let analysis: any;

      if (isVideoCached(videoUrl, platform)) {
        console.log(`Video found in cache: ${videoUrl}`);
        const cachedData = getCachedVideoData(videoUrl, platform);
        if (cachedData) {
          transcription = cachedData.transcription;
          analysis = cachedData.analysis;
        }
      } else {
        try {
          // Extract real video content using the video processor
          transcription = await extractVideoContent(videoUrl, platform);
          
          // Analyze the extracted content with our expert analysis system
          analysis = await analyzeVideoContent(transcription);
          
          // Cache the results for future use
          setCachedVideoData(videoUrl, platform, transcription, analysis);
          console.log(`Video cached successfully: ${videoUrl}`);
          
        } catch (error) {
          console.error("Error in video analysis:", error);
          const errorMessage = (error as Error).message;
          
          // Return specific error messages for platform issues
          if (errorMessage.includes('requiere autenticación') || errorMessage.includes('login required')) {
            return res.status(400).json({ 
              message: errorMessage 
            });
          }
          
          if (errorMessage.includes('Video no disponible') || errorMessage.includes('not available')) {
            return res.status(400).json({ 
              message: errorMessage 
            });
          }
          
          if (errorMessage.includes('timeout') || errorMessage.includes('Video processing timeout')) {
            return res.status(408).json({ 
              message: "El video es demasiado largo o está tardando mucho en procesar. Por favor, intenta con un video más corto."
            });
          }
          
          if (errorMessage.includes('No transcription could be generated')) {
            return res.status(400).json({ 
              message: "No se pudo extraer audio del video. Asegúrate de que el video tenga audio y sea público."
            });
          }
          
          if (errorMessage.includes('Invalid JSON response') || errorMessage.includes('Unterminated string in JSON')) {
            return res.status(500).json({ 
              message: "Error en el análisis del video. Por favor, intenta de nuevo en unos momentos."
            });
          }
          
          if (errorMessage.includes('Incomplete analysis received')) {
            return res.status(500).json({ 
              message: "El análisis del video no se completó correctamente. Por favor, intenta de nuevo."
            });
          }
          
          if (errorMessage.includes('exceeded your current quota') || errorMessage.includes('insufficient_quota')) {
            return res.status(503).json({ 
              message: "Servicio temporalmente no disponible. Por favor, intenta de nuevo en unos minutos."
            });
          }
          
          // Default error message
          return res.status(500).json({ 
            message: "Error al analizar el video. " + errorMessage
          });
        }
      }

      // Ensure user exists in database before saving script
      let dbUser = await storage.getUser(userId);
      if (!dbUser) {
        dbUser = await storage.upsertUser({
          id: userId,
          email: req.user.email,
          firstName: req.user.user_metadata?.first_name || req.user.user_metadata?.full_name?.split(' ')[0],
          lastName: req.user.user_metadata?.last_name || req.user.user_metadata?.full_name?.split(' ').slice(1).join(' '),
          profileImageUrl: req.user.user_metadata?.avatar_url,
        });
      }

      // Generate automatic name for the video analysis
      const videoTitle = analysis?.title || `Video ${platform} - ${new Date().toLocaleDateString()}`;
      const autoTitle = `${videoTitle} (Análisis)`;

      // Save to database (without script generation)
      const scriptData = {
        userId,
        videoUrl,
        platform,
        platforms: [],
        transcription,
        analysis,
        scriptTitle: autoTitle,
      };

      const script = await storage.createScript(scriptData);

      res.json({
        id: script.id,
        transcription,
        analysis,
        createdAt: script.createdAt,
      });

    } catch (error: any) {
      console.error("Error analyzing video:", error);
      res.status(500).json({ message: "Failed to analyze video: " + error.message });
    } finally {
      // Always decrement the counter when processing is done
      activeVideoProcessing = Math.max(0, activeVideoProcessing - 1);
    }
  });

  // Generate script endpoint (second step: generate script with framework)
  app.post("/api/generate-script/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      // Plan limit: same as analyze-video
      let userPlan: PlanId = "free";
      try {
        const dbUser = await storage.getUser(userId) ?? await storage.getUserLegacy(userId);
        if (dbUser?.subscriptionPlan) userPlan = dbUser.subscriptionPlan as PlanId;
      } catch (_) {}
      const plan = getPlanById(userPlan);
      if (plan) {
        const scripts = await storage.getScriptsByUserId(userId);
        if (scripts.length >= plan.credits) {
          return res.status(403).json({
            message: "Has alcanzado el límite de tu plan. Mejora tu plan para seguir generando guiones.",
            code: "PLAN_LIMIT_REACHED",
          });
        }
      }

      const { 
        brandInfo, 
        framework,
        scriptTitle,
        businessType,
        contentType,
        platforms,
        videoDuration,
        targetAudience,
        keyMessage
      } = req.body;
      const scriptId = parseInt(req.params.id);

      // Validate inputs (support both simple and advanced formats)
      if (!brandInfo || !framework) {
        return res.status(400).json({ message: "Brand info and framework are required" });
      }

      // Get the existing script with analysis
      const existingScript = await storage.getScript(scriptId, userId);
      if (!existingScript) {
        return res.status(404).json({ message: "Script not found" });
      }

      // Prepare enhanced brand info for advanced script generation
      let enhancedBrandInfo = brandInfo;
      if (scriptTitle || businessType || contentType || targetAudience || keyMessage) {
        enhancedBrandInfo = `
Título del Script: ${scriptTitle || 'No especificado'}
Tipo de Negocio: ${businessType || 'No especificado'}
Tipo de Contenido: ${contentType || 'No especificado'}
Plataformas Objetivo: ${platforms?.join(', ') || 'No especificado'}
Duración del Video: ${videoDuration ? videoDuration + 's' : 'No especificado'}
Audiencia Objetivo: ${targetAudience || 'No especificado'}
Mensaje Clave: ${keyMessage || 'No especificado'}

Información Adicional de Marca:
${brandInfo}
        `.trim();
      }

      // Generate custom script with framework
      const analysis = existingScript.analysis as any;
      
      console.log(`Starting script generation for script ID: ${scriptId}`);
      console.log(`Framework: ${framework}`);
      console.log(`Script title: ${scriptTitle}`);
      console.log(`Analysis keys: ${Object.keys(analysis || {}).join(', ')}`);
      
      const generatedScript = await generateCustomScript(
        analysis, 
        existingScript.transcription,
        enhancedBrandInfo, 
        framework,
        scriptTitle,
        businessType,
        contentType,
        platforms,
        videoDuration,
        targetAudience,
        keyMessage
      );
      
      console.log(`Script generation completed for script ID: ${scriptId}`);
      console.log(`Generated script keys: ${Object.keys(generatedScript || {}).join(', ')}`);

      // Create a new script version instead of updating the existing one
      const frameworkAbbrev = framework?.substring(0, 4).toUpperCase() || 'GEN';
      const customTitle = scriptTitle || `${existingScript.scriptTitle} - ${frameworkAbbrev}`;
      
      const newScriptData = {
        userId,
        videoUrl: existingScript.videoUrl,
        platform: existingScript.platform,
        platforms: platforms || [],
        transcription: existingScript.transcription,
        analysis: existingScript.analysis as Record<string, any>,
        brandInfo: enhancedBrandInfo,
        framework,
        generatedScript,
        scriptTitle: customTitle,
        businessType,
        contentType,
        videoDuration,
        targetAudience,
        keyMessage,
      };

      const newScript = await storage.createScript(newScriptData);

      res.json({
        id: newScript.id,
        transcription: existingScript.transcription,
        analysis: existingScript.analysis,
        generatedScript,
        brandInfo: enhancedBrandInfo,
        framework,
        scriptTitle: customTitle,
        businessType,
        contentType,
        platforms,
        videoDuration,
        targetAudience,
        keyMessage,
        createdAt: newScript.createdAt,
      });

    } catch (error: any) {
      console.error("Error generating script:", error);
      const errorMessage = error.message;
      
      // Handle specific OpenAI JSON errors
      if (errorMessage.includes('Invalid JSON response') || errorMessage.includes('Unterminated string in JSON')) {
        return res.status(500).json({ 
          message: "Error en la generación del script. Por favor, intenta de nuevo en unos momentos."
        });
      }
      
      if (errorMessage.includes('No valid JSON found')) {
        return res.status(500).json({ 
          message: "El script no se generó correctamente. Por favor, intenta de nuevo."
        });
      }
      
      if (errorMessage.includes('No content received from OpenAI')) {
        return res.status(500).json({ 
          message: "Error de conexión con el servicio de IA. Por favor, intenta de nuevo."
        });
      }
      
      // Default error message
      res.status(500).json({ message: "Failed to generate script: " + errorMessage });
    }
  });

  // Get user's script history
  app.get("/api/scripts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const scripts = await storage.getScriptsByUserId(userId);
      res.json(scripts);
    } catch (error) {
      console.error("Error fetching scripts:", error);
      // Si la tabla scripts tiene menos columnas que el esquema (migración pendiente), devolver [] para no bloquear el dashboard
      const msg = (error as Error)?.message ?? "";
      if ((msg.includes("column") && msg.includes("does not exist")) || (msg.includes("relation") && msg.includes("does not exist"))) {
        console.warn("Scripts table schema mismatch, returning empty list. Run migrations.", msg);
        return res.json([]);
      }
      res.status(500).json({ message: "Failed to fetch scripts" });
    }
  });

  // Get specific script
  app.get("/api/scripts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const scriptId = parseInt(req.params.id);
      
      const script = await storage.getScript(scriptId, userId);
      if (!script) {
        return res.status(404).json({ message: "Script not found" });
      }
      
      res.json(script);
    } catch (error) {
      console.error("Error fetching script:", error);
      res.status(500).json({ message: "Failed to fetch script" });
    }
  });

  // Update script
  app.patch("/api/scripts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const scriptId = parseInt(req.params.id);
      
      // Validate request body
      const updates = insertScriptSchema.partial().parse(req.body);
      
      const script = await storage.updateScript(scriptId, userId, updates);
      if (!script) {
        return res.status(404).json({ message: "Script not found" });
      }
      
      res.json(script);
    } catch (error) {
      console.error("Error updating script:", error);
      res.status(500).json({ message: "Failed to update script" });
    }
  });

  // Delete script
  app.delete("/api/scripts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const scriptId = parseInt(req.params.id);
      
      const success = await storage.deleteScript(scriptId, userId);
      if (!success) {
        return res.status(404).json({ message: "Script not found" });
      }
      
      res.json({ message: "Script deleted successfully" });
    } catch (error) {
      console.error("Error deleting script:", error);
      res.status(500).json({ message: "Failed to delete script" });
    }
  });

  // Generate viral hashtags
  app.post("/api/generate-hashtags", isAuthenticated, async (req: any, res) => {
    try {
      const { keyword, platform, category } = req.body;
      
      if (!keyword || keyword.trim().length === 0) {
        return res.status(400).json({ message: "Keyword is required" });
      }

      const result = await generateViralHashtags(keyword.trim(), platform, category);
      
      res.json(result);
    } catch (error) {
      console.error("Error generating hashtags:", error);
      res.status(500).json({ message: "Failed to generate hashtags" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/overview", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const overview = await storage.getAnalyticsOverview(userId);
      res.json(overview);
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      res.status(500).json({ message: "Failed to fetch analytics overview" });
    }
  });

  app.get("/api/analytics/trends", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const days = parseInt(req.query.days as string) || 30;
      const trends = await storage.getPerformanceTrends(userId, days);
      res.json(trends);
    } catch (error) {
      console.error("Error fetching performance trends:", error);
      res.status(500).json({ message: "Failed to fetch performance trends" });
    }
  });

  app.get("/api/analytics/behavior", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const behavior = await storage.getUserBehaviorAnalytics(userId);
      res.json(behavior || {});
    } catch (error) {
      console.error("Error fetching user behavior analytics:", error);
      res.status(500).json({ message: "Failed to fetch user behavior analytics" });
    }
  });

  app.post("/api/analytics/track", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { eventType, eventCategory, eventName, scriptId, platform, framework, duration, metadata } = req.body;
      
      const event = await storage.trackEvent({
        userId,
        sessionId: req.sessionID,
        eventType,
        eventCategory,
        eventName,
        scriptId,
        platform,
        framework,
        duration,
        metadata,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
      });
      
      res.json(event);
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ message: "Failed to track event" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
