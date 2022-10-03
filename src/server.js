import express from "express";
import cors from "cors";
import categoriesrouter from "./routes/categoriesRouter.js";
import gamesrouter from "./routes/gamesRouter.js";
import customersrouter from "./routes/customersRouter.js";
import rentalsrouter from "./routes/rentalsRouter.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use(categoriesrouter);
app.use(gamesrouter);
app.use(customersrouter);
app.use(rentalsrouter);

app.listen(process.env.PORT, () => {
  console.log("=================================");
  console.log(`Servidor Rodando na porta ${process.env.PORT}`);
  console.log("=================================");
});
