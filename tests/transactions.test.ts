// Set env before imports
process.env.FIREBLOCKS_API_KEY = "test-api-key";
process.env.FIREBLOCKS_BASE_URL = "https://api.fireblocks.io";

import request from "supertest";
import app from "../src/app";
import axios from "axios";
// You can remove this import if you no longer spy on signJwt
// import * as fireblocksClient from "../src/fireblocksClient";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("POST /api/transactions", () => {
  const sampleBody = {
    assetId: "XLM_USDC_T_CEKS",
    source: {
      type: "EXCHANGE_ACCOUNT",
      id: "300d1b9a-f46b-4ee6-be99-659fcd3cd802"
    },
    amount: "1",
    feeLevel: "MEDIUM",
    note: "",
    operation: "TRANSFER",
    customerRefId: "payoutCircleExternal",
    externalTxId: "circleTest",
    destination: {
      type: "EXTERNAL_WALLET",
      id: "56216a51-5fad-4433-ac89-d4416fad7c0d"
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // We don't need to stub signJwt anymore
    // jest.spyOn(fireblocksClient, "signJwt").mockReturnValue("test-jwt-token");
  });

  it("proxies the request to Fireblocks and returns its response", async () => {
    const fireblocksResponse = { id: "tx123", status: "SUBMITTED" };

    mockedAxios.post.mockResolvedValueOnce({ data: fireblocksResponse });

    const res = await request(app)
      .post("/api/transactions")
      .send(sampleBody)
      .set("Content-Type", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toEqual(fireblocksResponse);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://api.fireblocks.io/v1/transactions",
      sampleBody,
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-Key": "test-api-key",
          // Just check that a Bearer token is present
          Authorization: expect.stringMatching(/^Bearer\s.+/)
        })
      })
    );
  });

  it("returns Fireblocks error payload when Fireblocks responds with error", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message: "Bad Request" }
      }
    });

    const res = await request(app)
      .post("/api/transactions")
      .send(sampleBody)
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Fireblocks error",
      details: { message: "Bad Request" }
    });
  });
});
