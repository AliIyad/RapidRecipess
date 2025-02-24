const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const AuthRouter = require("./src/config/auth");
const RecipeRouter = require("./src/routers/recipe.routes");
const UserRouter = require("./src/routers/user.routes");
const CommentRouter = require("./src/routers/comment.routes");

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS with specific options
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
  exposedHeaders: ["x-access-token"],
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.status(200).send("Healthy");
});

// Auth routes
app.use("/auth", AuthRouter);

// Recipe routes
app.use("/recipe", RecipeRouter);

// User routes
app.use("/users", UserRouter);

// Comment routes
app.use("/comments", CommentRouter);

// Start server
const PORT = process.env.PORT || 6969;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
