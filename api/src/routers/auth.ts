import { Router } from "express";

import { login, upsert, getMe } from "../controllers/auth";

const AuthRouter = Router();
AuthRouter.post("/login", login);
AuthRouter.post("/register", upsert);
AuthRouter.post("/getMe/:userId", getMe);
export default AuthRouter;
