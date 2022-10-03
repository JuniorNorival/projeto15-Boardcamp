import connection from "../database/db.js";
import { categorySchema } from "../schemas/categorySchema.js";

async function categoryValidation(req, res, next) {
  const { name } = req.body;
  const category = await connection.query(
    `SELECT name FROM categories WHERE unaccent(name) ILIKE unaccent($1)`,
    [name]
  );
  if (category.rows.length > 0) {
    res.status(409).send({ message: "Category already registered" });
    return;
  }
  const validation = categorySchema.validate({ name }, { abortEarly: false });
  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    return res.status(400).send(erros);
  }

  next();
}

export { categoryValidation };
