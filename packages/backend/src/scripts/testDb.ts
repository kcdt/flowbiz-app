import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { sql } from 'drizzle-orm'

async function testConnection() {
  console.log('🔍 Tentative de connexion à la base de données...')
  console.log('URL de connexion :', process.env.DATABASE_URL)

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  })

  try {
    console.log('Connexion en cours...')
    
    await client.connect()
    console.log('Connexion au client PostgreSQL réussie')

    const db = drizzle(client)
    
    const result = await db.execute(sql`SELECT 1 as test`)
    console.log('Requête de test réussie :', result.rows)

  } catch (error) {
    console.error('Erreur de connexion :', error)
  } finally {
    await client.end()
    process.exit()
  }
}

testConnection()