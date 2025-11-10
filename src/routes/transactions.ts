import { Router, Request, Response, NextFunction } from "express";
import { createTransaction } from "../fireblocksClient";

const router = Router();

/**
 * POST /api/transactions
 * Proxy to Fireblocks /v1/transactions.
 */
router.post(
  "/transactions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await createTransaction(req.body);
      // Fireblocks returns 201 for successful create transaction
      res.status(201).json(data);
    } catch (err: any) {
      if (err.response) {
        // Error from Fireblocks API
        return res.status(err.response.status).json({
          error: "Fireblocks error",
          details: err.response.data
        });
      }

      return next(err);
    }
  }
);

export default router;
