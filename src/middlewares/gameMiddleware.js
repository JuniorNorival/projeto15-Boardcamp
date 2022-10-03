import connection from "../database/db.js";
import { gameSchema } from "../schemas/gameSchema.js";

async function gameValidation(req, res, next) {
  const { name, categoryId } = req.body;

  const category = await connection.query(
    `SELECT name FROM games WHERE unaccent(name) ILIKE unaccent($1)`,
    [name]
  );
  if (category.rows.length > 0) {
    res.status(409).send({ message: "Game already registered" });
    return;
  }

  const idCategory = await connection.query(
    `SELECT id FROM categories WHERE unaccent(id)= unaccent($1)`,
    [categoryId]
  );

  if (idCategory.rows.length === 0) {
    res.status(400).send({ message: "Category does not exist" });
    return;
  }
  const validation = gameSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    return res.status(400).send(erros);
  }

  next();
}

export { gameValidation };
