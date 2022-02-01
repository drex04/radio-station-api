import express from "express";
import cors from "cors";
import route from "./routes/index.js";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/api", route);
app.use((err, req, res, next) => {
  res.status(400).json({
    error: err.message,
  });
});

export default app;
