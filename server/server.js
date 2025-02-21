const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");
const AuthRouter = require("./src/config/auth");

const userRouter = require("./src/routers/user.routes");
const recipeRouter = require("./src/routers/recipe.routes");
const commentRouter = require("./src/routers/comment.routes");

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

app.use(express.json());
connectDB();
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());

dotenv.config();

app.use("/users", userRouter);
app.use("/recipes", recipeRouter);
app.use("/comments", commentRouter);

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
