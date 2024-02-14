const { gptweb } = require("gpti");

// Command to interact with GPT model for chat-based responses
module.exports = {
  name: "chatgpt",
  alias: ["chatgpt4", "chatgpt-4", "gpt", "gpt-4", "gpt4"],
  category: "ai",
  use: "<query>",
  isSpam: true,
  isQuery: true,

  // Asynchronous run function to handle the command logic
  async run({ msg }, { query }) {
    const result = await chatgpt(query) ? await chatgpt(query) : false;
    if (!result) return msg.reply('Terjadi kesalahan!')
    msg.reply(result.message)
  }
};

// Asynchronous function to interact with the GPT model for chat-based responses
async function chatgpt(query) {
  // Return a promise
  return new Promise((resolve) => {
    // Call the gpt function with the provided parameters
    gptweb(
      {
        prompt: query,
        markdown: false,
      },
      (err, data) => {
        // Resolve with the error if there is one, otherwise resolve with the GPT response and a success status
        if (err) {
          resolve(false);
        } else {
          resolve({ status: true, message: data.gpt });
        }
      },
    );
  });
}
