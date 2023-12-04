import { pool } from "../db.js";

export const getEmployees = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT e.*,er.name AS typeEmployee FROM employee e 
    INNER JOIN employee_rol er ON e.id_rol = er.id`);
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};

export const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`SELECT * FROM employee WHERE id = ?`, [
      req.params.id,
    ]);
    if (rows.length <= 0) {
      res.status(404).json({
        message: "Employee not found",
      });
    }
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};

export const getActiveEmploye = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT * FROM employee`);
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Somethin goes wrong",
      error: error,
    });
  }
};

export const getEmployeeType = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT * FROM employee_rol`);
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};

export const createEmployee = async (req, res) => {
  const { id_rol, name, surnames, salary } = req.body;
  try {
    const [rows] = await pool.query(
      `INSERT INTO employee (id_rol, name, surnames, salary, registration_date, status) 
      VALUES (?, ?, ?, ?, CURDATE(), 0)`,
      [id_rol, name, surnames, salary]
    );

    res.send({
      id: rows.insertId,
      id_rol,
      name,
      surnames,
      salary,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


export const createTypeEmployee = async (req, res) => {
  const { name } = req.body;
  try {
    const [rows] = await pool.query(
      `INSERT INTO employee_rol(name) VALUES(?)`,
      [name]
    );
    res.send({ name });
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM employee WHERE id = ?`, [id]);
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Employee not found" });
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { name, surnames, salary, rol } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE employee SET name= IFNULL(?,name), surnames= IFNULL(?,surnames), salary= IFNULL(?,salary), rol= IFNULL(?,rol) WHERE id=?`,
      [name, surnames, salary, rol, id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({
        data: "Employee not found",
      });
    const [rows] = await pool.query("SELECT * FROM employee WHERE id=?", [id]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};
