const Interaction = require("../models/interaction.model");

const addInteraction = async ({
  userId,
  contentType,
  contentId,
  reactionType,
}) => {
  try {
    console.log("Checking for existing interaction:", {
      userId,
      contentType,
      contentId,
      reactionType,
    }); // Debugging log

    // Check if the user already interacted with this content (same user + same content + same reaction)
    const existingInteraction = await Interaction.findOne({
      user: userId,
      contentType,
      contentId,
      reactionType,
    });

    // If interaction exists, return it
    if (existingInteraction) {
      console.log("Existing interaction found:", existingInteraction); // Debugging log
      return existingInteraction;
    }

    // Otherwise, create a new interaction
    const interaction = new Interaction({
      user: userId,
      contentType,
      contentId,
      reactionType,
    });

    await interaction.save();
    console.log("New interaction created:", interaction); // Debugging log
    return interaction;
  } catch (error) {
    console.error("Error in addInteraction service:", error); // Detailed error log
    throw error;
  }
};

module.exports = { addInteraction };
