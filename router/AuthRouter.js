import express from 'express';
const AuthRouter = express.Router();
import registerUser from '../controllers/registerUser.js';
import loginUser from '../controllers/loginUser.js';
import logoutUser from '../controllers/logoutUser.js';
//ENDPOINT
AuthRouter.post('/register',registerUser);
AuthRouter.post('/login',loginUser);
AuthRouter.post('/logout',logoutUser);
export default AuthRouter;