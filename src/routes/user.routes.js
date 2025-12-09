import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller.js";

export const userRoute = Router();

userRoute.get('/', getAllUsers);
userRoute.get('/:id', getUserById);
// userRoute.post('/',)
// userRoute.put('/',)
// userRoute.patch('/',)
// userRoute.delete('/',)


// not found route
// authRoutes.all('/', (req, res)=>{
//     res.send(`<h1>404</h1>`);
// })