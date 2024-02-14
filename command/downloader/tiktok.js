// Import the required module
const { tiktok } = require('../../lib/scrape');

// Export the module for the "tiktok" command
module.exports = {
  name: "tiktok",
  alias: ["ttdl", "tt"],
  category: "downloader",
  isQuery: true,

  // Asynchronous run function to handle the command logic
  async run({ conn, msg }, { query, args }) {
    // Check if the number of arguments is less than 1
    if (args.length < 1) {
      return await send(chat.minWord, msg.key);
    }

    // Check if the provided URL is from TikTok
    if (isUrl(query) && args[0].match(/https?:\/\/(vt.)?tiktok.com/)) {
      // Extract TikTok link from the query
      const link = findLink(query, "tiktok.com");

      try {
        // Get TikTok data using the tiktok function
        const data = await tiktok(link);

        // Check if the TikTok content is an image or a video
        if (data.result.is_image) {
          const { media } = data.result;

          // Send each image separately if there is more than one
          if (media.length > 1) {
            for (const i of media) {
              conn.sendMessage(
                msg.from,
                {
                  image: { url: i },
                },
                { quoted: msg }
              );
            }
          } else {
            // Send the single image
            conn.sendMessage(
              msg.from,
              {
                image: { url: media[0] },
              },
              { quoted: msg }
            );
          }
        } else {
          // If it's a video, send the video
          const { media } = data.result;
          conn.sendMessage(
            msg.from,
            {
              video: { url: media }
            },
            { quoted: msg }
          );
        }
      } catch (error) {
        console.error("Error during TikTok download:", error);
      }
    } else {
      // Inform the user to provide a TikTok URL
      db.setLinkFor('TikTok');
      return await send(global.needUrlFrom, msg.key);
    }
  }
};