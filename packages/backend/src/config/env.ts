import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT: parseInt(process.env.PORT || "3000"),
    JWT_SECRET: process.env.JWT_SECRET || "MonSecretTropBienGardé123!",
    JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH || "MonSecretRefreshTropBienGardé123!",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/flowbiz_dev"
};