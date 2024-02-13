const { Client } = require('youtubei');

// Create a new instance of the YouTube client
const yt = new Client();

// Command to search and play YouTube videos
module.exports = {
  name: "play",
  alias: ["playyt", "ytplay", "youtubeplay", "playyoutube"],
  category: "downloader",
  use: "<query>",
  example: "%cmd title of the video you want to download",
  cooldown: 5,
  isSpam: true,
  isQuery: true,

  // Asynchronous run function to handle the command logic
  async run({ conn, msg }, { args, query }) {
    try {
      // Check if the query has enough words
      if (args.length < 1) {
        return await send(chat.minWord, msg.key);
      }

      // Search for the video on YouTube
      const search = await yt.search(query, { type: "video" });

      // Extract relevant information from the search result
      const result = search['items'].map((v) => {
        return {
          title: v.title,
          thumbnail: v.thumbnails[0],
          id: v.id,
          desc: v.description,
          date: v.uploadDate,
        };
      })[0];

      // Handle the case where no results are found
      if (!result) {
        await send(chat.notFoundQuery, msg.key)
        return;
      }

      // Replace placeholders in the play command text and send the message
      const str = chat.command.play.text
        .replace(':title:', result.title)
        .replace(':date:', result.date)
        .replace(':desc:', result.desc);

      let sended = conn.sendThumbnail(msg.from, result.thumbnail.url, {
        title: "PLAY",
        body: result.title,
        text: str,
      });

      // Save the result to the user's data
      global.user[msg.sender].lastPlay = {
        ...result,
        key: sended.key
      };
      global.db.save('user', global.user);
    } catch (error) {
      // Handle errors from YouTube search
      console.error("Error during YouTube search:", error);
    }
  }
};
