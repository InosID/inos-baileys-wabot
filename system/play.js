const { youtube } = require('../lib/scrape');

module.exports = async function({ msg, conn }) {
  try {
    const { body } = msg;
    let lastPlay = global.user[msg.sender]?.lastPlay; // Using optional chaining to handle undefined

    if (lastPlay && msg.quoted.sender === global.botNumber && msg.quoted.key === lastPlay.key) {
      // Check if lastPlay exists and the message is quoted by the bot

      // Check for audio-related keywords
      if (/audio|mp3|musi[ck]/.test(body.toLowerCase())) {
        console.log('executed: audio');
        let { url } = await youtube.ytmp3("https://youtu.be/" + lastPlay.id);

        // Send audio message
        conn.sendMessage(
          msg.from,
          {
            audio: { url: url },
            mimetype: "audio/mpeg",
          },
          { quoted: msg }
        );

        // Delete lastPlay after sending audio
        delete global.user[msg.sender]?.lastPlay;
      } else if (/vid[ei]o|mp4/.test(body.toLowerCase())) {
        console.log('execute: video');
        let { url, size } = await youtube.ytmp4("https://youtu.be/" + lastPlay.id);

        if (size.includes("MB") && size.split(" ")[0] * 5 > 100) {
          // Send a reply if the video size is too large
          await sendEmoteAndReply(global.largeFileSize, msg.key);
        } else {
          // Send video message
          conn.sendMessage(
            msg.from,
            {
              video: { url: url },
              mimetype: "video/mp4",
            },
            { quoted: msg }
          );
        }

        // Delete lastPlay after processing video
        delete global.user[msg.sender]?.lastPlay;
      }

      // Save user data after processing messages
      global.db.save('user', global.user);
    }
  } catch (e) {
    // Log any errors that may occur
    console.log(e);
  }
};
