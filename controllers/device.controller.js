const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");

const DeviceDetector = require("node-device-detector");
const DeviceHelper = require("node-device-detector/helper");

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  osIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});

// CREATE
const addDeviceToken = async (req, res) => {
  try {
    const { user_id, token } = req.body;
    const userAgent = req.headers["user-agent"];
    const result = detector.detect(userAgent);
    const { device, os, client } = result;

    const newToken = await pool.query(
      `
      INSERT INTO device_tokens (user_id, device, os, client, token)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [user_id, device, os, client, token]
    );

    res.status(201).send({
      message: "Device token created successfully!",
      device_token: newToken.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

// READ ALL
const getAllDeviceTokens = async (req, res) => {
  try {
    const tokens = await pool.query(`SELECT * FROM device_tokens`);
    res.status(200).send(tokens.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

// READ ONE
const getDeviceToken = async (req, res) => {
  try {
    const { id } = req.params;
    const token = await pool.query(
      `SELECT * FROM device_tokens WHERE id = $1`,
      [id]
    );

    if (!token.rowCount) {
      return res.status(404).send({ message: "Device token not found" });
    }

    res.status(200).send(token.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

// UPDATE
const updateDeviceToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, device, os, client, token } = req.body;

    const updated = await pool.query(
      `
      UPDATE device_tokens SET
        user_id = $1,
        device = $2,
        os = $3,
        client = $4,
        token = $5
      WHERE id = $6
      RETURNING *
      `,
      [user_id, device, os, client, token, id]
    );

    if (!updated.rowCount) {
      return res.status(404).send({ message: "Device token not found" });
    }

    res.status(200).send({
      message: "Device token updated successfully!",
      device_token: updated.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

// DELETE
const deleteDeviceToken = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM device_tokens WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!deleted.rowCount) {
      return res.status(404).send({ message: "Device token not found" });
    }

    res.status(200).send({
      message: "Device token deleted successfully!",
      device_token: deleted.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addDeviceToken,
  getAllDeviceTokens,
  getDeviceToken,
  updateDeviceToken,
  deleteDeviceToken,
};
