import express from "express"
import cors from "cors"
import userRouter from "./routers/user";
import courseRouter from "./routers/course";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/courses", courseRouter);

app.listen(4000);