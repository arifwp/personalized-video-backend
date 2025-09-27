import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import videoRouter from "./routes/videoRoutes";

const app: Application = express();

const PORT = process.env.PORT || 3001;
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use("/api/v1/create", videoRouter);
app.use("/api/v1/webhooks", videoRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
