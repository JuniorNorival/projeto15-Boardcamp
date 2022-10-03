import express from "express";
import * as rentalsController from "../controllers/rentalsController.js";
import {
  rentalValidation,
  returnRentalValidation,
} from "../middlewares/rentalsMiddleware.js";
returnRentalValidation;
const router = express.Router();

router.get("/rentals", rentalsController.read);
router.post("/rentals", rentalValidation, rentalsController.create);
router.post(
  "/rentals/:id/return",
  returnRentalValidation,
  rentalsController.returnRental
);
router.delete(
  "/rentals/:id",
  returnRentalValidation,
  rentalsController.deleteRental
);

export default router;
