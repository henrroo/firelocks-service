import dotenv from "dotenv";

dotenv.config();

export const FIREBLOCKS_API_KEY = process.env.FIREBLOCKS_API_KEY || "";
export const FIREBLOCKS_PRIVATE_KEY = process.env.FIREBLOCKS_PRIVATE_KEY || "";
export const FIREBLOCKS_BASE_URL =
  process.env.FIREBLOCKS_BASE_URL || "https://api.fireblocks.io";

if (!FIREBLOCKS_API_KEY) {
  console.warn("WARNING: FIREBLOCKS_API_KEY is not set.");
}

if (!FIREBLOCKS_PRIVATE_KEY) {
  console.warn("WARNING: FIREBLOCKS_PRIVATE_KEY is not set. JWT signing will fail.");
}
