const Interaction = require("../models/interaction.model");

const addInteraction = async ({ userId, contentType, contentId, reactionType }) => {
  try {
    console.log("Processing interaction:", { userId, contentType, contentId, reactionType });

    // Check if the user has any existing interaction with this content
    const existingInteraction = await Interaction.findOne({
      user: userId,
      contentType,
      contentId
    });

    if (existingInteraction) {
      // If the same reaction type exists, remove it (toggle off)
      if (existingInteraction.reactionType === reactionType) {
        console.log("Removing existing interaction");
        await existingInteraction.deleteOne();
        return { removed: true, reactionType };
      }
      
      // If different reaction type exists, update it
      console.log("Updating interaction type from", existingInteraction.reactionType, "to", reactionType);
      existingInteraction.reactionType = reactionType;
      await existingInteraction.save();
      return existingInteraction;
    }

    // Create new interaction if none exists
    console.log("Creating new interaction");
    const interaction = new Interaction({
      user: userId,
      contentType,
      contentId,
      reactionType
    });

    await interaction.save();
    return interaction;
  } catch (error) {
    console.error("Error in addInteraction service:", error); // Detailed error log
    throw error;
  }
};

module.exports = { addInteraction };
