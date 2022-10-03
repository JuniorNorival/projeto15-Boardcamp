import connection from "../database/db.js";
import moment from "moment";

async function read(req, res) {
  const { customerId, gameId } = req.query;
  let rentals;

  try {
    if (customerId) {
      rentals = (
        await connection.query(
          `SELECT rentals.*, json_build_object('id',customers.id,'name', customers.name) AS customers,
      json_build_object('id',games.id,'name',games.name,'categoryId',games."categoryId", 'categoryName',categories.name) AS game
      FROM rentals 
      JOIN customers ON "customerId"= customers.id 
      JOIN games ON "gameId"=games.id 
      JOIN categories ON games."categoryId"=categories.id
      WHERE "customerId"=$1`,
          [customerId]
        )
      ).rows;

      rentals.forEach((rent) => {
        rent.rentDate = rent.rentDate.toISOString().split("T")[0];
        rent.returnDate = rent.returnDate?.toISOString().split("T")[0];
      });
      res.send(rentals);
      return;
    }
    if (gameId) {
      rentals = (
        await connection.query(
          `SELECT rentals.*, json_build_object('id',customers.id,'name', customers.name) AS customers,
      json_build_object('id',games.id,'name',games.name,'categoryId',games."categoryId", 'categoryName',categories.name) AS game
      FROM rentals 
      JOIN customers ON "customerId"= customers.id 
      JOIN games ON "gameId"=games.id 
      JOIN categories ON games."categoryId"=categories.id
      WHERE "customerId"=$1`,
          [gameId]
        )
      ).rows;

      rentals.forEach((rent) => {
        rent.rentDate = rent.rentDate.toISOString().split("T")[0];
        rent.returnDate = rent.returnDate?.toISOString().split("T")[0];
      });
      res.send(rentals);
      return;
    }
    rentals = (
      await connection.query(
        `SELECT rentals.*, json_build_object('id',customers.id,'name', customers.name) AS customers,
      json_build_object('id',games.id,'name',games.name,'categoryId',games."categoryId", 'categoryName',categories.name) AS game
      FROM rentals 
      JOIN customers ON "customerId"= customers.id 
      JOIN games ON "gameId"=games.id 
      JOIN categories ON games."categoryId"=categories.id`
      )
    ).rows;

    rentals.forEach((rent) => {
      rent.rentDate = rent.rentDate.toISOString().split("T")[0];
      rent.returnDate = rent.returnDate?.toISOString().split("T")[0];
    });
    res.send(rentals);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function create(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const rentDate = new Date();
  rentDate.setHours(0, 0, 0, 0);

  const game = (
    await connection.query(`SELECT * FROM games WHERE id=$1`, [gameId])
  ).rows;

  if (game[0].stockTotal === 0) {
    return res.status(400).send({ message: "All games have been rented" });
  }

  try {
    await connection.query(
      `INSERT INTO rentals 
      ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        null,
        daysRented * game[0].pricePerDay,
        null,
      ]
    );
    await connection.query(`UPDATE games SET "stockTotal"=$1 WHERE id=$2`, [
      game[0].stockTotal - 1,
      gameId,
    ]);
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function returnRental(req, res) {
  const { id } = req.params;
  const returnDate = new Date();
  returnDate.setHours(0, 0, 0, 0);

  const dayToday = moment(returnDate);

  const rental = (
    await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id])
  ).rows;
  const dayRental = moment(rental[0].rentDate);

  const dayFee = moment.duration(dayToday.diff(dayRental));

  const game = (
    await connection.query(`SELECT * FROM games WHERE id=$1`, [
      rental[0].gameId,
    ])
  ).rows;

  const delayFee = dayFee.asDays() * game[0].pricePerDay;

  try {
    await connection.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee"=$2 WHERE id = $3`,
      [returnDate, delayFee, id]
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function deleteRental(req, res) {
  const { id } = req.params;
  try {
    await connection.query(`DELETE FROM rentals WHERE id =$1`, [id]);
    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}
export { read, create, returnRental, deleteRental };
