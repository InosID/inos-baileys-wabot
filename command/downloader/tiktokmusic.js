const { tiktok } = require("../../lib/scrape");

module.exports = {
  name: "tiktokmusic",
  alias: ["ttm", "ttmusic", "tiktokmusik", "tiktokm", "ttmusik"],
  category: "downloader",

  // Asynchronous run function to handle the command logic
  async run({ conn, msg }, { query, args }) {
    // Check if the provided URL is from TikTok
    if (isUrl(query) && args[0].match(/https?:\/\/(vt.)?tiktok.com/)) {
      // Extract TikTok link from the query
      const link = findLink(query, "tiktok.com");

      try {
        // Get TikTok data using the tiktok function
        const data = await tiktok(link);

        // Send the TikTok music as an audio message
        conn.sendMessage(
          msg.from,
          {
            audio: { url: data.result.music.url },
            mimetype: "audio/mpeg",
          },
          { quoted: msg }
        );
      } catch (error) {
        console.error("Error during TikTok music download:", error);
      }
    } else {
      // Inform the user to provide a TikTok URL
      db.setLinkFor('TikTok');
      return await send(global.needUrlFrom, msg.key);
    }
  }
};
