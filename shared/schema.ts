import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  real,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionPlan: varchar("subscription_plan").default("free"), // 'free' | 'lite' | 'creator' | 'profesional'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scripts = pgTable("scripts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  videoUrl: text("video_url").notNull(),
  platform: varchar("platform").notNull(), // 'tiktok', 'instagram', 'youtube'
  
  // Advanced script configuration
  scriptTitle: varchar("script_title"),
  businessType: varchar("business_type"),
  contentType: varchar("content_type"),
  framework: varchar("framework"), // 'AIDA', 'PAS', 'Hook-Story-CTA', 'Antes/Después', 'Problema/Solución', 'Storytelling'
  platforms: jsonb("platforms").$type<string[]>(), // multiple platform selection
  videoDuration: varchar("video_duration"), // '15', '30', '60', '90'
  targetAudience: text("target_audience"),
  keyMessage: text("key_message"),
  brandInfo: text("brand_info"),
  
  transcription: text("transcription").notNull(),
  analysis: jsonb("analysis").notNull(), // stores hook, viral elements, etc.
  generatedScript: jsonb("generated_script"), // stores hook, body, cta - nullable until generated
  
  // Performance metrics
  performanceScore: real("performance_score"), // calculated performance score (0-100)
  viralPotentialScore: real("viral_potential_score"), // AI-assessed viral potential
  engagementPrediction: real("engagement_prediction"), // predicted engagement rate
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics Events Table - Track user interactions and behaviors
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id"),
  eventType: varchar("event_type").notNull(), // 'page_view', 'video_analysis', 'script_generation', 'export', 'share'
  eventCategory: varchar("event_category").notNull(), // 'user_action', 'system', 'conversion'
  eventName: varchar("event_name").notNull(),
  
  // Context data
  scriptId: integer("script_id").references(() => scripts.id),
  platform: varchar("platform"),
  framework: varchar("framework"),
  
  // Performance metrics
  duration: integer("duration"), // time spent in milliseconds
  metadata: jsonb("metadata"), // additional event-specific data
  
  // User agent and location
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  country: varchar("country"),
  
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => [
  index("idx_analytics_user_id").on(table.userId),
  index("idx_analytics_event_type").on(table.eventType),
  index("idx_analytics_timestamp").on(table.timestamp),
]);

// Performance Metrics Table - Track system performance and AI accuracy
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  scriptId: integer("script_id").notNull().references(() => scripts.id),
  
  // AI Analysis Metrics
  hookAccuracyScore: real("hook_accuracy_score"), // 0-1 accuracy of hook detection
  viralElementsCount: integer("viral_elements_count"),
  sentimentAccuracy: real("sentiment_accuracy"),
  
  // Processing Metrics
  analysisProcessingTime: integer("analysis_processing_time"), // milliseconds
  scriptGenerationTime: integer("script_generation_time"), // milliseconds
  totalProcessingTime: integer("total_processing_time"), // milliseconds
  
  // Quality Metrics
  transcriptionQuality: real("transcription_quality"), // 0-1 quality score
  scriptQuality: real("script_quality"), // 0-1 quality score
  userSatisfactionScore: real("user_satisfaction_score"), // user feedback score
  
  // Usage Metrics
  exportCount: integer("export_count").default(0),
  shareCount: integer("share_count").default(0),
  copyCount: integer("copy_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_performance_script_id").on(table.scriptId),
]);

