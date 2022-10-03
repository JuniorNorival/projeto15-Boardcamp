import express from "express";
import * as customersController from "../controllers/customersController.js";
import { customerValidation } from "../middlewares/customersMiddleware.js";

const router = express.Router();

router.get("/customers", customersController.read);
router.get("/customers/:id", customersController.readForId);
router.post("/customers", customerValidation, customersController.create);
router.put("/customers/:id", customerValidation, customersController.update);

export default router;
