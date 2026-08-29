import { createClient } from '@supabase/supabase-js';
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL environment variable not provided");
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_ANON_KEY environment variable not provided");
}

// Use SERVICE_ROLE_KEY for server-side operations (signup, signin, etc.)
// ANON_KEY is used for token validation in isAuthenticated middleware
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
if (!supabaseKey) {
  throw new Error("Either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY must be provided");
}

// Create Supabase client with SERVICE_ROLE_KEY for server-side operations
export const supabase = createClient(
  process.env.SUPABASE_URL,
  supabaseKey
);

// Middleware to verify Supabase JWT token
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Create a client with the token for validation
    // Use ANON_KEY for getUser() as it's designed to work with user tokens
    const authClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await authClient.auth.getUser(token);
    
    if (error) {
      console.error("Token validation error:", {
        error: error.message,
        code: error.status,
        supabaseUrl: process.env.SUPABASE_URL,
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 20) + "..."
      });
      return res.status(401).json({ message: "Invalid token", details: error.message });
    }
    
    if (!user) {
      console.error("Token validation failed: No user returned");
      return res.status(401).json({ message: "Invalid token: No user found" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Authentication failed", details: (error as Error).message });
  }
};

// Setup auth routes
export function setupAuth(app: Express) {
  // Get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    const user = req.user;
    const authPayload = () => ({
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.first_name ?? user.user_metadata?.full_name?.split(' ')[0] ?? null,
      lastName: user.user_metadata?.last_name ?? user.user_metadata?.full_name?.split(' ').slice(1).join(' ') ?? null,
      profileImageUrl: user.user_metadata?.avatar_url ?? null,
      subscriptionPlan: 'free' as const,
      createdAt: new Date().toISOString(),
    });
    try {
      let dbUser = await storage.getUser(user.id);
      if (!dbUser) {
        try {
          dbUser = await storage.upsertUser({
            id: user.id,
            email: user.email,
            firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0],
            lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' '),
            profileImageUrl: user.user_metadata?.avatar_url,
          });
        } catch (upsertErr) {
          // Tabla sin subscription_plan: crear usuario con upsert legacy
          await storage.upsertUserLegacy({
            id: user.id,
            email: user.email ?? undefined,
            firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0],
            lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' '),
            profileImageUrl: user.user_metadata?.avatar_url,
          });
          dbUser = await storage.getUserLegacy(user.id) ?? undefined;
        }
      }
      if (dbUser) {
        return res.json({
          id: user.id,
          email: user.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          profileImageUrl: dbUser.profileImageUrl,
          subscriptionPlan: dbUser.subscriptionPlan ?? 'free',
          createdAt: dbUser.createdAt,
        });
      }
      return res.json(authPayload());
    } catch (error) {
      // Fallback: tabla sin subscription_plan o error de lectura
      try {
        const dbUser = await storage.getUserLegacy(user.id);
        if (dbUser) {
          return res.json({
            id: user.id,
            email: user.email,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            profileImageUrl: dbUser.profileImageUrl,
            subscriptionPlan: 'free',
            createdAt: dbUser.createdAt,
          });
        }
      } catch (_) {
        // ignore
      }
      try {
        await storage.upsertUserLegacy({
          id: user.id,
          email: user.email ?? undefined,
          firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0],
          lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' '),
          profileImageUrl: user.user_metadata?.avatar_url,
        });
      } catch (_) {
        // ignore
      }
      return res.json(authPayload());
    }
  });

  // Sign up
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      // Create user in our database if signup was successful
      if (data.user) {
        try {
          await storage.upsertUser({
            id: data.user.id,
            email: data.user.email || email,
            firstName: firstName || data.user.user_metadata?.first_name,
            lastName: lastName || data.user.user_metadata?.last_name,
            profileImageUrl: data.user.user_metadata?.avatar_url,
          });
          console.log(`User created in database: ${data.user.id}`);
        } catch (dbError) {
          console.error("Error creating user in database:", dbError);
          // Don't fail the signup if database creation fails
        }
      }

      res.json({
        message: "User created successfully. Please check your email to confirm your account.",
        user: data.user
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Sign in
  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      // Ensure user exists in our database (for existing users who might not be in our DB)
      if (data.user) {
        try {
          let dbUser = await storage.getUser(data.user.id);
          if (!dbUser) {
            await storage.upsertUser({
              id: data.user.id,
              email: data.user.email || email,
              firstName: data.user.user_metadata?.first_name,
              lastName: data.user.user_metadata?.last_name,
              profileImageUrl: data.user.user_metadata?.avatar_url,
            });
            console.log(`User synced to database: ${data.user.id}`);
          }
        } catch (dbError) {
          console.error("Error syncing user to database:", dbError);
          // Don't fail the signin if database sync fails
        }
      }

      res.json({
        user: data.user,
        session: data.session
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Failed to sign in" });
    }
  });

  // Sign out
  app.post('/api/auth/signout', async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.json({ message: "Signed out successfully" });
    } catch (error) {
      console.error("Signout error:", error);
      res.status(500).json({ message: "Failed to sign out" });
    }
  });

  // Reset password
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${req.protocol}://${req.get('host')}/reset-password`,
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to send reset email" });
    }
  });
}
