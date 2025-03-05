import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { companies } from '../schemas';
import { CreateCompanyInput, UpdateCompanyInput } from '../validation/companies.validation';

export const companiesModel = {
  async createCompany(companyData: CreateCompanyInput) {
    const newCompany = await db.insert(companies)
      .values(companyData)
      .returning({ id: companies.id });
    
    return newCompany.length > 0 ? newCompany[0] : null;
  },


  updateById (id: string, updatedCompany: UpdateCompanyInput) {
    try {
      return db.update(companies)
        .set(updatedCompany)
        .where(eq(companies.id, id))
        .returning({ 
          id: companies.id,
          name: companies.name, 
          address: companies.address, 
          phone: companies.phone , 
          email: companies.email , 
          taxId: companies.taxId 
        })
        .execute();

    } catch (err) {
      throw new Error("Impossible de mettre à jour l'entreprise");
    }
  },

  getById (id: string) {
    try {
      return db.query.companies.findFirst({
        where: eq(companies.id, id),
        columns: { 
          id: true,
          name: true, 
          address: true, 
          phone: true, 
          email: true, 
          taxId: true 
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Impossible de récupérer l'entreprise: ${err.message}`);
      } else {
        throw new Error("Impossible de récupérer l'entreprise: erreur inconnue");
      }
    }
  },
}