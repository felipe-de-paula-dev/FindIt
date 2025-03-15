"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const mysql2_1 = __importDefault(require("mysql2"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
console.log(process.env.DB_HOST);
const db = mysql2_1.default.createConnection({
    host: "143.106.241.4",
    user: "cl204218",
    password: "cl*10112007",
    database: "cl204218",
});
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
    }
    else {
        console.log("Conectado ao MySQL");
    }
});
exports.default = db;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(routes_1.default);
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
