import express, { Request, Response, NextFunction, Router } from "express";
import path from "path";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
import db from "../index";
import axios from "axios";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { RowDataPacket } from "mysql2"; // Importando tipo para garantir a tipagem
import upload from "../uploads";
import cloudinary from "cloudinary";
import crypto from "crypto";
import transporter from "../services/mailer";

const JWT_SECRET = process.env.JWT_SECRET_CODE || "default-secret-code";
const routes = Router();

dotenv.config();
routes.use(cookieParser());

// 'Pendente','Disponivel', 'Retirado'

const AES_SECRET_KEY = process.env.AES_SECRET_KEY || "crypto-password";

function getAESKey(key: any) {
  return crypto.createHash("sha256").update(key).digest();
}

function encryptPassword(password: string) {
  const key = getAESKey(AES_SECRET_KEY);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, Buffer.alloc(16, 0));
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decryptPassword(encryptedPassword: string) {
  const key = getAESKey(AES_SECRET_KEY);
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      key,
      Buffer.alloc(16, 0)
    );
    let decrypted = decipher.update(encryptedPassword, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Erro ao descriptografar:", error);
    return "Erro na descriptografia";
  }
}

routes.post("/decryptPass", (req: Request, res: Response) => {
  const pass = req.body;
  const password = pass.pass;
  console.log(password);
  res.json(decryptPassword(password));
});

routes.post(
  "/adicionar",
  upload.single("imagem_url"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome_item, data_encontrado, local_encontrado, campus } = req.body;
      const imagem_url = req.file ? req.file.path : null;
      const status = "Disponivel";

      if (!req.file) {
        res.status(400).json({ error: "Nenhuma imagem enviada" });
        return;
      }

      const sqlInsert =
        "INSERT INTO itens_perdidos (nome_item, data_encontrado, local_encontrado, status, imagem_url, campus) VALUES (?, ?, ?, ?, ?, ?)";
      const [result]: any = await db
        .promise()
        .execute(sqlInsert, [
          nome_item,
          data_encontrado,
          local_encontrado,
          status,
          imagem_url,
          campus,
        ]);

      const itemId = result.insertId;

      //log
      const retirado_por = "Não Retirado";
      const situacao = "adicionado";
      const clAluno = "N/D";

      const sqlinsertologs =
        "INSERT INTO logs (id_item, nome_item, data_adicionado, data_movimentacao, localizacao, campus, situacao, retirado_por, clAluno) VALUES (?,?,?,?,?,?,?,?,?)";
      await db
        .promise()
        .execute(sqlinsertologs, [
          itemId,
          nome_item,
          data_encontrado,
          data_encontrado,
          local_encontrado,
          campus,
          situacao,
          retirado_por,
          clAluno,
        ]);
      console.log("Item adicionado na tabela logs");

      res.status(200).json({
        message: "Item adicionado com sucesso!",
        id: itemId,
        imagem: imagem_url,
      });
    } catch (error) {
      console.error("Erro ao adicionar item no log: ", error);
      res.status(500).json({
        message: "Erro ao adicionar item no log.",
      });
    }
  }
);

routes.get("/logs", (req: Request, res: Response) => {
  db.query(
    "SELECT id_log, id_item, nome_item, data_adicionado, data_movimentacao, localizacao, campus, situacao, retirado_por, clAluno FROM logs",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.json(results);
    }
  );
});

routes.get("/itens", async (req: Request, res: Response) => {
  db.query("SELECT * FROM itens_perdidos", (err, results) => {
    if (err) {
      return res.status(500).send("Erro na consulta ao banco de dados");
    }
    res.json(results);
  });
});

routes.get("/mapa/:id", async (req: Request, res: Response) => {
  const id_item = req.params.id;
  db.query(
    "SELECT local_encontrado, campus FROM itens_perdidos WHERE id_item = ?",
    [id_item],
    (err, results) => {
      if (err) {
        return res.status(500).send("Erro na consulta ao banco de dados");
      }
      res.json(results);
    }
  );
});

