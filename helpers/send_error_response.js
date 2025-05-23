const sendErrorresponse = (error, res) => {
  console.log(error);
  res.status(400).send({ message: "Xatolik", error: error.message });
};

module.exports = {
  sendErrorresponse,
};
