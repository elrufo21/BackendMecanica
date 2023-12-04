import { pool } from "../db.js";

export const getCustomer = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT * FROM customers`);
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const getCustomerVehiclePhoto = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
    SELECT
    customers.id,
    customers.name,
    customers.surnames,
    customers.dni,
    customers.phone,
    customers.registration_date,
    vehicles.id as vehicle_id,
    vehicles.plate,
    vehicles.brand,
    vehicles.model,
    vehicles.color,
    vehicle_photos.name AS photo_name,
    vehicle_photos.src AS photo_src,
    vehicle_photos.date AS photo_date
FROM
  customers
LEFT JOIN
  vehicles ON customers.id = vehicles.customer_id
LEFT JOIN
  vehicle_photos ON vehicles.id = vehicle_photos.vehicle_id
    WHERE customers.id = ${req.params.id}`
    );
    if (rows.length <= 0)
      res.status(404).json({
        message: "Customer not found",
      });
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { name, surnames, dni, phone } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE customers SET name = IFNULL(?,name),surnames = IFNULL(?, surnames),dni = IFNULL(?, dni), phone = IFNULL(?, phone) WHERE id=? `,
      [name, surnames, dni, phone, id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({
        data: "Employee not found",
      });
    const [rows] = await pool.query(`SELECT * FROM customers WHERE id=?`, [id]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};

export const createCustomer = async (req, res) => {
  const { name, surnames, dni, phone } = req.body;
  try {
    const [rows] = await pool.query(
      `INSERT INTO customers(name, surnames, dni, phone,registration_date)
    VALUES(?,?,?,?,CURDATE())`,
      [name, surnames, dni, phone]
    );

    res.send({
      id: rows.insertId,
      name,
      surnames,
      dni,
      phone,
      message: "Todo correcto",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};

//Quiero una funcion que me devuelva la cantidad de clientes del ultimo mes y el mes anterior
export const getCustomerCount = async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT COUNT(id) as total FROM customers WHERE MONTH(registration_date) = MONTH(CURRENT_DATE())`
    );
    const [data2] = await pool.query(
      `SELECT COUNT(id) as total FROM customers WHERE MONTH(registration_date) = MONTH(CURRENT_DATE()) - 1`
    );
    res.json({
      actual: data[0].total,
      mesAnterior: data2[0].total,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};



