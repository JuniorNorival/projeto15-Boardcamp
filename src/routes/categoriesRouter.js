import express from "express";
import * as categoriesControler from "../controllers/categoriesController.js";
import { categoryValidation } from "../middlewares/categoryMiddleware.js";

const router = express.Router();

router.get("/categories", categoriesControler.read);
router.post("/categories", categoryValidation, categoriesControler.create);

export default router;
