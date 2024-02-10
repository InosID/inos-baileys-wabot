const { youtube } = require('../../lib/scrape');

module.exports = {
  // Command details
  name: "ytmp4",
  alias: ["youtubemp4", "youtubeaudio", "ytv", "ytvideo"],
  category: "downloader",
  use: "<link>",
  example: "%cmd https://youtube.com/",
  cooldown: 5,
  isSpam: true,
  isQuery: true,

  // Command execution function
  async run({ msg, conn }, { query }) {
    // Check if the provided query is a valid URL
    if (args.length < 1) {
      return await send(chat.minWord, msg.key)
    }
    // Check if the URL is from YouTube
    if (isUrl(query) && args[0].includes("://youtu")) {
      let link = findLink(query, "youtu");
      let res = await youtube.ytmp4(link);
      let { url, size } = res;

      // Check if the video size is too large
      if (size.includes("MB") && size.split(" ")[0] * 5 > 100) {
        return await send(global.largeFileSize, msg.key);
      }

      // Send the video to the user
      conn.sendMessage(
        msg.from,
        {
          video: { url: url },
          mimetype: "video/mp4",
        },
        { quoted: msg }
      );
    } else {
      db.setLinkFor('YouTube');
      return await send(global.needUrlFrom, msg.key);
    }
  }
};
