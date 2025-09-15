require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { PAGE_ID, PERMANENT_PAGE_TOKEN } = process.env;

const fb = require("./facebookPageApi");

(async () => {
  try {
    // === 1. Текстовый пост ===
    const textPost = await fb.postText(
      PAGE_ID,
      PERMANENT_PAGE_TOKEN,
      "Привет! Это тестовый текстовый пост."
    );
    console.log("Text post:", textPost);

    // === 2. Пост с одной картинкой ===
    const buffer1 = fs.readFileSync(
      path.resolve(__dirname, "assets", "logo.jpg")
    );
    const imagePost = await fb.postImage(
      PAGE_ID,
      PERMANENT_PAGE_TOKEN,
      buffer1,
      "Пост с картинкой 🚀"
    );
    console.log("Image post:", imagePost);

    // === 3. Пост с несколькими картинками ===
    const buffer2 = fs.readFileSync(
      path.resolve(__dirname, "assets", "logo.jpg")
    );
    const buffer3 = fs.readFileSync(
      path.resolve(__dirname, "assets", "logo.jpg")
    );
    const multiImagePost = await fb.postMultipleImages(
      PAGE_ID,
      PERMANENT_PAGE_TOKEN,
      [buffer2, buffer3],
      "Пост с несколькими картинками 📸"
    );
    console.log("Multi image post:", multiImagePost);

    // === 4. Получить последние посты ===
    const posts = await fb.getPagePosts(PAGE_ID, PERMANENT_PAGE_TOKEN, 5);
    console.log("Last posts:", posts);

    // === 5. Получить статистику по первому посту ===
    if (posts.length > 0) {
      const insights = await fb.getPostInsights(
        posts[0].id,
        PERMANENT_PAGE_TOKEN
      );
      console.log("Insights for first post:", insights);
    }

    // === 6. Удалить пост (пример: последний пост) ===
    if (posts.length > 0) {
      const del = await fb.deletePagePost(posts[0].id, PERMANENT_PAGE_TOKEN);
      console.log("Deleted:", del);
    }

    // === 7. Оставляем комментарий к этому посту ===
    const comment = await fb.commentOnPost(
      posts[1].id,
      PERMANENT_PAGE_TOKEN,
      "Первый комментарий к посту 💬"
    );
    console.log("Comment added:", comment);

    // === 8. Ответ на комментарий ===
    if (comment?.id) {
      const reply = await fb.replyToComment(
        comment.id,
        PERMANENT_PAGE_TOKEN,
        "Спасибо за ваш комментарий! 🙌"
      );
      console.log("Reply to comment:", reply);
    }
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
})();
