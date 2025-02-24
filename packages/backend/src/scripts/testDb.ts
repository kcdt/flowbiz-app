import { sql } from 'drizzle-orm';
import { db } from '../config/db';

async function testConnection() {
  try {
    const result = await db.execute(sql`SELECT 1`);
    console.log('✅ Connexion à la base de données réussie !', result);
  } catch (error) {
    console.error('❌ Erreur de connexion :', error);
  } finally {
    process.exit();
  }
}

testConnection();