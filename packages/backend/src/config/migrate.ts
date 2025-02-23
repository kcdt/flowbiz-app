import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator"; 
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

import { env } from "./env";
const { DATABASE_URL } = env;

async function main() {
    const pool = new Pool({ connectionString: DATABASE_URL })

    const db: NodePgDatabase = drizzle(pool);

    console.info("Migrating database...");

    await migrate(db, { migrationsFolder: 'src/migrations' });

    console.info("Database migrated successfully!");

    await pool.end();
}

main();