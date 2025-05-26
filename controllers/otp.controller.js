const otpGenerator = require("otp-generator");
const uuid = require("uuid");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { addMinutesToDate } = require("../helpers/add_minutes");
const pool = require("../config/db");
const { encode, decode } = require("../helpers/crypt");
const mailService = require("../helpers/mail.service");


const newOtp = async (req, res) => {
  try {
    const { phone_number, email } = req.body;

    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expiration_time = addMinutesToDate(now, 5);

    const newOtpDb = await pool.query(
      `
      INSERT INTO otp (id, otp, expiration_time)
      VALUES ($1, $2, $3) returning id
      `,
      [uuid.v4(), otp, expiration_time]
    );
    //  SMS, bot, email
    if (email) {
      const text = `Sizning tasdiqlash kodingiz: ${otp}`;
      await mailService.sendMail(email, text);
    }

    const details = {
      time: now,
      phone_number,
      otp_id: newOtpDb.rows[0].id,
    };

    const encodedData = await encode(JSON.stringify(details));

    res
      .status(200)
      .send({ message: "OTP generated", verificaton_key: encodedData });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { verificaton_key, otp, phone_number } = req.body;
    const decodedData = await decode(verificaton_key);
    const data = JSON.parse(decodedData);

    if (phone_number != data.phone_number) {
      return res
        .status(400)
        .send({ message: "OTP bu telefon raqamga yuborilmagan" });
    }

    const otpResult = await pool.query(`SELECT * FROM otp WHERE id = $1`, [
      data.otp_id,
    ]);
    const result = otpResult.rows[0];

    if (result == null) {
      return res.status(400).send({ message: "OTP aniqlanmadi" });
    }
    if (result.verified == true) {
      return res.status(400).send({ message: "Bu OTP avval tekshirilgan" });
    }
    if (result.expiration_time < new Date()) {
      return res.status(400).send({ message: "OTP expired" });
    }

    if (otp != result.otp) {
      return res.status(400).send({ message: "OTPlar mos emas" });
    }
    await pool.query(
      `
      UPDATE otp SET verified=$2 where id=$1
      `,
      [result.id, true]
    );
    const clientResult = await pool.query(
      `SELECT * FROM client WHERE phone_number =$1`,
      [phone_number]
    );

    let client_id, isNew;
    if (clientResult.rows.length == 0) {
      const newClient = await pool.query(
        `INSERT INTO client (phone_number, email, is_active) VALUES ($1, $2, $3) returning *`,
        [phone_number, email, true]
      );
      client_id = newClient.rows[0].id;
      isNew = true;

      const email = newClient.rows[0].email;
      if (email) {
        await mailService.sendMail(
          email,
          `Ro'yxatdan muvaffaqiyatli o'tdingiz.`
        );
      }

    } else {
      client_id = clientResult.rows[0].id;
      isNew = false;
      await pool.query(`UPDATE client SET is_active=true WHERE id=$1`, [
        client_id,
      ]);
    }

    res.status(200).send({ message: "OTP verified", isNew, client_id });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  newOtp,
  verifyOtp,
};
