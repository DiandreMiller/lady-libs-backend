// removeBgURL.js
const FormData = require("form-data");
require("dotenv").config();

const BACKGROUND_REMOVER_API_KEY = process.env.BACKGROUND_REMOVER_API_KEY;
if (!BACKGROUND_REMOVER_API_KEY) {
  throw new Error("Missing BACKGROUND_REMOVER_API_KEY in environment");
}

async function removeBgURL(imageURL) {
  if (!imageURL) throw new Error("imageURL is required");

  const formData = new FormData();
  formData.append("size", "auto");
  formData.append("image_url", imageURL);

  const headers = {
    "X-Api-Key": BACKGROUND_REMOVER_API_KEY,
    ...formData.getHeaders(),
  };

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`remove.bg error ${res.status}: ${res.statusText} ${text}`);
  }

  // convert to Node Buffer
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = removeBgURL;