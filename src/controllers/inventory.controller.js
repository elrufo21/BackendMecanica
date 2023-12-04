import { pool } from "../db.js";

export const getInventory = async (req, res) => {
  try {
    const [data] = await pool.query(` select i.* ,it.id as id_type,
       it.name as name_type from inventory i
     inner join item_types it 
     on i.item_type_id = it.id WHERE i.quantity!=0`);
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};

export const updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE inventory SET quantity = IFNULL(?,quantity)  WHERE id=?`,
      [quantity, id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({
        data: "Employee not found",
      });
    const [rows] = await pool.query("SELECT * FROM employee WHERE id =?", [id]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};

export const getType = async (req, res) => {
  try {
    const [data] = await pool.query("SELECT * FROM item_types");
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};

export const createItem = async (req, res) => {
  const { item_type_id, name, description, quantity, price, color } = req.body;
  let c;
  if (item_type_id == 2) {
    c = color;
  } else {
    c = null;
  }
  try {
    const [rows] = await pool.query(
      `INSERT INTO inventory(item_type_id,name,description,quantity,price,color) 
    VALUES(?,?,?,?,?,?)`,
      [item_type_id, name, description, quantity, price, c]
    );
    res.send({
      id: rows.insertId,
      item_type_id,
      name,
      description,
      quantity,
      price,
      c,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};

export const createType = async (req, res) => {
  const { name } = req.body;
  try {
    const [rows] = await pool.query(
      `INSERT INTO item_types(name)
    VALUES(?)`,
      [name]
    );
    res.send({
      id: rows.id,
      name,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};
