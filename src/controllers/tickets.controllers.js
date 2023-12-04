import { pool } from "../db.js";

export const getTickets = async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT t.id ,t.status , t.description , t.creation_date , t.last_update_date ,
      c.id as customer_id , c.name , c.surnames , c.dni , c.phone ,
      e.id as employee_id , e.name as name_employee , e.surnames as surnames_employee ,
      v.id as vehicle_id , v.plate , v.brand , v.model , v.color FROM tickets t 
      INNER JOIN customers c on t.customer_id = c.id 
      INNER JOIN employee e ON t.employee_id = e.id 
      INNER JOIN vehicles v ON t.vehicle_id = v.id`
    );
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};
export const getTicket = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.id ,t.status , t.description , t.creation_date , t.last_update_date,t.cost ,
      c.id as customer_id , c.name , c.surnames , c.dni , c.phone ,
      e.id as employee_id , e.name as name_employee , e.surnames as surnames_employee ,
      v.id as vehicle_id , v.plate , v.brand , v.model , v.color FROM tickets t 
      INNER JOIN customers c on t.customer_id = c.id 
      INNER JOIN employee e ON t.employee_id = e.id 
      INNER JOIN vehicles v ON t.vehicle_id = v.id WHERE t.id =?`,
      [req.params.id]
    );
    if (rows.length <= 0)
      res.status(404).json({
        message: "Ticket not found",
      });
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error.message,
    });
  }
};

export const createTicket = async (req, res) => {
  const { customer_id, employee_id, vehicle_id, status, description, cost } =
    req.body;
  console.log(req.body);
  try {
    const [rows] = await pool.query(
      `INSERT INTO tickets(customer_id,
          employee_id,
          vehicle_id,
          status,
          description,
          creation_date,
          last_update_date,
          cost) VALUES(?,?,?,?,?,NOW(),NOW(),?)`,
      [customer_id, employee_id, vehicle_id, status, description, cost]
    );
    const [rs] = await pool.query(`UPDATE employee SET status = 1 WHERE id=?`, [
      employee_id,
    ]);
    if (rs.affectedRows <= 0)
      return res.status(404).json({
        message: "Employee not found",
      });

    res.send({
      id: rows.insertId,
      customer_id,
      employee_id,
      vehicle_id,
      status,
      description,
      creation_date: new Date(),
      last_update_date: new Date(),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something wrong wrong",
      error: error,
    });
  }
};

export const createTicketInventory = async (req, res) => {
  const { items, ticket_id } = req.body;
  try {
    for (const item of items) {
      try {
        await pool.query(
          `INSERT INTO ticket_inventory (ticket_id,inventory_id,quantity) VALUES(?,?,?)`,
          [ticket_id, item.id, item.quantity]
        );
        const [rs] = await pool.query(
          `UPDATE inventory SET quantity = quantity - ? 
          WHERE id = ?`,
          [item.quantity, item.id]
        );
        if (rs.affectedRows <= 0)
          return res.status(404).json({
            message: "Item not found",
          });
      } catch (error) {
        return res.status(500).json({
          message: "Error al insertar articulo",
          error: error,
        });
      }
    }
    res.json(items);
  } catch (error) {
    return res.status(500).json({
      message: "Error al insertar articulo",
      error: error,
    });
  }
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { description, cost } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE tickets SET description = IFNULL(?,description),
       last_update_date = NOW(), 
       cost= IFNULL(?,cost) WHERE id = ?`,
      [description, cost, id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Ticket not found",
      });
    const [rows] = await pool.query(`SELECT * FROM tickets WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error,
    });
  }
};

export const getTicketInventory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        i.id AS inventory_id,
        i.name AS inventory_name,
        i.color AS inventory_color,
        ti.quantity AS ticket_inventory_quantity
        FROM inventory AS i INNER JOIN ticket_inventory AS ti ON i.id = ti.inventory_id
      WHERE ti.ticket_id = ?`,
      [req.params.id]
    );
    if (rows.length <= 0)
      res.status(404).json({
        message: "Ticket not found",
      });
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error.message,
    });
  }
};

export const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE tickets SET status  = ?, finish_date = CURDATE(), last_update_date = CURDATE() WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows <= 0) {
      await pool.rollback();
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const [rows] = await pool.query("SELECT * from tickets WHERE id=?", [id]);

    res.json({
      data: rows[0],
      message: "Actualizado correctamente",
      typeAlert: "Realizado!",
      statusMessage: "success",
    });
  } catch (error) {
    await pool.rollback();
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};
