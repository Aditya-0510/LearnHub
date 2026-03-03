import express from "express";
import cors from "cors";
import userRouter from "./routers/user";
import courseRouter from "./routers/course";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/user", userRouter);
app.use("/api/courses", courseRouter);

export default app;