const { instagram } = require("../../lib/scrape");

// Command to download content from Instagram links
module.exports = {
  name: "instagram",
  alias: ["ig", "igdl", "igstory"],
  use: "<link>",
  category: "downloader",
  cooldown: 5,
  isQuery: true,
  isSpam: true,

  // Asynchronous run function to handle the command logic
  async run({ conn, msg }, { query }) {
    // Check if the provided query is a valid Instagram link
    if (isUrl(query) && query.match("instagram.com")) {
      // Handle Instagram stories
      if (query.includes("/stories")) {
        let link = findLink(query, "/stories");
        let data = await instagram(link);
        // Send each story separately with a delay
        if (data.data[1]) {
          for (var i of data.data) {
            await delay(2000);
            conn.sendFile(msg.sender, i, "", "", msg);
          }
        } else {
          // Send the single file if there's only one
          conn.sendFile(msg.from, data.data[0], "", "", msg);
        }
      } else if (query.includes("?story_media")) {
        await send(chat.command.instagram.highlights, msg.key);
      } else {
        // Handle regular Instagram content
        let link = findLink(query, "instagram.com");
        let data = await instagram(link);
        // Send each file separately with a delay
        if (data.data[1]) {
          for (var i of data.data) {
            await delay(2000);
            conn.sendFile(msg.sender, i, "", "", msg);
          }
        } else {
          // Send the single file if there's only one
          conn.sendFile(msg.from, data.data[0], "", "", msg);
        }
      }
    } else {
      // Inform the user if the provided link is not valid
      db.setLinkFor('Instagram');
      return await send(global.needUrlFrom, msg.key);
    }
  }
}
