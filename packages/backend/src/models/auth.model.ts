import { db } from '../config/db';
import { users } from '../schemas';
import { eq } from 'drizzle-orm';
import { UserInput } from '../validation/user.validation';

export const AuthModel = {
  async findUserByEmail(email: string) {
    const foundUsers = await db.select()
      .from(users)
      .where(eq(users.email, email));
    
    return foundUsers.length > 0 ? foundUsers[0] : null;
  },
  
  async createUser(userData: Omit<UserInput, 'password'> & { passwordHash: string }) {
    const newUser = await db.insert(users)
      .values(userData)
      .returning();
    
    return newUser.length > 0 ? newUser[0] : null;
  }
};