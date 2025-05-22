const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");

const addStage = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newStage = await pool.query(
      `
      INSERT INTO stage (name, description)
      VALUES ($1, $2) RETURNING *
      `,
      [name, description]
    );
    console.log(newStage);
    res
      .status(201)
      .send({ message: "Stage created successfully!", stage: newStage.rows[0] });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getAllStages = async (req, res) => {
  try {
    const stages = await pool.query(`SELECT * from stage`);
    res.status(200).send(stages.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getStage = async (req, res) => {
  try {
    const { id } = req.params;
    const stage = await pool.query(`SELECT * FROM stage WHERE id = $1`, [id]);

    if (!stage.rowCount)
      return res.status(404).send({ message: "Stage not found" });

    res.status(200).send(stage.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};


const updateStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedStage = await pool.query(
      `UPDATE stage SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
      [name, description, id]
    );

    if (!updatedStage.rowCount) {
      return res.status(404).send({ message: "Stage not found" });
    }

    res
      .status(200)
      .send({
        message: "Stage updated successfully",
        stage: updatedStage.rows[0],
      });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};


const deleteStage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const stage = await pool.query('DELETE FROM stage WHERE id = $1 RETURNING *', [id])

    if (!stage.rowCount) {
      return res.status(404).send({message: "ID not found"})
    }
    res.status(200).send({message: "Stage deleted successfully!", stage: stage.rows[0]});
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addStage,
  getStage,
  getAllStages,
  updateStage,
  deleteStage,
};
