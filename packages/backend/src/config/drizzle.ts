import 'dotenv/config'
import { defineConfig } from 'drizzle-kit';
import { env } from './env';
const { DATABASE_URL } = env;

export default defineConfig({
  schema: 'src/schemas/index.ts',
  out: 'src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL
  },
  verbose: true,
  strict: true
});