routes.get("/itens/pendentes/search", async (req: Request, res: Response) => {
  const { query, location, campus } = req.query;

  let sql =
    "SELECT id_item, nome_item, data_encontrado, local_encontrado, imagem_url FROM itens_perdidos WHERE status = ?";

  const params: any[] = ["Pendente"];

  if (query) {
    sql += " AND nome_item LIKE ?";
    params.push(`%${query}%`);
  }

  if (location) {
    sql += " AND local_encontrado LIKE ?";
    params.push(`%${location}%`);
  }

  if (campus) {
    sql += " AND campus = ?";
    params.push(campus);
  }

  console.log(sql);
  console.log(params);

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).send("Erro na consulta ao banco de dados");
    }
    res.json(results);
  });
});

routes.get("/itens/disponiveis/search", async (req: Request, res: Response) => {
  const { query, location, campus } = req.query;

  let sql =
    "SELECT id_item, nome_item, data_encontrado, local_encontrado, imagem_url, campus FROM itens_perdidos WHERE status = ?";

  const params: any[] = ["Disponivel"];

  if (query) {
    sql += " AND nome_item LIKE ?";
    params.push(`%${query}%`);
  }

  if (location) {
    sql += " AND local_encontrado LIKE ?";
    params.push(`%${location}%`);
  }

  if (campus) {
    sql += " AND campus = ?";
    params.push(campus);
  }

  console.log(sql);
  console.log(params);

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).send("Erro na consulta ao banco de dados");
    }
    res.json(results);
  });
});

routes.get("/ping", (req: Request, res: Response) => {
  res.json({ status: "ok" });
  console.log("Ping Ok!");
});

routes.put("/itens/pendentes/:id_item", async (req: Request, res: Response) => {
  const { id_item } = req.params;
  const status = "Disponivel";

  const sql = `UPDATE itens_perdidos SET status = ? WHERE id_item = ?`;
  const [result] = await db.promise().query(sql, [status, id_item]);
});

routes.put("/retirarItem/:id_item", async (req: Request, res: Response) => {
  const { id_item } = req.params;
  const { data_movimentacao, retirado_por } = req.body;
  const situacao = "retirado";

  const sql = `UPDATE logs SET data_movimentacao = ?, situacao = ?, retirado_por = ?, clAluno = ? WHERE id_item = ?`;
  db.promise().query(sql, [data_movimentacao, situacao, retirado_por, id_item]);

  try {
    const response = await axios.delete(
      `https://findit-08qb.onrender.com/itens/excluir/${id_item}`
    );

    res.json({ message: "Rota chamada com sucesso", data: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao chamar outra rota" });
  }
});

routes.delete("/itens/excluir/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(id);

  const sql = "SELECT imagem_url FROM itens_perdidos WHERE id_item = ?";

  interface Iurl extends RowDataPacket {
    imagem_url: string;
  }

  db.query<Iurl[]>(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro Banco de dados", err);
      return res.status(500).json({ error: "Erro ao buscar a imagem" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    const imgUrl = results[0].imagem_url;

    if (!imgUrl) {
      const sqlDelete = "DELETE FROM itens_perdidos WHERE id_item = ?";
      db.query(sqlDelete, [id], (err) => {
        if (err) {
          console.error("Erro ao excluir item", err);
          return res.status(500).json({ error: "Erro ao excluir item" });
        }
        res.json({ message: "Item excluído, mas sem imagem para deletar." });
      });
      return;
    }

    const publicId = path.basename(imgUrl, path.extname(imgUrl));
    const fullPublicId = `uploads/${publicId}`;

    console.log("Tentando excluir imagem no Cloudinary:", fullPublicId);

    cloudinary.v2.uploader.destroy(fullPublicId, async (err, result) => {
      if (err) {
        console.error("Erro ao excluir imagem no Cloudinary", err);
        return res
          .status(500)
          .json({ error: "Erro ao excluir imagem no Cloudinary" });
      }

      console.log("Imagem excluída do Cloudinary", result);

      const sqlDelete = "DELETE FROM itens_perdidos WHERE id_item = ?";
      db.query(sqlDelete, [id], async (err) => {
        if (err) {
          console.error("Erro ao excluir item", err);
          return res.status(500).json({ error: "Erro ao excluir item" });
        }
      });
    });
  });
});

routes.delete("/logs/excluir/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const sql = `DELETE FROM logs WHERE id_log = ?`;
  await db.promise().query(sql, [id]);
});

routes.delete("/logs/excluirIdItem/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const sqlDelete = `DELETE FROM logs WHERE id_item = ?`;

  db.query(sqlDelete, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao excluir o item do DB" });
    }

    if ((results as mysql.ResultSetHeader).affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Item não encontrado para exclusão" });
    }

    res.status(200).json({ message: "Item excluído do DB" });
  });
});

