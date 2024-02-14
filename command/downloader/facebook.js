// const { facebook } = require("../../lib/scrape");

// module.exports = {
//   name: "facebook",
//   alias: ["fb", "fbdl"],
//   category: "downloader",
//   use: "<link>",
//   isQuery: true,
//   isSpam: true,
//   async run({ conn, msg }, { query }) {
//     // Check if query is a valid URL and contains "fb.watch" or "facebook.com"
//     if (isUrl(query) && (query.match("fb.watch") || query.match("facebook.com"))) {
//       // Find the link in the query that matches either "facebook.com" or "fb"
//       let link = findLink(query, "facebook.com") || findLink(query, "fb");
//       // Call the 'snapsave' function from the 'facebook' module to retrieve video data
//       let data = await facebook.snapsave(link);
//       console.log('data', data)
//       if (data.status) {
//         // If data retrieval is successful, send the video to the chat
//         let { url } = data.data[0];
//         console.log('Url:', url)
//         conn.sendFile(msg.from, url, "", "", msg);
//       } else {
//         // If data retrieval fails, call the 'getvid' function from the 'facebook' module to retrieve HD video
//         let { Hd } = await facebook.getvid(link);
//         console.log('HD:', Hd)
//         return conn.sendFile(msg.from, Hd, "", "", msg);
//       }
//     } else {
//       // If query does not match the required format, send a 'notFoundQuery' message
//       db.setLinkFor('Facebook');
//       await send(chat.needUrlFrom, msg.key);
//     }
//   },
// };