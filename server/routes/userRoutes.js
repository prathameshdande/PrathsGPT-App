import express from 'express';
import { getUserDetails, loginUser, registerUser } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', authMiddleware, getUserDetails);

export default userRouter;