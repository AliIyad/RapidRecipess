const mongoose = require("mongoose");

// Define the Tag schema
const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

// Create the Tag model
const Tag = mongoose.model("Tag", tagSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/Rapid_Recipes`);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Seed the database with tags
const seedTags = async () => {
  const tagsToInsert = [
    { name: "Vegetarian" },
    { name: "Vegan" },
    { name: "Gluten-Free" },
    { name: "Dairy-Free" },
    { name: "Nut-Free" },
  ];

  try {
    await Tag.insertMany(tagsToInsert);
    console.log("Tags inserted successfully");
  } catch (error) {
    console.error("Error inserting tags:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed script
const runSeed = async () => {
  await connectDB();
  await seedTags();
};

runSeed();
