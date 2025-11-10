import axios from "axios";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import {
  FIREBLOCKS_API_KEY,
  FIREBLOCKS_BASE_URL,
  FIREBLOCKS_PRIVATE_KEY
} from "./config";

export interface CreateTransactionBody {
  assetId: string;
  source: {
    type: string;
    id: string;
  };
  amount: string;
  feeLevel?: string;
  note?: string;
  operation: string;
  customerRefId?: string;
  externalTxId?: string;
  destination: {
    type: string;
    id: string;
  };
  // you can extend this with more optional fields if needed
}

export async function createTransaction(
  body: CreateTransactionBody
): Promise<unknown> {
  const uri = "/v1/transactions";
  const jwtToken = signJwt(uri, body);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-Key": FIREBLOCKS_API_KEY,
    Authorization: `Bearer ${jwtToken}`
  };

  const response = await axios.post(`${FIREBLOCKS_BASE_URL}${uri}`, body, {
    headers
  });

  return response.data;
}

/**
 * Builds the JWT required by Fireblocks for REST calls.
 * Authorization header: "Authorization: Bearer <JWT>" :contentReference[oaicite:1]{index=1}
 */
export function signJwt(uri: string, body: unknown): string {
  if (!FIREBLOCKS_PRIVATE_KEY) {
    throw new Error("FIREBLOCKS_PRIVATE_KEY is not configured");
  }

  const now = Math.floor(Date.now() / 1000);

  const bodyHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(body ?? {}))
    .digest("hex");

  const payload = {
    uri, // e.g. /v1/transactions
    nonce: uuid(),
    iat: now,
    exp: now + 30,
    sub: FIREBLOCKS_API_KEY,
    bodyHash
  };

  return jwt.sign(payload, FIREBLOCKS_PRIVATE_KEY, { algorithm: "RS256" });
}
