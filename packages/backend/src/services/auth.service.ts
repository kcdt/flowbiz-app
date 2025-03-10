import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const AuthService = {
  generateTokens(user: { id: string; email: string; role: string, companyId: string }) {

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user.id,  companyId: user.companyId },
      env.JWT_SECRET_REFRESH,
      { expiresIn: "7d" }
    );
    
    return { accessToken, refreshToken };
  },
  
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },
  
  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },
  
  verifyRefreshToken(token: string) {
    return jwt.verify(token, env.JWT_SECRET_REFRESH) as { id: string };
  }
};