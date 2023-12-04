import { pool } from "../db.js";

export const getVehicleCustomer = async (req, res) => {
  try {
    const [data] = await pool.query(`select v.*, from vehicles inner join
    customers  `);
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const [data] =
      await pool.query(`SELECT v.*,c.name,c.surnames FROM vehicles v 
        INNER JOIN customers c ON v.customer_id=c.id`);
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};

export const getVehicle = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM vehicles v 
        INNER JOIN vehicle_photos vp ON vp.vehicle_id=v.id WHERE v.id = ?`,
      [req.params.id]
    );
    if (rows.length <= 0)
      res.status(404).json({
        message: "Vehicle not found",
      });
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};

export const createVehicle = async (req, res) => {
  const { customer_id, plate, brand, model, color, vehicle_photos } = req.body;

  try {
    const [rows] = await pool.query(
      `
        INSERT INTO vehicles(customer_id, plate, brand, model, color) 
        VALUES(?,?,?,?,?)`,
      [customer_id, plate, brand, model, color]
    );
    const id = rows.insertId;
    for (const photo of vehicle_photos) {
      try {
        console.log(id);
        await pool.query(
          `INSERT INTO vehicle_photos (vehicle_id, name, src, date) VALUES(?,?,?,?)`,
          [id, photo.name, photo.src, photo.date]
        );
      } catch (photoInsertionError) {
        // Manejar error específico de inserción de foto
        console.error("Error al insertar la foto:", photoInsertionError);
      }
    }
    res.send({
      id: rows.insertId,
      customer_id,
      plate,
      brand,
      model,
      color,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error:error.message
    });
  }
};

export const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { plate, brand, model, color } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE vehicles SET
    plate = IFNULL(?,plate), brand = IFNULL(?,brand), model = IFNULL(?,model), color = IFNULL(?,color)
    WHERE id = ?`,
      [plate, brand, model, color, id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({
        data: "Vehicle not found",
      });
    const [rows] = await pool.query(`SELECT * FROM vehicles WHERE id = ?`, [
      id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};
