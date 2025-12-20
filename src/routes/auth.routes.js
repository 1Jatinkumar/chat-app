import { Router } from "express";
import { register, forgotPassword, login, authRefresh } from "../controllers/auth.controller.js";
import { emailValidator, passwordValidator } from "../middlewares/validator.js";
import { AccessTokenValidator } from "../middlewares/AccessTokenValidator.middleware.js";

export const authRoutes = Router();

// post routes
authRoutes.post('/register', emailValidator, passwordValidator, register);
authRoutes.post('/login', emailValidator, passwordValidator, login);
authRoutes.get('/refresh', authRefresh);


authRoutes.use(AccessTokenValidator)
authRoutes.post('/forgotPassword', forgotPassword);
// authRoutes.put('/',)
// authRoutes.patch('/',)
// authRoutes.delete('/',)










// not found route
authRoutes.all('/', (req, res) => {
    res.send(`<h1>404</h1>`);
})