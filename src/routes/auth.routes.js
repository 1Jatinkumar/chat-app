import { Router } from "express";
import { createUser, forgotPassword, login } from "../controllers/auth.controller.js";

export const authRoutes = Router();

// post routes
authRoutes.post('/', createUser);
authRoutes.post('/login', login)
authRoutes.post('/forgotPassword', forgotPassword);
// authRoutes.put('/',)
// authRoutes.patch('/',)
// authRoutes.delete('/',)










// not found route
authRoutes.all('/', (req, res)=>{
    res.send(`<h1>404</h1>`);
})