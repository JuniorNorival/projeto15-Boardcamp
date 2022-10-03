import joi from "joi";

const gameSchema = joi.object({
  name: joi.string().required().trim().min(3),
  stockTotal: joi.number().required().integer().min(1),
  pricePerDay: joi.number().required().min(1),
  categoryId: joi.number().required().integer().min(1),
  image: joi.string().uri().required(),
});
export { gameSchema };
