const { pinterest } = require('../../lib/scrape');

module.exports = {
  name: "pinterest",
  alias: ["pindl", "pin"],
  category: "downloader",
  use: "<url/query>",
  isQuery: true,
  isSpam: true,
  async run({ conn, msg }, { query }) {
    // Check if the query is a Pinterest URL
    if (query.includes("https://")) {
      // If it's a URL, fetch the video data from Pinterest
      let data = await pinterest.pinterestURL(query);
      // Send the video as a message attachment
      await conn.sendMessage(
        msg.from,
        {
          video: { url: data },
          mimetype: "video/mp4",
          caption: " ",
          fileName: "pinterest.mp4",
        },
        { quoted: msg }
      );
    } else {
      // If it's not a URL, perform a search on Pinterest
      try {
        // Search Pinterest for the query and get the result data
        let data = await pinterest.pinterestSearch(query);
        // Extract the URL from the result data
        let { url } = data;
        // Send the image as a message attachment
        conn.sendMessage(
          msg.from,
          {
            document: { url: url },
            mimetype: "image/jpeg",
            fileName: query
          },
          { quoted: msg }
        );
      } catch (error) {
        // Handle errors if the search fails
        await send(chat.notFoundQuery, msg.key);
        console.error('Error:', error);
      }
    }
  }
};
