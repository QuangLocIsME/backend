import express from "express";
import { changePassword } from "../controllers/changePassword.js";
import authenticateToken from "../middleware/authenticateToken.js";
import createSecretkey from "../controllers/2fa/createSecretkey.js";
import get2faStatus from "../controllers/2fa/get2faStatus.js";
import disable2fa from "../controllers/2fa/disable2fa.js";
import validateOTP from "../controllers/2fa/checkvaildOTP.js";

const SecurityRouter = express.Router();

SecurityRouter.post("/change-password", authenticateToken, changePassword);
SecurityRouter.post("/generatekey", authenticateToken, createSecretkey);
SecurityRouter.get("/2fa-status", authenticateToken, get2faStatus);
SecurityRouter.post("/disable-2fa", authenticateToken, disable2fa);
SecurityRouter.post("/validate-otp", validateOTP);

export default SecurityRouter;
