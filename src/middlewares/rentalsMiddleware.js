import connection from "../database/db.js";
import { rentalSchema } from "../schemas/rentalsSchema.js";

async function rentalValidation(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;
  const validation = rentalSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    return res.status(400).send(erros);
  }
  try {
    const customer = (
      await connection.query(`SELECT * from customers WHERE id=$1`, [
        customerId,
      ])
    ).rows;
    const game = (
      await connection.query(`SELECT * from games WHERE id=$1`, [gameId])
    ).rows;

    if (customer.lenght === 0 || game.length === 0 || daysRented < 0) {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }

  next();
}

async function returnRentalValidation(req, res, next) {
  const { id } = req.params;

  try {
    const rental = (
      await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id])
    ).rows;

    if (!rental[0]) {
      return res.sendStatus(404);
    }
    if (rental[0].returnDate !== null) {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
  next();
}
export { rentalValidation, returnRentalValidation };
