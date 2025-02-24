// packages/backend/src/fixtures/seed.ts
import { db } from '../config/db';
import { products } from '../schemas';
import { productFixtures } from './products';

const seed = async () => {
  try {
    console.log('🌱 Insertion des données de test...');
    await db.insert(products).values(productFixtures);
    console.log('✅ Données insérées avec succès !');
  } catch (error) {
    console.error(`❌ Erreur pendant l'insertion:`, error);
  }
};

seed();