import express from 'express';
const AuthRouter = express.Router();
import registerUser from '../controllers/registerUser.js';
import loginUser from '../controllers/loginUser.js';
//
AuthRouter.post('/register',registerUser);
AuthRouter.post('/login',loginUser);
export default AuthRouter;