import { Router } from "express";
import { getAllRequests, UserRequestHandler, UserRequestActionHandler } from "../controllers/requests.controller.js";
import { requestActionValidator, userRequestValidator } from "../middlewares/validator.js";

export const requestRoutes = Router();

requestRoutes.get('/', getAllRequests);

// create request
requestRoutes.post('/', userRequestValidator, UserRequestHandler);
requestRoutes.post('/:action', requestActionValidator, UserRequestActionHandler);