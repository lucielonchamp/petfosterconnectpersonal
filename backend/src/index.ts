import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import router from "./routes/router";
import { specs } from "./swagger";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
