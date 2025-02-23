import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env";
import fs from "fs";

const { DATABASE_URL } = env;
export const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        ca: fs.readFileSync('./certs/neon-ca.crt'), // Utilisation du certificat fourni par Neon
    }
});

export const db = drizzle(pool);