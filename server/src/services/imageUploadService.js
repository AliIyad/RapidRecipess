const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const API_KEY = process.env.IMG_BB_API_KEY; // Replace with your ImgBB API key

/**
 * Uploads an image to ImgBB and returns the URL.
 * @param {Buffer} imageBuffer - The image file buffer.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
const uploadImageToImgBB = async (imageBuffer) => {
  try {
    const form = new FormData();
    form.append("image", imageBuffer.toString("base64")); // Convert buffer to base64

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    if (response.data && response.data.data && response.data.data.url) {
      return response.data.data.url;
    } else {
      throw new Error("Failed to upload image.");
    }
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error);
    throw new Error("Image upload failed.");
  }
};

module.exports = {
  uploadImageToImgBB,
};
