import { customersSchema } from "../schemas/customersSchema.js";

async function customerValidation(req, res, next) {
  const validation = customersSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    return res.status(400).send(erros);
  }

  next();
}

export { customerValidation };
