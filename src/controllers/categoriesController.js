import connection from "../database/db.js";

async function read(req, res) {
  try {
    const categories = await connection.query("SELECT * FROM categories");

    res.status(200).send(categories.rows);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function create(req, res) {
  const { name } = req.body;

  try {
    await connection.query("INSERT INTO categories (name) VALUES($1)", [name]);
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}
export { read, create };
