import {
  users,
  scripts,
  subscriptions,
  analyticsEvents,
  performanceMetrics,
  dailyAnalytics,
  userBehaviorAnalytics,
  type User,
  type UpsertUser,
  type Script,
  type InsertScript,
  type Subscription,
  type InsertSubscription,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type PerformanceMetrics,
  type InsertPerformanceMetrics,
  type DailyAnalytics,
  type InsertDailyAnalytics,
  type UserBehaviorAnalytics,
  type InsertUserBehaviorAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, count, avg, sum, max } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  /** Gets user without requiring subscription_plan column (for DBs created before plans). */
  getUserLegacy(id: string): Promise<(Omit<User, 'subscriptionPlan'> & { subscriptionPlan: string }) | undefined>;
  /** Inserts/updates user without subscription_plan (for DBs that don't have that column yet). */
  upsertUserLegacy(data: { id: string; email?: string | null; firstName?: string | null; lastName?: string | null; profileImageUrl?: string | null }): Promise<void>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Script operations
  createScript(script: InsertScript): Promise<Script>;
  getScriptsByUserId(userId: string): Promise<Script[]>;
  getScript(id: number, userId: string): Promise<Script | undefined>;
  updateScript(id: number, userId: string, updates: Partial<InsertScript>): Promise<Script | undefined>;
  deleteScript(id: number, userId: string): Promise<boolean>;
  
  // Analytics operations
  trackEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getEventsByUserId(userId: string, limit?: number): Promise<AnalyticsEvent[]>;
  getEventsByType(eventType: string, startDate?: Date, endDate?: Date): Promise<AnalyticsEvent[]>;
  
  // Performance metrics operations
  createPerformanceMetrics(metrics: InsertPerformanceMetrics): Promise<PerformanceMetrics>;
  getPerformanceMetrics(scriptId: number): Promise<PerformanceMetrics | undefined>;
  updatePerformanceMetrics(scriptId: number, updates: Partial<InsertPerformanceMetrics>): Promise<PerformanceMetrics | undefined>;
  
  // Daily analytics operations
  upsertDailyAnalytics(date: Date, analytics: Partial<InsertDailyAnalytics>): Promise<DailyAnalytics>;
  getDailyAnalytics(startDate: Date, endDate: Date): Promise<DailyAnalytics[]>;
  
  // User behavior analytics operations
  upsertUserBehaviorAnalytics(userId: string, analytics: Partial<InsertUserBehaviorAnalytics>): Promise<UserBehaviorAnalytics>;
  getUserBehaviorAnalytics(userId: string): Promise<UserBehaviorAnalytics | undefined>;
  
  // Analytics aggregation operations
  getAnalyticsOverview(userId?: string): Promise<{
    totalScripts: number;
    avgPerformanceScore: number;
    totalExports: number;
    totalShares: number;
    platformBreakdown: Record<string, number>;
    frameworkUsage: Record<string, number>;
  }>;
  getPerformanceTrends(userId?: string, days?: number): Promise<{
    date: string;
    avgScore: number;
    totalScripts: number;
  }[]>;

  // Subscription (Mercado Pago)
  createSubscription(data: InsertSubscription): Promise<Subscription>;
  getSubscriptionById(id: number): Promise<Subscription | undefined>;
  getSubscriptionByMercadopagoPreapprovalId(preapprovalId: string): Promise<Subscription | undefined>;
  updateSubscription(id: number, updates: Partial<{ status: string; mercadopagoPaymentId: string; mercadopagoPreferenceId: string }>): Promise<Subscription | undefined>;
  updateUserSubscriptionPlan(userId: string, planId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  /** Fallback when subscription_plan column does not exist yet (users created before plans). */
  async getUserLegacy(id: string): Promise<(Omit<User, 'subscriptionPlan'> & { subscriptionPlan: string }) | undefined> {
    const result = await db.execute(sql`
      SELECT id, email, first_name, last_name, profile_image_url, created_at, updated_at
      FROM users WHERE id = ${id} LIMIT 1
    `);
    const rows = (result as { rows?: unknown[] })?.rows ?? (Array.isArray(result) ? result : [result]);
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return undefined;
    return {
      id: row.id,
      email: row.email ?? null,
      firstName: row.first_name ?? null,
      lastName: row.last_name ?? null,
      profileImageUrl: row.profile_image_url ?? null,
      subscriptionPlan: 'free',
      createdAt: row.created_at ?? new Date(),
      updatedAt: row.updated_at ?? new Date(),
    } as (Omit<User, 'subscriptionPlan'> & { subscriptionPlan: string });
  }

  /** Fallback: insert/update user without subscription_plan column (for DBs created before plans). */
  async upsertUserLegacy(data: { id: string; email?: string | null; firstName?: string | null; lastName?: string | null; profileImageUrl?: string | null }): Promise<void> {
    await db.execute(sql`
      INSERT INTO users (id, email, first_name, last_name, profile_image_url, updated_at)
      VALUES (${data.id}, ${data.email ?? null}, ${data.firstName ?? null}, ${data.lastName ?? null}, ${data.profileImageUrl ?? null}, now())
      ON CONFLICT (id) DO UPDATE SET
        email = COALESCE(EXCLUDED.email, users.email),
        first_name = COALESCE(EXCLUDED.first_name, users.first_name),
        last_name = COALESCE(EXCLUDED.last_name, users.last_name),
        profile_image_url = COALESCE(EXCLUDED.profile_image_url, users.profile_image_url),
        updated_at = now()
    `);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Subscription (Mercado Pago)
  async createSubscription(data: InsertSubscription): Promise<Subscription> {
    const [sub] = await db.insert(subscriptions).values(data).returning();
    return sub;
  }

  async getSubscriptionById(id: number): Promise<Subscription | undefined> {
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return sub;
  }

  async getSubscriptionByMercadopagoPreapprovalId(preapprovalId: string): Promise<Subscription | undefined> {
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.mercadopagoPaymentId, preapprovalId));
    return sub;
  }

  async updateSubscription(
    id: number,
    updates: Partial<{ status: string; mercadopagoPaymentId: string; mercadopagoPreferenceId: string }>
  ): Promise<Subscription | undefined> {
    const [sub] = await db
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return sub;
  }

  async updateUserSubscriptionPlan(userId: string, planId: string): Promise<void> {
    await db.update(users).set({ subscriptionPlan: planId, updatedAt: new Date() }).where(eq(users.id, userId));
  }

  // Script operations
  async createScript(script: InsertScript): Promise<Script> {
    const [newScript] = await db
      .insert(scripts)
      .values(script)
      .returning();
    return newScript;
  }

  async getScriptsByUserId(userId: string): Promise<Script[]> {
    return await db
      .select()
      .from(scripts)
      .where(eq(scripts.userId, userId))
      .orderBy(desc(scripts.createdAt));
  }

  async getScript(id: number, userId: string): Promise<Script | undefined> {
    const [script] = await db
      .select()
      .from(scripts)
      .where(and(eq(scripts.id, id), eq(scripts.userId, userId)));
    return script;
  }

  async updateScript(id: number, userId: string, updates: Partial<InsertScript>): Promise<Script | undefined> {
    const [updatedScript] = await db
      .update(scripts)
      .set({ 
        ...updates,
        updatedAt: new Date(),
        platforms: updates.platforms || []
      })
      .where(and(eq(scripts.id, id), eq(scripts.userId, userId)))
      .returning();
    return updatedScript;
  }

  async deleteScript(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(scripts)
      .where(and(eq(scripts.id, id), eq(scripts.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  // Analytics operations
  async trackEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [createdEvent] = await db
      .insert(analyticsEvents)
      .values(event)
      .returning();
    return createdEvent;
  }

  async getEventsByUserId(userId: string, limit: number = 100): Promise<AnalyticsEvent[]> {
    return await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.userId, userId))
      .orderBy(desc(analyticsEvents.timestamp))
      .limit(limit);
  }

  async getEventsByType(eventType: string, startDate?: Date, endDate?: Date): Promise<AnalyticsEvent[]> {
    let whereConditions = [eq(analyticsEvents.eventType, eventType)];

    if (startDate && endDate) {
      whereConditions.push(
        gte(analyticsEvents.timestamp, startDate),
        lte(analyticsEvents.timestamp, endDate)
      );
    }

    return await db
      .select()
      .from(analyticsEvents)
      .where(and(...whereConditions))
      .orderBy(desc(analyticsEvents.timestamp));
  }

  // Performance metrics operations
  async createPerformanceMetrics(metrics: InsertPerformanceMetrics): Promise<PerformanceMetrics> {
    const [created] = await db
      .insert(performanceMetrics)
      .values(metrics)
      .returning();
    return created;
  }

  async getPerformanceMetrics(scriptId: number): Promise<PerformanceMetrics | undefined> {
    const [metrics] = await db
      .select()
      .from(performanceMetrics)
      .where(eq(performanceMetrics.scriptId, scriptId));
    return metrics;
  }

  async updatePerformanceMetrics(scriptId: number, updates: Partial<InsertPerformanceMetrics>): Promise<PerformanceMetrics | undefined> {
    const [updated] = await db
      .update(performanceMetrics)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(performanceMetrics.scriptId, scriptId))
      .returning();
    return updated;
  }

  // Daily analytics operations
  async upsertDailyAnalytics(date: Date, analytics: Partial<InsertDailyAnalytics>): Promise<DailyAnalytics> {
    const dateStr = date.toISOString().split('T')[0];
    
    const [existing] = await db
      .select()
      .from(dailyAnalytics)
      .where(eq(dailyAnalytics.date, dateStr));

    if (existing) {
      const [updated] = await db
        .update(dailyAnalytics)
        .set(analytics)
        .where(eq(dailyAnalytics.date, dateStr))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(dailyAnalytics)
        .values({ ...analytics, date: dateStr })
        .returning();
      return created;
    }
  }

  async getDailyAnalytics(startDate: Date, endDate: Date): Promise<DailyAnalytics[]> {
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    
    return await db
      .select()
      .from(dailyAnalytics)
      .where(
        and(
          gte(dailyAnalytics.date, startStr),
          lte(dailyAnalytics.date, endStr)
        )
      )
      .orderBy(dailyAnalytics.date);
  }

  // User behavior analytics operations
  async upsertUserBehaviorAnalytics(userId: string, analytics: Partial<InsertUserBehaviorAnalytics>): Promise<UserBehaviorAnalytics> {
    const [existing] = await db
      .select()
      .from(userBehaviorAnalytics)
      .where(eq(userBehaviorAnalytics.userId, userId));

    if (existing) {
      const [updated] = await db
        .update(userBehaviorAnalytics)
        .set({ ...analytics, updatedAt: new Date() })
        .where(eq(userBehaviorAnalytics.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userBehaviorAnalytics)
        .values({ ...analytics, userId })
        .returning();
      return created;
    }
  }

  async getUserBehaviorAnalytics(userId: string): Promise<UserBehaviorAnalytics | undefined> {
    const [analytics] = await db
      .select()
      .from(userBehaviorAnalytics)
      .where(eq(userBehaviorAnalytics.userId, userId));
    return analytics;
  }

  // Analytics aggregation operations
  async getAnalyticsOverview(userId?: string): Promise<{
    totalScripts: number;
    avgPerformanceScore: number;
    totalExports: number;
    totalShares: number;
    platformBreakdown: Record<string, number>;
    frameworkUsage: Record<string, number>;
  }> {
    // Get total scripts and average performance score
    const statsConditions = userId ? [eq(scripts.userId, userId)] : [];
    const [stats] = await db
      .select({
        totalScripts: count(),
        avgPerformanceScore: avg(scripts.performanceScore),
      })
      .from(scripts)
      .where(statsConditions.length > 0 ? and(...statsConditions) : undefined);

    // Get platform breakdown
    const platformConditions = userId ? [eq(scripts.userId, userId)] : [];
    const platformResults = await db
      .select({
        platform: scripts.platform,
        count: count(),
      })
      .from(scripts)
      .where(platformConditions.length > 0 ? and(...platformConditions) : undefined)
      .groupBy(scripts.platform);

    const platformBreakdown = platformResults.reduce((acc, { platform, count }) => {
      acc[platform || 'unknown'] = Number(count);
      return acc;
    }, {} as Record<string, number>);

    // Get framework usage  
    const frameworkConditions = userId 
      ? [eq(scripts.userId, userId), sql`${scripts.framework} IS NOT NULL`]
      : [sql`${scripts.framework} IS NOT NULL`];
    
    const frameworkResults = await db
      .select({
        framework: scripts.framework,
        count: count(),
      })
      .from(scripts)
      .where(and(...frameworkConditions))
      .groupBy(scripts.framework);

    const frameworkUsage = frameworkResults.reduce((acc, { framework, count }) => {
      acc[framework || 'unknown'] = Number(count);
      return acc;
    }, {} as Record<string, number>);

    // Get export/share counts from performance metrics
    let metricsQuery = db
      .select({
        totalExports: sum(performanceMetrics.exportCount),
        totalShares: sum(performanceMetrics.shareCount),
      })
      .from(performanceMetrics);

    if (userId) {
      metricsQuery = metricsQuery
        .leftJoin(scripts, eq(performanceMetrics.scriptId, scripts.id))
        .where(eq(scripts.userId, userId));
    }

    const [metrics] = await metricsQuery;

    return {
      totalScripts: Number(stats?.totalScripts) || 0,
      avgPerformanceScore: Number(stats?.avgPerformanceScore) || 0,
      totalExports: Number(metrics?.totalExports) || 0,
      totalShares: Number(metrics?.totalShares) || 0,
      platformBreakdown,
      frameworkUsage,
    };
  }

  async getPerformanceTrends(userId?: string, days: number = 30): Promise<{
    date: string;
    avgScore: number;
    totalScripts: number;
  }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const conditions = userId 
      ? [
          eq(scripts.userId, userId),
          gte(scripts.createdAt, startDate),
          lte(scripts.createdAt, endDate)
        ]
      : [
          gte(scripts.createdAt, startDate),
          lte(scripts.createdAt, endDate)
        ];

    const results = await db
      .select({
        date: sql<string>`DATE(${scripts.createdAt})`,
        avgScore: avg(scripts.performanceScore),
        totalScripts: count(),
      })
      .from(scripts)
      .where(and(...conditions))
      .groupBy(sql`DATE(${scripts.createdAt})`)
      .orderBy(sql`DATE(${scripts.createdAt})`);
    
    return results.map(result => ({
      date: result.date,
      avgScore: Number(result.avgScore) || 0,
      totalScripts: Number(result.totalScripts) || 0,
    }));
  }
}

export const storage = new DatabaseStorage();
