import { createHmac, timingSafeEqual } from "crypto";
import "dotenv/config";

export const WEBHOOK_SECRET = process.env.WEBHOOK_SIGNING_SECRET || "";

export function verifySignature(
  payload: Record<string, any>,
  signature: string | undefined,
  secret: string
): boolean {
  try {
    if (!signature) return false;

    const match = signature.match(/t=(\d+),v1=(.+)/);
    if (!match) return false;

    const [, timestamp, receivedSignature] = match;

    if (!timestamp || !receivedSignature) return false;

    const expectedSignature = createHmac("sha256", secret)
      .update(`${timestamp}.${JSON.stringify(payload)}`)
      .digest("hex");

    return timingSafeEqual(
      Buffer.from(receivedSignature, "utf8"),
      Buffer.from(expectedSignature, "utf8")
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}
