import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { users } from '../schemas';
import { UserInput } from '../validation/user.validation';

export const authModel = {
  async createUser(userData: Omit<UserInput, 'password'> & { passwordHash: string }) {
    const newUser = await db.insert(users)
      .values(userData)
      .returning();
    
    return newUser.length > 0 ? newUser[0] : null;
  },

  updateRefreshToken(userId: string, refreshToken: string | null) {
    return db.update(users)
      .set({ refreshToken })
      .where(eq(users.id, userId))
      .execute();
  }
};