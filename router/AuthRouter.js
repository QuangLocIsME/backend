import express from 'express';
const AuthRouter = express.Router();
import registerUser from '../controllers/registerUser.js';
import loginUser from '../controllers/loginUser.js';
import logoutUser from '../controllers/logoutUser.js';
import verifyToken from '../controllers/verifyToken.js';
import refreshToken from '../controllers/refreshToken.js';
import { changePassword } from '../controllers/changePassword.js';
import authenticateToken from '../middleware/authenticateToken.js';

//ENDPOINT
AuthRouter.post('/register', registerUser);
AuthRouter.post('/login', loginUser);
AuthRouter.post('/logout', logoutUser);
AuthRouter.get('/verify', verifyToken);
AuthRouter.post('/refresh', refreshToken);
AuthRouter.post('/change-password', authenticateToken, changePassword);

export default AuthRouter;