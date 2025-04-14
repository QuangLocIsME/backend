import express from "express";
import { changePassword } from "../controllers/changePassword.js";
import authenticateToken from "../middleware/authenticateToken.js";

const SecurityRouter = express.Router();

SecurityRouter.post("/change-password", authenticateToken, changePassword);

export default SecurityRouter;