// Daily Analytics Summary Table - Aggregated daily metrics
export const dailyAnalytics = pgTable("daily_analytics", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  
  // User Metrics
  totalUsers: integer("total_users").default(0),
  newUsers: integer("new_users").default(0),
  activeUsers: integer("active_users").default(0),
  
  // Content Metrics
  totalAnalyses: integer("total_analyses").default(0),
  totalScripts: integer("total_scripts").default(0),
  totalExports: integer("total_exports").default(0),
  totalShares: integer("total_shares").default(0),
  
  // Platform Breakdown
  tiktokAnalyses: integer("tiktok_analyses").default(0),
  instagramAnalyses: integer("instagram_analyses").default(0),
  youtubeAnalyses: integer("youtube_analyses").default(0),
  
  // Framework Usage
  aidaUsage: integer("aida_usage").default(0),
  pasUsage: integer("pas_usage").default(0),
  hookStoryCtaUsage: integer("hook_story_cta_usage").default(0),
  beforeAfterUsage: integer("before_after_usage").default(0),
  problemSolutionUsage: integer("problem_solution_usage").default(0),
  storytellingUsage: integer("storytelling_usage").default(0),
  
  // Performance Averages
  avgPerformanceScore: real("avg_performance_score"),
  avgViralPotential: real("avg_viral_potential"),
  avgProcessingTime: real("avg_processing_time"),
  avgUserSatisfaction: real("avg_user_satisfaction"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_daily_analytics_date").on(table.date),
]);

// User Behavior Analytics Table - Track user patterns and preferences
export const userBehaviorAnalytics = pgTable("user_behavior_analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Usage Patterns
  totalSessions: integer("total_sessions").default(0),
  totalAnalyses: integer("total_analyses").default(0),
  totalScripts: integer("total_scripts").default(0),
  avgSessionDuration: integer("avg_session_duration"), // seconds
  
  // Preferences
  favoriteFramework: varchar("favorite_framework"),
  favoriteBusinessType: varchar("favorite_business_type"),
  favoriteContentType: varchar("favorite_content_type"),
  mostUsedPlatform: varchar("most_used_platform"),
  
  // Performance Tracking
  avgPerformanceScore: real("avg_performance_score"),
  bestPerformanceScore: real("best_performance_score"),
  totalExports: integer("total_exports").default(0),
  totalShares: integer("total_shares").default(0),
  
  // Engagement Metrics
  lastActiveAt: timestamp("last_active_at"),
  streakDays: integer("streak_days").default(0),
  totalTimeSpent: integer("total_time_spent").default(0), // seconds
  
  // Success Metrics
  highPerformingScripts: integer("high_performing_scripts").default(0), // scripts with >80% score
  viralPredictions: integer("viral_predictions").default(0), // scripts with high viral potential
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_behavior_user_id").on(table.userId),
  index("idx_user_behavior_last_active").on(table.lastActiveAt),
]);

// Subscriptions / Mercado Pago – payments and plan changes
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: varchar("plan_id").notNull(), // 'free' | 'lite' | 'creator' | 'profesional'
  mercadopagoPaymentId: varchar("mercadopago_payment_id"),
  mercadopagoPreferenceId: varchar("mercadopago_preference_id"),
  status: varchar("status").notNull().default("pending"), // pending | paid | cancelled | refunded
  amountUsd: real("amount_usd"),
  currency: varchar("currency").default("USD"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_subscriptions_user_id").on(table.userId),
  index("idx_subscriptions_mercadopago").on(table.mercadopagoPaymentId),
]);

export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  subscriptionPlan: true,
});

export const insertScriptSchema = createInsertSchema(scripts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  platforms: z.array(z.string()).default([])
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  timestamp: true,
});

export const insertPerformanceMetricsSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDailyAnalyticsSchema = createInsertSchema(dailyAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertUserBehaviorAnalyticsSchema = createInsertSchema(userBehaviorAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertScript = z.infer<typeof insertScriptSchema>;
export type Script = typeof scripts.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetrics = z.infer<typeof insertPerformanceMetricsSchema>;
export type DailyAnalytics = typeof dailyAnalytics.$inferSelect;
export type InsertDailyAnalytics = z.infer<typeof insertDailyAnalyticsSchema>;
export type UserBehaviorAnalytics = typeof userBehaviorAnalytics.$inferSelect;
export type InsertUserBehaviorAnalytics = z.infer<typeof insertUserBehaviorAnalyticsSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
