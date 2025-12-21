import express from "express";
import routes from "./routes/routes";
import { Pool } from 'pg';
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432, 
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

db.connect((err, client, release) => {
  if (err) {
    console.error("Erro ao conectar ao PostgreSQL:", err.stack);
  } else {
    console.log("Conectado ao PostgreSQL com sucesso!");
    release();
  }
});

export default db;

const app = express();

const corsOptions = {
  origin: [
    "https://find.felipedepauladev.site",
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());

app.use(routes);

app.use(cookieParser());

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
