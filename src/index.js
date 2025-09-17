require("dotenv").config();
const {
  publishText,
  publishImage,
  publishAlbum,
} = require("./services/facebookService");
const fb = require("./api/facebook");
const { APP_ID, APP_SECRET, SHORT_LIVED_USER_TOKEN } = process.env;

(async () => {
  try {
    // === Пример поста ===
    const textPost = await publishText("🚀 Hello Facebook!");
    console.log("Text post:", textPost);

    // === Пример поста с картинкой ===
    const imagePost = await publishImage(
      "./assets/logo.webp",
      "🔥 Post with image"
    );
    console.log("Image post:", imagePost);

    // === Пример альбома ===
    const albumPost = await publishAlbum(
      ["./assets/logo.webp", "./assets/logo.webp"],
      "📸 Album post"
    );
    console.log("Album post:", albumPost);

    // === Получить токен ===
    // const pageToken = await fb.getPermanentPageToken(
    //   APP_ID,
    //   APP_SECRET,
    //   SHORT_LIVED_USER_TOKEN
    // );
    // console.log("Permanent Page Token:", pageToken);
  } catch (err) {
    console.error("App error:", err.response?.data || err.message);
  }
})();
