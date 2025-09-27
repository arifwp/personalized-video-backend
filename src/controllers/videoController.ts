import "dotenv/config";
import { Request, Response } from "express";
import { PENDING } from "../constants/statusResponse";
import api from "../lib/axiosInstance";
import { prisma } from "../lib/prisma";
import { stringify } from "querystring";

export const generatePersonalizedVideo = async (
  req: Request,
  res: Response
) => {
  try {
    const { actorId, name, city, phone } = req.body.request;

    if (!actorId || !name || !city || !phone) {
      console.log("req", req.body);

      return res.status(400).json({ message: "Missing required fields" });
    }

    const actorIdInt = Number(actorId);
    if (isNaN(actorIdInt)) {
      return res.status(400).json({ message: "Invalid actorId" });
    }

    const phoneInt = Number(actorId);
    if (isNaN(phoneInt)) {
      return res.status(400).json({ message: "Phone must be number" });
    }

    const sourceUrl =
      "https://onedrive.live.com/?qt=allmyphotos&photosData=%2Fshare%2F6D834994D9580DCB%21s5cbaa04579ce4426a645c2a858233544%3Fithint%3Dvideo%26e%3D8mKlVX%26migratedtospo%3Dtrue&cid=6D834994D9580DCB&id=6D834994D9580DCB%21s5cbaa04579ce4426a645c2a858233544&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3YvYy82ZDgzNDk5NGQ5NTgwZGNiL0VVV2d1bHpPZVNaRXBrWENxRmdqTlVRQl95SG00VS1LS1JGeTMxelNQZmdRUlE%5FZT04bUtsVlg&v=photos";

    const videoRequest = await prisma.videoRequest.create({
      data: {
        actorId: actorIdInt,
        name,
        city,
        phone,
        videoUrl: sourceUrl,
        audioUrl: sourceUrl,
        status: PENDING,
      },
    });

    const webhookUrl = `${process.env.APP_URL}/api/v1/webhooks/sync`;

    const syncResponse = await api.post("/v2/generate", {
      model: "lipsync-2",
      input: [
        { type: "video", url: sourceUrl },
        { type: "audio", url: sourceUrl },
      ],
      outputFileName: `personalized_${videoRequest.id}`,
      webhookUrl,
    });

    console.log("response:", syncResponse.data);

    await prisma.videoRequest.update({
      where: { id: videoRequest.id },
      data: {
        syncJobId: syncResponse.data.id,
        status: syncResponse.data.status || PENDING,
        outputUrl: syncResponse.data.outputUrl ?? null,
      },
    });

    return res.status(200).json({
      message: "Video generation started",
      data: syncResponse.data,
    });
  } catch (error: any) {
    console.error("Error generating video:", error);
    return res.status(500).json({
      error: "Failed to generate video",
      details: error.message,
    });
  }
};
