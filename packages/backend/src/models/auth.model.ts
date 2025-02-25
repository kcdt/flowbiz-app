import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { users } from "../schemas";
import { eq } from "drizzle-orm";
import { env } from "../config/env";
import { UserInput } from "../validation/user.validation";

export const AuthModel = {
  generateTokens(user: { id: string; email: string }) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_SECRET_REFRESH,
      { expiresIn: "7d" }
    );
    
    return { accessToken, refreshToken };
  },
  
  async register(user: UserInput) {
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, user.email));
    
    if (existingUser.length > 0) {
      throw new Error("Cet email est déjà utilisé");
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    
    const newUser = await db.insert(users)
      .values({
        email: user.email,
        passwordHash: hashedPassword,
        name: user.name,
        role: user.role,
        phone: user.phone,
        companyId: user.companyId
      })
      .returning();
    
    if (newUser.length === 0) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
    
    return this.generateTokens({ ...newUser[0], id: newUser[0].id });
  },
  
  async login(email: string, password: string) {
    const foundUsers = await db.select()
      .from(users)
      .where(eq(users.email, email));
    
    if (foundUsers.length === 0) {
      throw new Error("Email ou mot de passe incorrect");
    }
    
    const user = foundUsers[0];
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!isMatch) {
      throw new Error("Email ou mot de passe incorrect");
    }
    
    return this.generateTokens({ ...user, id: user.id });
  },
  
  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET_REFRESH) as { id: string };

      const foundUsers = await db.select()
        .from(users)
        .where(eq(users.id, decoded.id));
      
      if (foundUsers.length === 0) {
        throw new Error("Utilisateur non trouvé");
      }
      
      return this.generateTokens(foundUsers[0]);
    } catch (error) {
      throw new Error("Token de rafraîchissement invalide");
    }
  }
};