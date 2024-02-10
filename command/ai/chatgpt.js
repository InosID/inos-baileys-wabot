const { gpt } = require("gpti");

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
    // Retrieve user messages or initialize an empty array
    const messages = user[msg.sender]?.gptmessages || [];

    // Delete messages if the array length exceeds 20
    if (messages.length > 20) {
      user[msg.sender].gptmessages = [];
    }

    // Create an array of user and assistant messages
    const arrayMessage = [
      ...messages,
      { role: "user", content: query }
    ];

    // Call the chatgpt function with the user's query and messages
    const result = await chatgpt(query, user[msg.sender].gptmessages);

    // Update user messages with the new array
    user[msg.sender].gptmessages = [
      ...arrayMessage,
      { role: "assistant", content: result.message },
    ];

    // Save user data to the database
    db.save("user", user);

    // Reply to the user with the assistant's response
    msg.reply(result.message);
  },
};

// Asynchronous function to interact with the GPT model for chat-based responses
async function chatgpt(query, messages = []) {
  // Return a promise
  return new Promise((resolve) => {
    // Call the gpt function with the provided parameters
    gpt(
      {
        messages,
        prompt: query,
        model: "gpt-4-32k",
        markdown: false,
      },
      (err, data) => {
        // Resolve with the error if there is one, otherwise resolve with the GPT response and a success status
        if (err) {
          resolve(err);
        } else {
          resolve({ status: true, message: data.gpt });
        }
      },
    );
  });
}
