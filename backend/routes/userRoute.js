import express from 'express';
import { loginUser, registerUser , fullDataUser} from '../controllers/userController.js';



const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.get('/details', fullDataUser);

export default userRouter;