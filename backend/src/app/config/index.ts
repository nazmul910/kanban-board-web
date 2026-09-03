import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  env: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "7d",
  },

  SaltRounds: Number(process.env.SALT_ROUNDS) || 12,
};

export default config;