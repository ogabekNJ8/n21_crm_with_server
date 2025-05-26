const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  stuffSchema,
  updateStuffSchema,
  stuffIdSchema,
} = require("../validations/stuff.validation");

const addStuff = async (req, res) => {
  try {
    const { error, value } = stuffSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query(
      `INSERT INTO stuff (first_name, last_name, phone_number, login, parol, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        value.first_name,
        value.last_name,
        value.phone_number,
        value.login,
        value.parol,
        value.is_active,
      ]
    );

    res.status(201).send({
      message: "Stuff created successfully",
      stuff: result.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getAllStuffs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stuff");
    res.status(200).send(result.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getStuff = async (req, res) => {
  try {
    const { error, value } = stuffIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query("SELECT * FROM stuff WHERE id = $1", [
      value.id,
    ]);
    if (!result.rowCount)
      return res.status(404).send({ message: "Stuff not found" });

    res.status(200).send(result.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const updateStuff = async (req, res) => {
  try {
    const { error: idError, value: idValue } = stuffIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } = updateStuffSchema.validate(
      req.body
    );
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    const keys = Object.keys(bodyValue);
    const values = Object.values(bodyValue);
    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

    const result = await pool.query(
      `UPDATE stuff SET ${updates} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, idValue.id]
    );

    if (!result.rowCount)
      return res.status(404).send({ message: "Stuff not found" });

    res.status(200).send({
      message: "Stuff updated successfully",
      stuff: result.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const deleteStuff = async (req, res) => {
  try {
    const { error, value } = stuffIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query(
      "DELETE FROM stuff WHERE id = $1 RETURNING *",
      [value.id]
    );
    if (!result.rowCount)
      return res.status(404).send({ message: "Stuff not found" });

    res.status(200).send({ message: "Stuff deleted", stuff: result.rows[0] });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addStuff,
  getAllStuffs,
  getStuff,
  updateStuff,
  deleteStuff,
};
