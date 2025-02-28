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
const InteractionRouter = require("./src/routers/interaction.routes");
const TagRouter = require("./src/routers/tags.routes");
const ForumRouter = require("./src/routers/forumPost.routes");
const AdminRouter = require("./src/routers/admin.routes");
const { protect } = require("./src/utils/protected");

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS with specific options
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "x-refresh-token"],
  exposedHeaders: ["x-access-token"],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.status(200).send("Healthy");
});

app.use("/auth", AuthRouter);
app.use("/recipe", RecipeRouter);
app.use("/users", UserRouter);
app.use("/comments", CommentRouter);
app.use("/interaction", InteractionRouter);
app.get("/protected", protect, (req, res) => {
  res.json({
    message: "You're logged in!",
    type: "success",
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
    },
  });
});
app.use("/tags", TagRouter);

app.use("/admin", AdminRouter);

app.use("/forum", ForumRouter);

// Start server
const PORT = process.env.PORT || 6969;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
