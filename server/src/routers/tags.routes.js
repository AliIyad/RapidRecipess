const express = require("express");
const router = express.Router();
const tagService = require("../services/tags.service");

// Get all tags
router.get("/", async (req, res) => {
  try {
    const tags = await tagService.getAllTags();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tags by IDs
router.post("/by-ids", async (req, res) => {
  try {
    const { tagIds } = req.body;
    const tags = await tagService.getTagsByIds(tagIds);
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new tag
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await tagService.createTag(name);
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/recipe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tags = await tagService.getTagsByRecipe(id);
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
