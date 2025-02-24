const User = require("../models/user.model");

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error("Error fetching users");
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error creating user");
  }
};

const updateUser = async (userId, userData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    return user;
  } catch (error) {
    throw new Error("Error updating user");
  }
};

const deleteUser = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);
  } catch (error) {
    throw new Error("Error deleting user");
  }
};

const updateNotificationPreferences = async (
  userId,
  notificationPreferences
) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { notificationPreferences }, // Update only the notificationPreferences field
      { new: true } // Return the updated document
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error in updateNotificationPreferences:", error.message);
    throw new Error("Error updating notification preferences");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateNotificationPreferences,
};
