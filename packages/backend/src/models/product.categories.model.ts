import { eq, and, count } from 'drizzle-orm';
import { db } from '../config/db';
import { productCategories, products } from '../schemas';

export const categoryModel = {
  async findMany(companyId: string) {
    return db.query.productCategories.findMany({
      where: eq(productCategories.companyId, companyId),
      orderBy: productCategories.name
    });
  },

  async findManyWithProducts(companyId: string) {
    return db.query.productCategories.findMany({
      where: eq(productCategories.companyId, companyId),
      orderBy: productCategories.name,
      with: {
        products: true
      }
    });
  },

  async findById(id: string) {
    return db.query.productCategories.findFirst({
      where: eq(productCategories.id, id)
    });
  },

  async findByIdAndCompany(id: string, companyId: string) {
    return db.query.productCategories.findFirst({
      where: and(
        eq(productCategories.id, id),
        eq(productCategories.companyId, companyId)
      )
    });
  },

  async findByIdWithProducts(id: string, companyId: string) {
    return db.query.productCategories.findFirst({
      where: and(
        eq(productCategories.id, id),
        eq(productCategories.companyId, companyId)
      ),
      with: {
        products: true
      }
    });
  },

  async insert(data: any) {
    const [category] = await db.insert(productCategories)
      .values(data)
      .returning();
    
    return category;
  },

  async update(id: string, companyId: string, data: any) {
    const [category] = await db.update(productCategories)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(productCategories.id, id),
          eq(productCategories.companyId, companyId)
        )
      )
      .returning();
    
    return category;
  },

  async delete(id: string, companyId: string) {
    await db.delete(productCategories)
      .where(
        and(
          eq(productCategories.id, id),
          eq(productCategories.companyId, companyId)
        )
      );
  },

  async countProductsByCategory(categoryId: string) {
    const result = await db.select({ count: count() })
      .from(products)
      .where(eq(products.categoryId, categoryId));
    
    return Number(result[0]?.count || 0);
  }
};