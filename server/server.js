const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const app = express();

const connectDB = require("./src/config/db");
const AuthRouter = require("./src/config/auth");

connectDB();
app.use(helmet());
app.use(cors());
app.use(express.json());

dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.status(200).send("Healthy");
});

app.use("/auth", AuthRouter);

app.listen(process.env.PORT, () => {
  console.log(
    `Server running on port http://${process.env.HOST}:${process.env.PORT}`
  );
});