routes.post(
  "/upload/:id",
  upload.single("arquivo"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "Nenhum arquivo enviado" });
      return;
    }
    res.json({ message: "Upload feito!", file: req.file.filename });
  }
);

routes.get("/users", (req: Request, res: Response) => {
  db.query("SELECT * FROM usuarios ", (err, results) => {
    if (err) {
      return res.status(500).send("Erro na consulta ao banco de dados");
    }
    res.json(results);
  });
});

routes.get("/retirada/search", async (req: Request, res: Response) => {
  const { query, location, campus } = req.query;

  let sql =
    "SELECT id_retirada, id_item, cl, nome, email, local_encontrado, situacao, nomeObjeto, imgUrl FROM retirada";

  const params: any[] = [];
  const conditions: string[] = [];

  if (query) {
    conditions.push("nomeObjeto LIKE ?");
    params.push(`%${query}%`);
  }

  if (location) {
    conditions.push("local_encontrado LIKE ?");
    params.push(`%${location}%`);
  }

  if (campus) {
    conditions.push("campus = ?");
    params.push(campus);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  console.log(sql);
  console.log(params);

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).send("Erro na consulta ao banco de dados");
    }
    res.json(results);
  });
});

routes.put("/retirada/aprovar/:id", async (req: Request, res: Response) => {
  const id_retirada = req.params.id;

  const sql = "SELECT id_item, nome, cl FROM retirada WHERE id_retirada = ?";

  db.query(sql, [id_retirada], async (err, results: any[]) => {
    if (results.length === 0) {
      return res.status(404).json({ message: "Retirada não encontrada." });
    }

    const { id_item, nome, cl } = results[0];

    console.log(id_item);
    console.log("LOG" + id_retirada);
    const situacao = "retirado";

    const data_movimentacao = new Date()
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    const sqlUpdate = `UPDATE logs SET data_movimentacao = ?, situacao = ?, retirado_por = ?, clAluno = ? WHERE id_item = ?`;
    await db
      .promise()
      .query(sqlUpdate, [data_movimentacao, situacao, nome, cl, id_item]);

    try {
      await axios
        .delete(`https://findit-08qb.onrender.com/itens/excluir/${id_item}`)
        .catch(() => {});
      await axios
        .delete(
          `https://findit-08qb.onrender.com/retirada/excluir/${id_retirada}`
        )
        .catch(() => {});

      res.status(200).json({ message: "Retirada aprovada com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao chamar outra rota" });
    }
  });
});

routes.delete("/retirada/excluir/:id", (req: Request, res: Response) => {
  const id_retirada = req.params.id;
  db.query(
    "DELETE FROM retirada WHERE id_retirada = ?",
    [id_retirada],
    (err) => {
      if (err) {
        return res.status(500).send("Erro na consulta ao banco de dados");
      }
    }
  );
  res.status(200).send("Retirada excluída com sucesso");
});

routes.post("/itens/retiradas", (req: Request, res: Response): void => {
  const { id_item, nome, cl, email } = req.body;
  const situacao = "pendente";

  const sql =
    "SELECT nome_item, imagem_url, local_encontrado, campus FROM itens_perdidos WHERE id_item = ?";
  db.query(sql, [id_item], (err, result: any) => {
    if (err) {
      console.error("Erro ao buscar item:", err);
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Item não encontrado" });
    }

    const nomeObjeto = result[0].nome_item;
    const imgUrl = result[0].imagem_url;
    const local_encontrado = result[0].local_encontrado;
    const campus = result[0].campus;

    const checkQuery =
      'SELECT * FROM retirada WHERE id_item = ? AND situacao = "pendente"';
    db.query(checkQuery, [id_item], (err, result: any) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao verificar a retirada." });
      }

      if (Array.isArray(result) && result.length > 0) {
        return res
          .status(400)
          .json({ message: "Este item já foi retirado e está pendente." });
      }

      const query =
        "INSERT INTO retirada (id_item, cl, nome, email, local_encontrado, campus, situacao, nomeObjeto, imgUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [
          id_item,
          cl,
          nome,
          email,
          local_encontrado,
          campus,
          situacao,
          nomeObjeto,
          imgUrl,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ message: "Erro ao registrar a retirada." });
          }

          return res
            .status(200)
            .json({ message: "Retirada registrada com sucesso." });
        }
      );
    });
  });
});

