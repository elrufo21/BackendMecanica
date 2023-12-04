import { pool } from "../db.js";

import jwt from "jsonwebtoken";

import crypto from "crypto";

export const login = async (req, res) => {
  const { username, password } = req.body;
  const hash = crypto.createHash("md5").update(password).digest("hex");
  try {
    const user = await pool.query(
      `SELECT * FROM admin WHERE email = ? AND password = ?`,
      [username, hash]
    );

    if (user.length > 0) {
      // Elimina la contraseña del objeto user
      delete user[0][0].password;
      console.log(user[0]);

      const token = jwt.sign(
        {
          username: user[0][0].username,
          email: user[0][0].email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 60000,
        }
      );

      // Responde con el token JWT y el objeto user sin la contraseña
      res.json({
        token,
      });
    } else {
      // Responde con un error
      res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error.message,
    });
  }
};

//Una funcion para crear un nuevo admin, la contraseña tiene que ser encriptada.
export const createAdmin = async (req, res) => {
  const { name, surnames, email, password } = req.body;
  const hash = crypto.createHash("md5").update(password).digest("hex");
  try {
    const [rows] = await pool.query(
      `INSERT INTO admin(name, surnames, email, password) VALUES(?,?,?,?)`,
      [name, surnames, email, hash]
    );
    res.send({
      id: rows.insertId,
      name,
      surnames,
      email,
      password,
      message: "Todo correcto",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error.message,
    });
  }
};
// quiero una funcion que verifique si el token enviado desde el fron es valido
export const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  
  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agrega el usuario decodificado al objeto de solicitud para su posterior uso
    
  } catch (error) {
    return res.status(401).json({ message: "Token no válido" });
  }
};