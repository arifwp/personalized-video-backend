import express from "express";
import { generatePersonalizedVideo } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.post("/video", generatePersonalizedVideo);

export default videoRouter;
