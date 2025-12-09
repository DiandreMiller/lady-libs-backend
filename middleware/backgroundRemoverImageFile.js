const fs = require("node:fs");
const FormData = require("form-data");
require("dotenv").config();

const BACKGROUND_REMOVER_API_KEY = process.env.BACKGROUND_REMOVER_API_KEY;

async function removeBgIMG(filePath) {
  const formData = new FormData();
  formData.append("size", "auto");
  formData.append("image_file", fs.createReadStream(filePath));

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": BACKGROUND_REMOVER_API_KEY,
      ...formData.getHeaders(), // IMPORTANT
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

module.exports = removeBgIMG;