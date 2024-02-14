const { youtube } = require('../../lib/scrape');

module.exports = {
  // Command details
  name: "ytmp3",
  alias: ["youtubemp3", "youtubeaudio", "ytaudio", "yta"],
  category: "downloader",
  use: "<link>",
  example: "%cmd https://youtube.com/",
  cooldown: 5,
  isSpam: true,
  isQuery: true,

  // Command execution function
  async run({ msg, conn }, { args }) {
    // Check if the argument includes a YouTube link
    if (args.length < 1) return await send(chat.minWord, msg.key)
    if (isUrl(query) && args[0].includes("://youtu")) {
      // Extract the YouTube link
      let link = findLink(args[0], "youtu");

      // Get the mp3 download link using the youtube scraper
      let res = await youtube.ytmp3(link);
      let { url } = res;

      // Send the audio file back to the user
      conn.sendMessage(
        msg.from,
        {
          audio: { url: url },
          mimetype: "audio/mpeg",
        },
        { quoted: msg }
      );
    } else {
      db.setLinkFor('YouTube');
      return await send(global.needUrlFrom, msg.key);
    }
  },
};
