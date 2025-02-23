import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env";

const { DATABASE_URL } = env;
export const pool = new Pool({
    connectionString: DATABASE_URL
});

export const db = drizzle(pool);