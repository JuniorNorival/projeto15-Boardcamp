import { ClientRequest } from "http";
import connection from "../database/db.js";

async function read(req, res) {
  const { cpf } = req.query;

  try {
    if (!cpf) {
      const customers = (await connection.query(`SELECT * FROM customers`))
        .rows;
      res.status(200).send(customers);
      return;
    }

    const customers = (
      await connection.query(`SELECT * FROM customers WHERE cpf LIKE '$1%'`, [
        cpf,
      ])
    ).rows;
    res.status(200).send(customers);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function readForId(req, res) {
  const { id } = req.params;
  try {
    const customers = (
      await connection.query(`SELECT * FROM customers WHERE id=$1`, [id])
    ).rows;

    if (customers.length === 0) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send(customers);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function create(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  const client = (
    await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf])
  ).rows;

  if (client.length > 0) {
    res.status(409).send({ message: "This CPF is already being used" });
    return;
  }
  try {
    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES($1,$2,$3,$4)",
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;
  const client = (
    await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf])
  ).rows;
  if (client.id !== id && client.length > 0) {
    res.status(409).send({ message: "This CPF is already being used" });
    return;
  }
  try {
    await connection.query(
      "UPDATE customers SET name=$1, phone=$2,cpf=$3,birthday=$4 WHERE id=$5",
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

export { read, readForId, create, update };
