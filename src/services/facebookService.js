const fs = require("fs");
const path = require("path");
const fb = require("../api/facebook");
const { PAGE_ID, PERMANENT_PAGE_TOKEN } = process.env;

async function publishText(message) {
  return fb.postText(PAGE_ID, PERMANENT_PAGE_TOKEN, message);
}

async function publishImage(imagePath, message) {
  const buffer = fs.readFileSync(path.resolve(imagePath));
  return fb.postImage(PAGE_ID, PERMANENT_PAGE_TOKEN, buffer, message);
}

async function publishAlbum(imagesPaths, message) {
  const buffers = imagesPaths.map((img) => fs.readFileSync(path.resolve(img)));
  return fb.postMultipleImages(PAGE_ID, PERMANENT_PAGE_TOKEN, buffers, message);
}

module.exports = {
  publishText,
  publishImage,
  publishAlbum,
};
