import connection from "../database/db.js";

async function read(req, res) {
  const { name } = req.query;

  try {
    if (!name) {
      const games = (
        await connection.query(
          `SELECT games.*, categories.name as "categoryName" FROM games JOIN 
        categories ON games."categoryId"=categories.id`
        )
      ).rows;

      res.status(200).send(games);
      return;
    }

    const games = (
      await connection.query(
        `SELECT games.*, categories.name as "categoryName" FROM games JOIN 
        categories ON games."categoryId"=categories.id WHERE games.name ILIKE '${name}%'`
      )
    ).rows;

    res.status(200).send(games);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function create(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    await connection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay" ) VALUES ($1,$2,$3,$4,$5)`,
      [name, image, stockTotal, categoryId, pricePerDay * 100]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}
export { read, create };
