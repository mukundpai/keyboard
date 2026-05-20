import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI runs outside Next.js, so we load .env.local explicitly
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" }); // fallback

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  seed: {
    run: "tsx prisma/seed.ts",
  },
});

