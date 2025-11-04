import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  DB_URI,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  NODE_ENV,
  SUB_CATEGORY_DEFAULT,
  CATEGOGY_DEFAULT,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  RESET_PASSWORD_SECRET,
  RESET_PASSWORD_EXPIRES,
  FRONTEND_URL,
} = process.env;

// Validate required environment variables
if (!JWT_SECRET) {
  console.warn("⚠️  WARNING: JWT_SECRET is not set in .env file. Using default (not secure for production)");
}

if (!DB_URI) {
  console.error("❌ ERROR: DB_URI is required in .env file");
  process.exit(1);
}