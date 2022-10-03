import joi from "joi";

const rentalSchema = joi.object({
  customerId: joi.number().required().integer(),
  gameId: joi.number().required().integer(),
  daysRented: joi.number().required().integer(),
});

export { rentalSchema };
