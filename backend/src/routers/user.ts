import { Router } from "express";
import { signIn, signUp, getAllUsers } from "../controllers/userControler";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", signUp)
userRouter.post("/signin", signIn)

export default userRouter