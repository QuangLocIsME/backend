import express from "express";
import CheckUserDetail from "../helper/getUserDetail.js";
import authenticateToken from "../middleware/authenticateToken.js";
import getUserHistory from "../helper/getUserHistory.js";

const Servicesrouter = express.Router();

Servicesrouter.get("/checkUserDetail", authenticateToken, CheckUserDetail);
Servicesrouter.get("/getUserHistory", authenticateToken, getUserHistory);

export default Servicesrouter;

