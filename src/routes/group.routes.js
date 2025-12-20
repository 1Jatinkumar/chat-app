import { Router } from "express";
import { getGroupsByUser } from "../controllers/group.controller.js"

export const groupRoutes = Router();

groupRoutes.get('/:id', getGroupsByUser);