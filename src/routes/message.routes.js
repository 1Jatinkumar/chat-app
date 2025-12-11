import { Router } from "express"
import { getMessages, sendFile, sendMessage } from "../controllers/message.controller.js";
import { postMessageValidator } from "../middlewares/validator.js";
import { customisedMulter } from "../middlewares/fileUpload.middleware.js";

export const messsageRoute = Router();

messsageRoute.get('/', getMessages)
messsageRoute.post('/message', postMessageValidator, sendMessage)
messsageRoute.post('/file', customisedMulter, sendFile)