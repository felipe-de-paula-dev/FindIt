import { Pool } from 'mysql2/promise';

export const setupDatabase = async (connection: Pool) => {
    console.log("🛠️ Iniciando verificação do esquema MySQL...");

    const tables = [
        `CREATE TABLE IF NOT EXISTS itens_perdidos (
            id_item INT AUTO_INCREMENT PRIMARY KEY,
            nome_item VARCHAR(255),
            data_encontrado DATETIME,
            local_encontrado VARCHAR(255),
            status VARCHAR(50),
            imagem_url TEXT,
            campus VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS logs (
            id_log INT AUTO_INCREMENT PRIMARY KEY,
            id_item INT,
            nome_item VARCHAR(255),
            data_adicionado DATETIME,
            data_movimentacao DATETIME,
            local_encontrado VARCHAR(255),
            campus VARCHAR(100),
            situacao VARCHAR(50),
            retirado_por VARCHAR(255),
            clAluno VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS retirada (
            id_retirada INT AUTO_INCREMENT PRIMARY KEY,
            id_item INT,
            cl VARCHAR(100),
            nome VARCHAR(255),
            email VARCHAR(255),
            local_encontrado VARCHAR(255),
            campus VARCHAR(100),
            situacao VARCHAR(50),
            nomeObjeto VARCHAR(255),
            imgUrl TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user VARCHAR(255) UNIQUE,
            senha TEXT,
            urlImagem TEXT,
            cargoId INT
        )`,
        `CREATE TABLE IF NOT EXISTS localizacoes (
            id_localizacao INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255),
            descricao TEXT,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            campus VARCHAR(100),
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    try {
        for (const sql of tables) {
            await connection.query(sql);
        }

        // Criar um usuário administrador padrão caso a tabela esteja vazia
        const [rows]: any = await connection.query("SELECT COUNT(*) as count FROM usuarios");
        if (rows[0].count === 0) {
            const adminUser = "admin";
            const adminPass = "232a95e89a9caff040fe6622a78eaf5e"; 
            await connection.query(
                "INSERT INTO usuarios (user, senha, cargoId) VALUES (?, ?, ?)",
                [adminUser, adminPass, 1]
            );
            console.log("👤 Usuário padrão criado: admin / admin");
        }

        console.log("✅ Banco de dados sincronizado!");
    } catch (err) {
        console.error("❌ Erro ao inicializar tabelas:", err);
    }
};