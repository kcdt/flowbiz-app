import { db } from '../config/db';
import { users, products } from '../schemas';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entitie';

async function seed() {
  const userIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];
  const companyIds = [uuidv4(), uuidv4()];
  
  const passwordHash = await bcrypt.hash('password123', 10);

    const userData: User[] = [];
  
    userData.push(
    {
      id: userIds[0],
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'admin_seller',
      phone: '+33612345678',
      passwordHash,
      refreshToken: null,
      companyId: companyIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: userIds[1],
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      role: 'standard_seller',
      phone: '+33687654321',
      passwordHash,
      refreshToken: null,
      companyId: companyIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: userIds[2],
      email: 'robert.johnson@supplies.com',
      name: 'Robert Johnson',
      role: 'supplier',
      phone: '+33601020304',
      passwordHash,
      refreshToken: null,
      companyId: companyIds[1],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: userIds[3],
      email: 'emma.wilson@supplies.com',
      name: 'Emma Wilson',
      role: 'supplier',
      phone: '+33605060708',
      passwordHash,
      refreshToken: null,
      companyId: companyIds[1],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );

  await db.insert(users).values(userData);
  console.log('Utilisateurs insérés avec succès');

  const productData = [];
  
  productData.push(
    {
      id: uuidv4(),
      name: 'Smartphone XYZ Pro',
      description: 'Le dernier smartphone avec caméra 108MP et processeur ultra-rapide',
      price: '899.99',
      quantity: 15,
      imageUrl: 'https://example.com/images/smartphone-xyz.jpg',
      userId: userIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'Laptop Ultra-fin',
      description: 'Ordinateur portable léger avec 16Go RAM et SSD 512Go',
      price: '1299.99',
      quantity: 8,
      imageUrl: 'https://example.com/images/laptop-ultrafin.jpg',
      userId: userIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'Écouteurs sans fil',
      description: 'Écouteurs Bluetooth avec annulation de bruit active',
      price: '149.99',
      quantity: 30,
      imageUrl: 'https://example.com/images/ecouteurs.jpg',
      userId: userIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  productData.push(
    {
      id: uuidv4(),
      name: 'Montre connectée Sport',
      description: 'Montre intelligente avec GPS et suivi de la fréquence cardiaque',
      price: '249.99',
      quantity: 12,
      imageUrl: 'https://example.com/images/montre-sport.jpg',
      userId: userIds[1],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'Enceinte Bluetooth',
      description: 'Enceinte portable avec son stéréo et 20h d\'autonomie',
      price: '79.99',
      quantity: 25,
      imageUrl: 'https://example.com/images/enceinte.jpg',
      userId: userIds[1],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  productData.push(
    {
      id: uuidv4(),
      name: 'Batterie externe 20000mAh',
      description: 'Batterie de secours haute capacité avec charge rapide',
      price: '49.99',
      quantity: 50,
      imageUrl: 'https://example.com/images/batterie.jpg',
      userId: userIds[2],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'Câble USB-C Premium',
      description: 'Câble tressé ultra-résistant avec transfert rapide',
      price: '19.99',
      quantity: 100,
      imageUrl: 'https://example.com/images/cable.jpg',
      userId: userIds[2],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  productData.push(
    {
      id: uuidv4(),
      name: 'Support téléphone voiture',
      description: 'Support magnétique pour tableau de bord',
      price: '24.99',
      quantity: 40,
      imageUrl: 'https://example.com/images/support.jpg',
      userId: userIds[3],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'Chargeur sans fil',
      description: 'Chargeur à induction compatible avec tous smartphones récents',
      price: '34.99',
      quantity: 35,
      imageUrl: 'https://example.com/images/chargeur.jpg',
      userId: userIds[3],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'Protection écran universel',
      description: 'Film de protection en verre trempé ajustable',
      price: '14.99',
      quantity: 0,
      imageUrl: 'https://example.com/images/protection.jpg',
      userId: userIds[3],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  await db.insert(products).values(productData);
  console.log('Produits insérés avec succès');
  
  console.log('Base de données initialisée avec succès!');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Erreur lors du peuplement de la base de données:', error);
    process.exit(1);
  });