const { dalle } = require("gpti");

// Command to generate images using DALL-E model
module.exports = {
  name: "dall-e",
  alias: ['dalle', 'dale', 'dal-e'],
  category: "ai",
  use: "<query>",
  isSpam: true,
  isQuery: true,

  // Asynchronous run function to handle the command logic
  async run({ conn, msg }, { query }) {
    // Call the 'de' function to generate an image based on the query
    let imageArray = await de2(query) ? await de2(query) : await de(query) ? await de(query) : false;

    if (!imageArray) return msg.reply('Terjadi kesalahan')
    // Send the generated image as a reply to the user's message
    for (let i = 0; i < imageArray.length; i++) {
      conn.sendMessage(msg.from, { image: imageArray[i] }, { quoted: msg });
    }
  },
};

// Asynchronous function to interact with the DALL-E model and generate images
async function de(query) {
  // Return a promise
  return new Promise((resolve) => {
    // Call the DALL-E model with the provided prompt
    dalle.v1({ prompt: query }, (err, data) => {
      // Resolve with the error message if there is an error, otherwise resolve with the generated image
      if (err !== null) {
        resolve(err.message);
      } else {
        resolve(data.images);
      }
    });
  });
}

async function de2(query) {
  return new Promise((resolve) => {
    dalle.v2({ prompt: query, markdown: false })
  }, (err, data) => {
    if (err) {
      resolve(false)
    } else {
      resolve(data.images)
    }
  })
}