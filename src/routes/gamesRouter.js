import express from "express";
import * as gamesControler from "../controllers/gamesController.js";
import { gameValidation } from "../middlewares/gameMiddleware.js";

const router = express.Router();

router.get("/games", gamesControler.read);
router.post("/games", gameValidation, gamesControler.create);

export default router;
