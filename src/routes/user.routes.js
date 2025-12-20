import { Router } from "express";
import { getAllUsers, searchUser } from "../controllers/user.controller.js";
import { userSearchValidator } from "../middlewares/validator.js";

export const userRoutes = Router();

userRoutes.get('/', getAllUsers);
userRoutes.post('/search', userSearchValidator, searchUser);



// not found route
userRoutes.use((req, res, next) => {
    return res.status(404).send(`<h1>404</h1>`);
})