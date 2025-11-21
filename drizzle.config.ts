import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./packages/db/schema.ts",
  out: "./packages/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://admin:admin@db:5432/appdb",
    ssl: false,
  },
  verbose: true,
  strict: true,
});