routes.post("/user/login", (req: Request, res: Response): void => {
  const { user, password } = req.body;

  if (!user || !password) {
    res.status(400).send({ message: "Usuarios e senha são obrigatorios!" });
    return;
  }

  console.log(user);
  console.log(password);

  try {
    db.query(
      "SELECT * FROM usuarios WHERE user = ?",
      [user],
      (err, results: any) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erro ao consultar o banco de dados", err });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const usuario = results[0];

        const decryptedPassword = decryptPassword(usuario.senha);

        if (decryptedPassword !== password) {
          return res.status(401).json({ message: "Senha incorreta" });
        }

        const payload = {
          userId: usuario.id,
          cargoId: usuario.cargoId,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_CODE!, {
          expiresIn: "1h",
        });

        console.log("Token Enviado!");

        const response = {
          message:
            usuario.cargoId === 1
              ? "Login bem sucedido - adm"
              : "Login bem sucedido",
          token: token as string | null,
          urlImagem: usuario.urlImagem || "",
          user: usuario.user,
          codigo: usuario.cargoId,
          userId: usuario.id,
        };

        return res.status(200).json(response);
      }
    );
  } catch (error) {
    console.error("Erro ao processar login:", error);
    res.status(500).json({ message: "Erro ao processar login", error });
    return;
  }
});

routes.post("/logout", (req: Request, res: Response): void => {
  res.clearCookie("authToken", { path: "/", sameSite: "lax", httpOnly: true });
  res.status(200).json({ message: "Logout realizado com sucesso" });
});

routes.post("/auth-enter", (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Token Não Fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(token);
    res.status(200).json({ cargoId: decoded });
    return;
  } catch (error) {
    res.status(403).json({ message: "Erro no token" });
    return;
  }
});

routes.get("/user", (req: Request, res: Response): void => {
  try {
    db.query("SELECT * FROM usuarios", (err, results: any) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao consultar os usuários", err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Nenhum usuário encontrado" });
      }
      return res.status(200).json({ usuarios: results });
    });
  } catch (error) {
    console.error("Erro ao processar consulta:", error);
    res.status(500).json({ message: "Erro ao processar consulta", error });
  }
});

routes.delete("/user/delete/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const sql = "SELECT urlImagem FROM usuarios WHERE id = ?";

  interface Iurl extends RowDataPacket {
    imagem_url: string;
  }

  db.query<Iurl[]>(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro Banco de dados", err);
      return res.status(500).json({ error: "Erro ao buscar a imagem" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario não encontrado" });
    }

    const urlImagem = results[0].urlImagem;

    if (!urlImagem) {
      const sqlDelete = "DELETE FROM usuarios WHERE id = ?";
      db.query(sqlDelete, [id], (err) => {
        if (err) {
          console.error("Erro ao excluir Usuario", err);
          return res.status(500).json({ error: "Erro ao excluir Usuario" });
        }
        res.json({ message: "Usuario excluído, mas sem imagem para deletar." });
        console.log("Usuario excluído, mas sem imagem para deletar");
      });
      return;
    }

    const publicId = path.basename(urlImagem, path.extname(urlImagem));
    const fullPublicId = `uploadsUser/${publicId}`;

    console.log("Tentando excluir imagem no Cloudinary:", fullPublicId);

    cloudinary.v2.uploader.destroy(fullPublicId, async (err, result) => {
      if (err) {
        console.error("Erro ao excluir imagem no Cloudinary", err);
        return res
          .status(500)
          .json({ error: "Erro ao excluir imagem no Cloudinary" });
      }

      console.log("Imagem excluída do Cloudinary", result);

      db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
        if (err) {
          return res.status(404).json({ message: "Erro ao deletar", err });
        }
        return res
          .status(202)
          .json({ message: "Usuario Deletado Com Sucesso" });
      });
    });
  });
});

