import { Router } from "express";
import { getChatMessages } from "../controllers/chat.controller.js";


export const chatRoutes = Router();

chatRoutes.use('/:id', getChatMessages)