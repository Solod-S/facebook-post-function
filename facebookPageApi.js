require("dotenv").config();
const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const {
  PAGE_ID,
  PERMANENT_PAGE_TOKEN,
  APP_ID,
  APP_SECRET,
  SHORT_LIVED_USER_TOKEN,
} = process.env;

const FB_API = "https://graph.facebook.com/v21.0";

// === Получить перманентный Page Token ===
async function getPermanentPageToken(appId, appSecret, shortLivedUserToken) {
  try {
    const longLivedRes = await axios.get(`${FB_API}/oauth/access_token`, {
      params: {
        grant_type: "fb_exchange_token",
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: shortLivedUserToken,
      },
    });

    const longLivedUserToken = longLivedRes.data.access_token;

    const meRes = await axios.get(`${FB_API}/me`, {
      params: { access_token: longLivedUserToken },
    });
    const userId = meRes.data.id;

    const accountsRes = await axios.get(`${FB_API}/${userId}/accounts`, {
      params: { access_token: longLivedUserToken },
    });

    const page = accountsRes.data.data?.[0];
    if (!page) {
      console.log("No pages found for this user");
      return null;
    }

    return page.access_token;
  } catch (err) {
    console.log(
      "Error in getPermanentPageToken:",
      err.response?.data || err.message
    );
    return null;
  }
}

// === Текстовый пост ===
async function postText(pageId, pageToken, message) {
  try {
    const url = `${FB_API}/${pageId}/feed`;
    const body = qs.stringify({ message, access_token: pageToken });
    const res = await axios.post(url, body);
    return res.data;
  } catch (err) {
    console.log("Error in postText:", err.response?.data || err.message);
    return null;
  }
}

// === Пост с 1 картинкой ===
async function postImage(pageId, pageToken, imageBuffer, message) {
  try {
    const form = new FormData();
    form.append("access_token", pageToken);
    form.append("source", imageBuffer, { filename: "upload.jpg" });
    form.append("published", "false");

    const uploadRes = await axios.post(`${FB_API}/${pageId}/photos`, form, {
      headers: form.getHeaders(),
    });

    const photoId = uploadRes.data.id;

    const postRes = await axios.post(
      `${FB_API}/${pageId}/feed`,
      qs.stringify({
        message,
        attached_media: JSON.stringify([{ media_fbid: photoId }]),
        access_token: pageToken,
      })
    );

    return postRes.data;
  } catch (err) {
    console.log("Error in postImage:", err.response?.data || err.message);
    return null;
  }
}

// === Пост с несколькими картинками ===
async function postMultipleImages(pageId, pageToken, imageBuffers, message) {
  try {
    const mediaIds = [];

    for (const buffer of imageBuffers) {
      const form = new FormData();
      form.append("access_token", pageToken);
      form.append("source", buffer, { filename: "upload.jpg" });
      form.append("published", "false");

      const uploadRes = await axios.post(`${FB_API}/${pageId}/photos`, form, {
        headers: form.getHeaders(),
      });

      mediaIds.push({ media_fbid: uploadRes.data.id });
    }

    const postRes = await axios.post(
      `${FB_API}/${pageId}/feed`,
      qs.stringify({
        message,
        attached_media: JSON.stringify(mediaIds),
        access_token: pageToken,
      })
    );

    return postRes.data;
  } catch (err) {
    console.log(
      "Error in postMultipleImages:",
      err.response?.data || err.message
    );
    return null;
  }
}

// === Получить список постов ===
async function getPagePosts(pageId, pageToken, limit = 5) {
  try {
    const url = `${FB_API}/${pageId}/posts`;
    const res = await axios.get(url, {
      params: { access_token: pageToken, limit },
    });
    return res.data.data;
  } catch (err) {
    console.log("Error in getPagePosts:", err.response?.data || err.message);
    return [];
  }
}

// === Удалить пост ===
async function deletePagePost(postId, pageToken) {
  try {
    const url = `${FB_API}/${postId}`;
    const res = await axios.delete(url, {
      params: { access_token: pageToken },
    });
    return res.data;
  } catch (err) {
    console.log("Error in deletePagePost:", err.response?.data || err.message);
    return null;
  }
}

// === Получить статистику поста ===
async function getPostInsights(
  postId,
  pageToken,
  metrics = ["post_impressions", "post_engaged_users", "post_clicks"]
) {
  try {
    const url = `${FB_API}/${postId}/insights`;
    const res = await axios.get(url, {
      params: { access_token: pageToken, metric: metrics.join(",") },
    });
    return res.data.data;
  } catch (err) {
    console.log("Error in getPostInsights:", err.response?.data || err.message);
    return null;
  }
}

// === Оставить комментарий к посту ===
async function commentOnPost(postId, pageToken, message) {
  try {
    const url = `${FB_API}/${postId}/comments`;
    const body = qs.stringify({ message, access_token: pageToken });
    const res = await axios.post(url, body);
    return res.data;
  } catch (err) {
    console.log("Error in commentOnPost:", err.response?.data || err.message);
    return null;
  }
}

// === Ответить на комментарий ===
async function replyToComment(commentId, pageToken, message) {
  try {
    const url = `${FB_API}/${commentId}/comments`;
    const body = qs.stringify({ message, access_token: pageToken });
    const res = await axios.post(url, body);
    return res.data;
  } catch (err) {
    console.log("Error in replyToComment:", err.response?.data || err.message);
    return null;
  }
}

module.exports = {
  getPermanentPageToken,
  postText,
  postImage,
  postMultipleImages,
  getPagePosts,
  deletePagePost,
  getPostInsights,
  commentOnPost,
  replyToComment,
};
