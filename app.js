const express = require("express");
const config = require("config");
const PORT = config.get("port");
const indexRouter = require("./routes/index.routes")

const app = express();

app.use(express.json());

app.use("/api", indexRouter)

app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
});

async function start() {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started at: http://localhost${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
