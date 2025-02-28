const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const User = require("../models/user.model");
const upload = require("../utils/upload");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", upload.single("profilePicture"), userController.updateUser);
router.delete("/:id", userController.deleteUser);

router.put(
  "/:id/notification-preferences",
  userController.updateNotificationPreferences
);

router.put("/:id/preferred-tags", async (req, res) => {
  try {
    const { id } = req.params; // Use 'id' to match the route parameter
    const { preferredTags } = req.body; // Ensure this matches the client-side request

    // Update user preferred tags in the database
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { preferredTags } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Preferences updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating preferred tags:", error.message);
    res.status(500).json({ message: "Error updating preferred tags" });
  }
});

router.get("/:id/preferred-tags", async (req, res) => {
  try {
    const { id } = req.params; // Use 'id' to match the route parameter
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Preferred tags fetched successfully",
      preferredTags: user.preferredTags,
    });
  } catch (error) {
    console.error("Error fetching preferred tags:", error.message);
    res.status(500).json({ message: "Error fetching preferred tags" });
  }
});

module.exports = router;