routes.post(
  "/user/create",
  upload.single("imgUserPhoto"),
  (req: Request, res: Response): void => {
    const { user, senha, cargo_id } = req.body;
    const imgUserPhoto = req.file ? req.file.path : null;

    if (!user || !senha || !cargo_id) {
      console.log("imagem" + imgUserPhoto);
      res.status(400).json({ message: "Todos os campos são obrigatórios!" });
      return;
    }

    if (!req.file) {
      console.log("imagem" + imgUserPhoto);
      res.status(400).json({ message: "A imagem é obrigatória" });
      return;
    }

    const encryptedPassword = encryptPassword(senha);

    db.query(
      "SELECT * FROM usuarios WHERE user = ?",
      [user],
      (err, results: RowDataPacket[]) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erro ao verificar o usuário", err });
        }

        if (results.length > 0) {
          return res
            .status(400)
            .json({ message: "Já existe um usuário com este nome" });
        }

        db.query(
          "INSERT INTO usuarios (user, senha, urlImagem, cargoId) VALUES (?, ?, ?, ?)",
          [user, encryptedPassword, imgUserPhoto, cargo_id],
          (err, results: any) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Erro ao inserir o usuário", err });
            }
            return res.status(201).json({
              message: "Usuário inserido com sucesso!",
              usuarioId: results.insertId,
            });
          }
        );
      }
    );
  }
);

routes.delete("/users/remove/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
    if (err) {
      res.status(401).json({ message: "Erro ao excluir usuario" });
    }
  });
  res.status(200).send({ message: "Usuario apagado com sucesso!" });
});

