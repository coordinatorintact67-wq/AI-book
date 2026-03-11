/**
 * Better Auth Configuration for Physical AI Textbook
 * 
 * Setup instructions:
 * 1. Install: npm install better-auth
 * 2. Create .env with BETTER_AUTH_SECRET and DATABASE_URL
 * 3. Run migrations on your Neon Postgres database
 */

import { betterAuth } from "better-auth";
import { pg } from "better-auth/adapters/postgres";

export const auth = betterAuth({
  database: pg(process.env.DATABASE_URL!, {
    provider: "postgres",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      // User background information for personalization
      roboticsBackground: {
        type: "string",
        required: false,
      },
      softwareExperience: {
        type: "string",
        required: false,
      },
      hardwareExperience: {
        type: "string",
        required: false,
      },
      learningGoals: {
        type: "string",
        required: false,
      },
      educationLevel: {
        type: "string",
        required: false,
      },
      // Personalization preferences
      preferredLanguage: {
        type: "string",
        required: false,
        defaultValue: "en",
      },
      contentDifficulty: {
        type: "string",
        required: false,
        defaultValue: "intermediate",
      },
      showCodeExamples: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Auth = typeof auth;
