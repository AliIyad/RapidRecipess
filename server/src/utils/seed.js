const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

// Load environment variables
dotenv.config();

// Import models
const User = require("../models/user.model.js");
const Recipe = require("../models/recipe.model.js");
const Comment = require("../models/comment.model.js");
const Interaction = require("../models/interaction.model.js");
const Notification = require("../models/notification.model.js");
const Message = require("../models/message.model.js");
const Friend = require("../models/friend.model.js");
const Follow = require("../models/follower.model.js");
const Chatroom = require("../models/chatroom.model.js");

const NUM_USERS = 100;
const NUM_RECIPES = 200;
const NUM_COMMENTS = 500;
const NUM_MESSAGES = 400;
const NUM_NOTIFICATIONS = 300;
const NUM_INTERACTIONS = 600;
const NUM_CHATROOMS = 50;

const seedDatabase = async () => {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      console.log("Database is not connected. Waiting...");
      await mongoose.connect(`mongodb://localhost:27017/Rapid_Recipes`);
      console.log("Database connected");
    } else {
      console.log("Database already connected");
    }

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Recipe.deleteMany(),
      Comment.deleteMany(),
      Interaction.deleteMany(),
      Notification.deleteMany(),
      Message.deleteMany(),
      Friend.deleteMany(),
      Follow.deleteMany(),
      Chatroom.deleteMany(),
    ]);

    console.log("Existing data cleared");

    // Create Users
    const users = await User.insertMany(
      Array.from({ length: NUM_USERS }, () => ({
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: bcrypt.hashSync("password123", 10),
        verified: faker.datatype.boolean(),
        profilePicture: faker.image.avatar(),
        bio: faker.lorem.sentence(),
      }))
    );

    console.log("Users seeded");

    // Create Recipes
    const recipes = await Recipe.insertMany(
      Array.from({ length: NUM_RECIPES }, () => ({
        title: faker.commerce.productName(),
        ingredients: Array.from({ length: 5 }, () =>
          faker.commerce.productName()
        ), // Generate random ingredient names
        steps: faker.lorem.sentences(3),
        prepTime: faker.number.int({ min: 5, max: 60 }),
        cookTime: faker.number.int({ min: 10, max: 120 }),
        difficulty: faker.helpers.arrayElement(["Easy", "Medium", "Hard"]),
        tags: faker.lorem.words(3).split(" "),
        user: users[Math.floor(Math.random() * users.length)]._id,
      }))
    );

    console.log("Recipes seeded");

    // Create Comments
    const comments = await Comment.insertMany(
      Array.from({ length: NUM_COMMENTS }, () => {
        const randomRecipe =
          recipes[Math.floor(Math.random() * recipes.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];

        return {
          content: faker.lorem.sentence(),
          recipe: randomRecipe._id, // Randomly assign to a recipe
          user: randomUser._id, // Randomly assign to a user
          timestamp: faker.date.past(),
        };
      })
    );

    console.log("Comments seeded");

    // Create Interactions for Comments
    await Interaction.insertMany(
      Array.from({ length: NUM_INTERACTIONS }, () => {
        const randomComment =
          comments[Math.floor(Math.random() * comments.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];

        return {
          user: randomUser._id,
          contentType: "comment",
          contentId: randomComment._id,
          reactionType: faker.helpers.arrayElement(["like", "dislike"]),
          createdAt: faker.date.past(),
        };
      })
    );

    console.log("Interactions seeded");

    // Create Messages
    await Message.insertMany(
      Array.from({ length: NUM_MESSAGES }, () => ({
        sender: users[0]._id, // Using first user for simplicity
        receiver: users[1]._id, // Using second user for simplicity
        content: faker.lorem.sentence(),
      }))
    );

    console.log("Messages seeded");

    // Create Notifications
    await Notification.insertMany(
      Array.from({ length: NUM_NOTIFICATIONS }, () => ({
        user: users[0]._id, // Using first user for simplicity
        type: faker.helpers.arrayElement([
          "like",
          "comment",
          "follow",
          "message",
          "friend-request",
          "recipe-update",
        ]),
        message: faker.lorem.sentence(),
        link: faker.internet.url(),
      }))
    );

    console.log("Notifications seeded");

    // Create Chatrooms
    await Chatroom.insertMany(
      Array.from({ length: NUM_CHATROOMS }, () => ({
        name: faker.company.name(), // Correct usage here
        users: users.slice(0, 5).map((u) => u._id), // Using the first 5 users
      }))
    );

    console.log("Chatrooms seeded");

    console.log("Seeding completed!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed", error);
    mongoose.connection.close();
  }
};

seedDatabase();