routes.get("/itens/contagem-itens", (req: Request, res: Response) => {
  const campus = req.query.campus;
  const campusNumber = campus ? parseInt(campus as string) : 0;

  let queryBase = "SELECT nome_item, COUNT(*) AS count FROM logs";
  let queryLocal = "SELECT localizacao, COUNT(*) AS count FROM logs";

  if (campusNumber !== 0) {
    queryBase += ` WHERE campus = ${campus}`;
    queryLocal += ` WHERE campus = ${campus}`;
  }

  queryBase += " GROUP BY nome_item ORDER BY count DESC LIMIT 6";
  queryLocal += " GROUP BY localizacao ORDER BY count DESC LIMIT 6";

  console.log(queryBase);

  //BUSCA ITENS PELO NOME
  db.query(
    queryBase,
    (
      err: mysql.QueryError | null,
      resultItensNome: { count: Number; local: string }
    ) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Erro ao buscar nomes com mais itens achados" });
      }
      //BUSCA ITENS PELO LOCAL
      db.query(
        queryLocal,
        (
          err: mysql.QueryError | null,
          resultItensLocal: { count: number; local: string }
        ) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Erro ao buscar locais com mais itens achados" });
          }
          db.query(
            //BUSCAR TODOS OS ITENS
            "SELECT COUNT(*) AS count FROM logs",
            (
              err: mysql.QueryError | null,
              resultTotalItens: { count: number }[]
            ) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Erro ao buscar total dos itens" });
              }
              //BUSCAR APENAS ITENS NAO RETIRADOS
              db.query(
                "SELECT COUNT(*) AS count FROM logs WHERE situacao = 'adicionado'",
                (
                  err: mysql.QueryError | null,
                  resultNaoRetirados: { count: number }[]
                ) => {
                  if (err) {
                    return res
                      .status(500)
                      .json({ error: "Erro ao buscar itens retirados" });
                  }
                  //BUSCAR APENAS ITENS RETIRADOS
                  db.query(
                    "SELECT COUNT(*) AS count FROM logs WHERE situacao = 'retirado'",
                    (
                      err: mysql.QueryError | null,
                      resultRetirados: { count: number }[]
                    ) => {
                      if (err) {
                        return res.status(500).json({
                          error: "Erro ao buscar itens não retirados",
                        });
                      }
                      res.json({
                        retirados: resultRetirados[0].count,
                        naoRetirados: resultNaoRetirados[0].count,
                        totalItens: resultTotalItens[0].count,
                        itensPorLocal: resultItensLocal,
                        itensPorNome: resultItensNome,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

routes.get("/api/campus/:campus", (req: Request, res: Response) => {
  const campus = req.params.campus;
  let params: any;

  let sql = "SELECT * FROM localizacoes ";

  if (Number(campus) != 0) {
    sql += " WHERE campus = ?";
    params = [campus];
  } else {
    params = [];
  }

  db.query(sql, params, (err, result) => {
    if (err) res.status(403).json({ message: "Erro ao buscar Localizações" });

    res.json(result);
  });
});

routes.get("/api/campusDesc/:descricao", (req: Request, res: Response) => {
  const descricao = req.params.descricao;
  const campus = req.query.campus;
  let params: any;

  let sql = "SELECT * FROM localizacoes ";

  if (descricao != "") {
    sql += " WHERE descricao = ? AND campus = ?";
    params = [descricao, campus];
  } else {
    params = [];
  }
  db.query(sql, params, (err, result) => {
    if (err) res.status(403).json({ message: "Erro ao buscar Localizações" });

    res.json(result);
  });
});

routes.get("/api/campusNome/:nome", (req: Request, res: Response) => {
  const nome = req.params.nome;
  const campus = 1;
  let params: any;

  let sql = "SELECT * FROM localizacoes ";

  if (nome != "") {
    sql += " WHERE nome = ? AND campus = ?";
    params = [nome, campus];
  } else {
    params = [];
  }
  db.query(sql, params, (err, result) => {
    if (err) res.status(403).json({ message: "Erro ao buscar Localizações" });

    res.json(result);
  });
});

routes.post("/api/adicionarLocal", (req: Request, res: Response) => {
  const { nome, descricao, localizacao, campus } = req.body;
  const { longitude, latitude } = localizacao;
  const criado_em = new Date().toISOString().slice(0, 19).replace("T", " ");

  const sqlSelect =
    "SELECT COUNT(*) AS count FROM localizacoes WHERE nome = ? AND campus = ?";

  db.query(sqlSelect, [nome, campus], (err, result: mysql.RowDataPacket[]) => {
    if (err) {
      console.error("Erro ao realizar a consulta", err);
      return res.status(500).json({ message: "Erro ao verificar local" });
    }

    if (result[0]?.count > 0) {
      return res
        .status(400)
        .json({ message: "Já existe um local com esse nome nesse campus" });
    }

    const sql =
      "INSERT INTO localizacoes (nome, descricao, latitude, longitude, campus, criado_em) VALUES (?,?,?,?,?,?)";
    const values = [nome, descricao, latitude, longitude, campus, criado_em];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Ocorreu um erro ao inserir a localização nova",
          error: err,
        });
      }

      console.log("Localização inserida");
      return res.status(201).json({
        message: "Localização inserida com sucesso!",
      });
    });
  });
});

routes.get("/api/descricao/:nome", (req: Request, res: Response) => {
  const nome = req.params.nome;
  const sql = "SELECT descricao FROM localizacoes where nome = ?";

  db.query(sql, [nome], (err, results) => {
    if (err) {
      return res
        .status(404)
        .json({ message: "Ococrreu um erro ao buscar a descricao", err: err });
    }

    return res.status(200).json({
      message: "Descricao encontrada com sucesso!",
      descricao: results,
    });
  });
});

routes.delete("/api/deletarLocal/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const sql = "DELETE FROM localizacoes WHERE id = ?";

  db.query(sql, [id], (err, result: mysql.ResultSetHeader) => {
    if (err) {
      res.status(500).json({ message: "Ocorreu um erro ao deletar o local" });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Local deletado com sucesso!" });
    } else {
      res.status(404).json({ message: "Local não encontrado." });
    }
  });
});

// Envio de Email

routes.post("/api/sendMail", async (req: Request, res: Response) => {
  const { to, text, subject, html } = req.body;
  const fullHtml = `${html.header}${html.greeting}${html.instructions}${html.closing}${html.link}`;

  try {
    const info = await transporter.sendMail({
      from: `"FindIt" <${process.env.userMAIL}>`,
      to,
      subject,
      text,
      html: fullHtml,
    });
    res.status(200).json({ EmailEnviado: info.messageId });
  } catch (error) {
    res.status(500).json({ ErroEmail: error });
  }
});

export default routes;
