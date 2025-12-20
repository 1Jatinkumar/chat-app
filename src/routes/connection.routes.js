import { Router } from "express";
import { createConnection, getAllConnections } from "../controllers/connection.controller.js";
import { connectionTypevalidator, createConnectionValidator } from "../middlewares/validator.js";

export const connectionRoutes = Router();


connectionRoutes.get('/', connectionTypevalidator, getAllConnections)
connectionRoutes.post('/', createConnectionValidator, createConnection)












connectionRoutes.use((req, res, next) => {
    return res.status(404).send('<h1>404<h1>');
})