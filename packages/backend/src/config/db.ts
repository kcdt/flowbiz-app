import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import 'dotenv/config';
import * as schema from "../schemas";

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined dans .env.local');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });