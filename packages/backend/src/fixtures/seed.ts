import { db } from '../config/db';
import { users, products, companies, sales, saleItems } from '../schemas';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entitie';

async function seed() {
  // Générer des IDs uniques
  const userIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];
  const companyIds = [uuidv4(), uuidv4()];
  const productIds = [];
  for (let i = 0; i < 10; i++) {
    productIds.push(uuidv4());
  }
  const saleIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];
  const invoiceIds = [uuidv4(), uuidv4(), uuidv4()];
  
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Création des entreprises
  const companyData = [
    {
      id: companyIds[0],
      name: 'TechStore SAS',
      address: '15 rue de la République, 75001 Paris',
      phone: '+33145678901',
      email: 'contact@techstore.fr',
      tax_id: 'FR12345678901',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: companyIds[1],
      name: 'AccessoiresPro SARL',
      address: '8 avenue des Champs-Élysées, 75008 Paris',
      phone: '+33156789012',
      email: 'info@accessoirespro.fr',
      tax_id: 'FR98765432109',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await db.insert(companies).values(companyData);
  console.log('Entreprises insérées avec succès');

  // 2. Création des utilisateurs
  const userData: User[] = [
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
  ];

  await db.insert(users).values(userData);
  console.log('Utilisateurs insérés avec succès');

  // 3. Création des produits
  const productData = [
    {
      id: productIds[0],
      name: 'Smartphone XYZ Pro',
      description: 'Le dernier smartphone avec caméra 108MP et processeur ultra-rapide',
      price: '899.99',
      quantity: 15,
      imageUrl: 'https://example.com/images/smartphone-xyz.jpg',
      companyId: companyIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: productIds[1],
      name: 'Laptop Ultra-fin',
      description: 'Ordinateur portable léger avec 16Go RAM et SSD 512Go',
      price: '1299.99',
      quantity: 8,
      imageUrl: 'https://example.com/images/laptop-ultrafin.jpg',
      companyId: companyIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: productIds[2],
      name: 'Écouteurs sans fil',
      description: 'Écouteurs Bluetooth avec annulation de bruit active',
      price: '149.99',
      quantity: 30,
      imageUrl: 'https://example.com/images/ecouteurs.jpg',
      companyId: companyIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: productIds[3],
      name: 'Montre connectée Sport',
      description: 'Montre intelligente avec GPS et suivi de la fréquence cardiaque',
      price: '249.99',
      quantity: 12,
      imageUrl: 'https://example.com/images/montre-sport.jpg',
      companyId: companyIds[1],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: productIds[4],
      name: 'Enceinte Bluetooth',
      description: 'Enceinte portable avec son stéréo et 20h d\'autonomie',
      price: '79.99',
      quantity: 25,
      imageUrl: 'https://example.com/images/enceinte.jpg',
      companyId: companyIds[1],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: productIds[5],
      name: 'Batterie externe 20000mAh',
      description: 'Batterie de secours haute capacité avec charge rapide',
      price: '49.99',
      quantity: 50,
      imageUrl: 'https://example.com/images/batterie.jpg',
      companyId: companyIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: productIds[6],
      name: 'Câble USB-C Premium',
      description: 'Câble tressé ultra-résistant avec transfert rapide',
      price: '19.99',
      quantity: 100,
      imageUrl: 'https://example.com/images/cable.jpg',
      companyId: companyIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: productIds[7],
      name: 'Support téléphone voiture',
      description: 'Support magnétique pour tableau de bord',
      price: '24.99',
      quantity: 40,
      imageUrl: 'https://example.com/images/support.jpg',
      companyId: companyIds[1],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: productIds[8],
      name: 'Chargeur sans fil',
      description: 'Chargeur à induction compatible avec tous smartphones récents',
      price: '34.99',
      quantity: 35,
      imageUrl: 'https://example.com/images/chargeur.jpg',
      companyId: companyIds[1],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: productIds[9],
      name: 'Protection écran universel',
      description: 'Film de protection en verre trempé ajustable',
      price: '14.99',
      quantity: 0,
      imageUrl: 'https://example.com/images/protection.jpg',
      companyId: companyIds[1],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await db.insert(products).values(productData);
  console.log('Produits insérés avec succès');
  
  // 4. Création des ventes
  const saleData = [
    {
      id: saleIds[0],
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Il y a 15 jours
      price: '1049.98',
      status: 'completed' as "pending" | "completed" | "cancelled" | "refunded",
      buyerName: 'Martin Dupont',
      buyerAddress: '25 rue du Commerce, 75015 Paris',
      companyId: companyIds[0],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: saleIds[1],
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours
      price: '1299.99',
      status: 'completed' as "pending" | "completed" | "cancelled" | "refunded",
      buyerName: 'Sophie Martin',
      buyerAddress: '8 boulevard Haussmann, 75009 Paris',
      companyId: companyIds[0],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: saleIds[2],
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
      price: '384.97',
      status: 'pending' as "pending" | "completed" | "cancelled" | "refunded",
      buyerName: 'Pierre Leroy',
      buyerAddress: '12 rue de Rivoli, 75004 Paris',
      companyId: companyIds[1],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: saleIds[3],
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
      price: '924.98',
      status: 'pending' as "pending" | "completed" | "cancelled" | "refunded",
      buyerName: 'Lucie Dubois',
      buyerAddress: '45 avenue Victor Hugo, 75116 Paris',
      companyId: companyIds[0],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: saleIds[4],
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Hier
      price: '74.97',
      status: 'cancelled' as "pending" | "completed" | "cancelled" | "refunded",
      buyerName: 'Thomas Bernard',
      buyerAddress: '5 rue Saint-Honoré, 75001 Paris',
      companyId: companyIds[1],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // Annulée 12h plus tard
    }
  ];
  
  await db.insert(sales).values(saleData);
  console.log('Ventes insérées avec succès');
  
  // 5. Création des éléments de vente
  const saleItemData = [
    // Items pour la vente 1
    {
      id: uuidv4(),
      quantity: 1,
      unitPrice: '899.99',
      saleId: saleIds[0],
      productId: productIds[0] // Smartphone
    },
    {
      id: uuidv4(),
      quantity: 3,
      unitPrice: '49.99',
      saleId: saleIds[0],
      productId: productIds[5] // Batterie externe
    },
    
    // Items pour la vente 2
    {
      id: uuidv4(),
      quantity: 1,
      unitPrice: '1299.99',
      saleId: saleIds[1],
      productId: productIds[1] // Laptop
    },
    
    // Items pour la vente 3
    {
      id: uuidv4(),
      quantity: 1,
      unitPrice: '249.99',
      saleId: saleIds[2],
      productId: productIds[3] // Montre
    },
    {
      id: uuidv4(),
      quantity: 1,
      unitPrice: '79.99',
      saleId: saleIds[2],
      productId: productIds[4] // Enceinte
    },
    {
      id: uuidv4(),
      quantity: 2,
      unitPrice: '24.99',
      saleId: saleIds[2],
      productId: productIds[7] // Support téléphone
    },
    
    // Items pour la vente 4
    {
      id: uuidv4(),
      quantity: 1,
      unitPrice: '899.99',
      saleId: saleIds[3],
      productId: productIds[0] // Smartphone
    },
    {
      id: uuidv4(),
      quantity: 1,
      unitPrice: '24.99',
      saleId: saleIds[3],
      productId: productIds[7] // Support téléphone
    },
    
    // Items pour la vente 5
    {
      id: uuidv4(),
      quantity: 1,
      unitPrice: '34.99',
      saleId: saleIds[4],
      productId: productIds[8] // Chargeur sans fil
    },
    {
      id: uuidv4(),
      quantity: 2,
      unitPrice: '19.99',
      saleId: saleIds[4],
      productId: productIds[6] // Câble USB-C
    }
  ];
  
  await db.insert(saleItems).values(saleItemData);
  console.log('Éléments de vente insérés avec succès');
  
  console.log('Base de données initialisée avec succès!');
}
  
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Erreur lors du peuplement de la base de données:', error);
    process.exit(1);
  });