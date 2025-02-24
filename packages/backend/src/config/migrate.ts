import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env";

const { DATABASE_URL } = env;

async function main() {
  try {
    const pool = new Pool({ connectionString: DATABASE_URL });
    const db: NodePgDatabase = drizzle(pool);

    console.info("Démarrage des migrations...");
    await migrate(db, { migrationsFolder: 'src/migrations' });
    console.info("Migrations terminées avec succès!");

    await pool.end();
  } catch (error) {
    console.error("Erreur pendant les migrations:", error);
    process.exit(1);
  }
}

// Exécution uniquement si appelé directement
if (require.main === module) {
  main();
}

export { main as runMigrations };