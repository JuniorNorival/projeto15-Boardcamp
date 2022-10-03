import joi from "joi";

const customersSchema = joi.object({
  name: joi.string().required().trim(),
  phone: joi.string().min(10).max(11).required().trim(),
  cpf: joi.string().min(11).max(11).required().trim(),
  birthday: joi.date().required(),
});

export { customersSchema };
