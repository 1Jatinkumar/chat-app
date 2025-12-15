import { Router } from "express";
import { createConnection, getConnections } from "../controllers/connection.controller.js";
import { createConnectionValidator } from "../middlewares/validator.js";

export const connectionRoutes = Router();


connectionRoutes.get('/', getConnections)
connectionRoutes.post('/', createConnectionValidator, createConnection)












connectionRoutes.use((req, res, next) => {
    return res.status(404).send('<h1>404<h1>');
})