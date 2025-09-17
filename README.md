![Version](https://img.shields.io/badge/Version-1.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Runs with Node.js](https://img.shields.io/badge/Runs%20with-Node.js-43853d.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Runs with Axios](https://img.shields.io/badge/HTTP-Axios-5A29E4.svg?style=flat-square&logo=axios&logoColor=white)](https://axios-http.com/)
[![Runs with dotenv](https://img.shields.io/badge/Env-dotenv-000.svg?style=flat-square&logo=dotenv&logoColor=white)](https://www.npmjs.com/package/dotenv)
[![Runs with Facebook Graph API](https://img.shields.io/badge/Facebook-Graph%20API-1877F2.svg?style=flat-square&logo=facebook&logoColor=white)](https://developers.facebook.com/docs/graph-api)
[![Runs with form-data](https://img.shields.io/badge/Upload-form--data-EC4A3F.svg?style=flat-square)](https://www.npmjs.com/package/form-data)
[![Runs with qs](https://img.shields.io/badge/Query-qs-000000.svg?style=flat-square)](https://www.npmjs.com/package/qs)
![Facebook Automation](/assets/logo.webp)

# Facebook Page Automation

This project provides a simple Node.js wrapper for the Facebook Graph API to manage Facebook Pages.  
It supports posting text, images (single or multiple), fetching posts, deleting posts, commenting, replying, and retrieving insights.

## Project Structure

```
.
├── src/
│   ├── api/                # Core API functions
│   │   └── facebookPageApi.js
│   ├── config/             # Configuration files
│   │   └── index.js
│   ├── utils/              # Helper functions
│   └── index.js            # Example usage
├── assets/                 # Test images, etc.
├── .env                    # Environment variables
├── package.json
└── README.md
```

# Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Axios**: HTTP client for API requests.
- **dotenv**: To manage environment variables.
- **Facebook Graph API**: For programmatic posting and page management.
- **form-data**: To handle file uploads (e.g., posting images).
- **qs**: Query string parsing and stringifying.

## Environment Variables

In your `.env` file, set the following values:

```
PAGE_ID=your_facebook_page_id
PERMANENT_PAGE_TOKEN=your_page_token
APP_ID=your_facebook_app_id
APP_SECRET=your_facebook_app_secret
SHORT_LIVED_USER_TOKEN=your_short_lived_user_token
```

## Getting a Permanent Page Token

To be able to publish posts to a Facebook Page via the API, you need a **permanent Page Token**.  
The process consists of several steps:

### 0. Get a short-lived token

Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/) and generate a `Short-Lived User Token` (valid for ~1 hour).

---

### 1. Exchange for a long-lived User Token

```
GET https://graph.facebook.com/v21.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={APP_ID}
  &client_secret={APP_SECRET}
  &fb_exchange_token={SHORT_LIVED_USER_TOKEN}
```

Response will contain `LONG_LIVED_USER_TOKEN` (valid for up to 60 days).

---

### 2. Get User ID

```
GET https://graph.facebook.com/v21.0/me?access_token={LONG_LIVED_USER_TOKEN}
```

Example response:

```json
{
  "name": "Name",
  "id": "000000111"
}
```

---

### 3. Get Permanent Page Token

```
GET https://graph.facebook.com/v21.0/{USER_ID}/accounts?access_token={LONG_LIVED_USER_TOKEN}
```

The response will include the user’s pages and their `access_token`.  
The token for the **Page** will be permanent (does not expire).

---

### 4. Verify the Token

Go to [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken) and paste your Page Token.  
If everything is correct, the token will be shown as permanent and can be safely used in API requests.

---

⚠️ **Important:**

- Always use the **Page Token** (not User Token) for posting, commenting, or fetching insights.
- Store the permanent Page Token securely in `.env` (`PERMANENT_PAGE_TOKEN`).

## Facebook App Setup

To use this project, you need to create a **Facebook App** and connect it to your Page.

1. Go to [Meta for Developers](https://developers.facebook.com/) and create a new app.
2. In **Add use cases**, choose:  
   **Manage everything on your Page — Publish content and videos, moderate posts and comments from followers on your Page and get insights on engagement.**
3. Add the **Pages API** product.
4. In **App Review**, request the following permissions:
   - `pages_manage_posts` — to publish content, photos, and videos to your Page.
   - `pages_read_engagement` — to read posts, comments, and engagement data.

⚠️ Without these permissions approved in review, your app will only work in **Development Mode** and only for users with admin/tester/developer roles.

## Installation

```bash
git clone <your-repo>
cd facebook-page-function
npm install
```

Create a `.env` file in the project root:

```env
PAGE_ID=your_facebook_page_id
PERMANENT_PAGE_TOKEN=your_permanent_page_token
APP_ID=your_app_id
APP_SECRET=your_app_secret
SHORT_LIVED_USER_TOKEN=your_short_lived_user_token
```

## Usage

### Import Functions

```js
const {
  getPermanentPageToken,
  postText,
  postImage,
  postMultipleImages,
  getPagePosts,
  deletePagePost,
  getPostInsights,
  commentOnPost,
  replyToComment,
} = require("./facebook");
```

### Examples

#### Post Text

```js
await postText(PAGE_ID, PERMANENT_PAGE_TOKEN, "🚀 Hello, Facebook!");
```

#### Post Single Image

```js
const fs = require("fs");
const imageBuffer = fs.readFileSync("./photo.jpg");

await postImage(PAGE_ID, PERMANENT_PAGE_TOKEN, imageBuffer, "🔥 New photo!");
```

#### Post Multiple Images

```js
const fs = require("fs");
const images = [
  fs.readFileSync("./photo1.jpg"),
  fs.readFileSync("./photo2.jpg"),
];

await postMultipleImages(
  PAGE_ID,
  PERMANENT_PAGE_TOKEN,
  images,
  "📸 Album post!"
);
```

#### Get Page Posts

```js
const posts = await getPagePosts(PAGE_ID, PERMANENT_PAGE_TOKEN, 5);
console.log(posts);
```

#### Delete Page Post

```js
await deletePagePost("post_id_here", PERMANENT_PAGE_TOKEN);
```

#### Get Post Insights

```js
const insights = await getPostInsights("post_id_here", PERMANENT_PAGE_TOKEN);
console.log(insights);
```

#### Comment on Post

```js
await commentOnPost("post_id_here", PERMANENT_PAGE_TOKEN, "Nice post! 👍");
```

#### Reply to Comment

```js
await replyToComment(
  "comment_id_here",
  PERMANENT_PAGE_TOKEN,
  "Thanks for your feedback!"
);
```

## Notes

- You need a **Facebook Page** and the correct permissions in your app to use these features.
- Page tokens can expire; use `getPermanentPageToken` to exchange short-lived tokens for long-lived ones.
- Make sure your app is in **Live mode** if you plan to use it in production.
