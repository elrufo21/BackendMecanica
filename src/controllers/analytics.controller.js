import { pool } from "../db.js";

export const getIncomeTickets = async (req, res) => {
  try {
    const [rs] = await pool.query(`SELECT
    SUM(CASE
          WHEN YEAR(creation_date) = YEAR(CURDATE()) AND MONTH(creation_date) = MONTH(CURDATE()) THEN CAST(cost AS DECIMAL(10, 2))
          ELSE 0
        END) AS costo_mes_actual,
    SUM(CASE
          WHEN YEAR(creation_date) = YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(creation_date) = MONTH(CURDATE() - INTERVAL 1 MONTH) THEN CAST(cost AS DECIMAL(10, 2))
          ELSE 0
        END) AS costo_mes_anterior
  FROM tickets`);
    const costoMesActual = parseFloat(rs[0].costo_mes_actual);
    const costoMesAnterior = parseFloat(rs[0].costo_mes_anterior);
    const diferencia = costoMesActual - costoMesAnterior;
    // Verificar si el costo del mes anterior es 0
    if (costoMesAnterior === 0) {
      // Si es 0, el porcentaje se establece en 0 para evitar divisiones por cero
      var porcentajeGananciaPerdida = diferencia;
    } else {
      porcentajeGananciaPerdida = (diferencia / costoMesAnterior) * 100;
    }

    res.json({
      data: {
        costoMesActual,
        costoMesAnterior,
        porcentajeGananciaPerdida,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};
export const getEmloyeeAnalityc = async (req, res) => {
  try {
    const [rs] = await pool.query(`SELECT E.*, COUNT(T.id) AS cantidad_tickets
    FROM employee E
    LEFT JOIN tickets T ON E.id = T.employee_id
    WHERE YEAR(T.creation_date) = YEAR(CURDATE()) -- Puedes cambiar la fecha según el mes deseado
      AND MONTH(T.creation_date) = MONTH(CURDATE()) -- Puedes cambiar la fecha según el mes deseado
    GROUP BY E.id
    ORDER BY cantidad_tickets DESC
    LIMIT 1;
    `);
    res.json({
      data: rs[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};
