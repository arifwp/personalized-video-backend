import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { verifySignature, WEBHOOK_SECRET } from "../lib/syncLab";

const webhookRouter = express.Router();

webhookRouter.post("/sync", async (req: Request, res: Response) => {
  try {
    const signature = req.headers["sync-signature"] as string | undefined;

    if (!verifySignature(req.body, signature, WEBHOOK_SECRET)) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const data = req.body;
    const { id: syncJobId, status, outputUrl, error } = data;

    if (!syncJobId) {
      return res.status(400).json({ error: "Missing job id" });
    }

    await prisma.videoRequest.updateMany({
      where: { syncJobId },
      data: {
        status: status?.toUpperCase() ?? "UNKNOWN",
        outputUrl: outputUrl ?? null,
        error: error ?? null,
        updatedAt: new Date(),
      },
    });

    return res.json({ message: "Webhook processed" });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default webhookRouter;
