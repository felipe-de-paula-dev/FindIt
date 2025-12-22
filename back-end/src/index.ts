import express from "express";
import routes from "./routes/routes";
import mysql from "mysql2"; // Voltando para mysql2
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { setupDatabase } from "./database/init";

dotenv.config();

// Configuração do Pool para MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

// Teste de conexão (MySQL usa getConnection)
db.getConnection((err, connection) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err.message);
  } else {
    console.log("Conectado ao MySQL com sucesso!");
    connection.release();
  }
});

export default db;

const app = express();

const corsOptions = {
  origin: [
    "https://findit.felipedepauladev.site",
    "http://localhost:5173" // Adicionei os locais para facilitar seu teste
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

// Servindo a pasta de uploads local
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use(routes);

setupDatabase(db);

const PORT = process.env.PORT || 3335;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});