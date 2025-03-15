import express from "express";
import routes from "./routes/routes";
import mysql, { Connection } from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const db: Connection = mysql.createConnection({
  host: "143.106.241.4",
  user: "cl204218",
  password: "cl*10112007",
  database: "cl204218",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
  } else {
    console.log("Conectado ao MySQL");
  }
});

export default db;

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(routes);

dotenv.config();
app.use(cookieParser());

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
