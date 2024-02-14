const { webp2 } = require("../../lib/scrape");

module.exports = {
  name: "toimage",
  alias: ["tovid", "toimg", "tomp4"],
  category: "converter",
  isSpam: true,
  async run({ msg, conn }) {
    // Check if the message contains a quoted sticker
    if (msg.quoted && /sticker/.test(msg.quoted.mtype)) {
      let out;
      // Convert static sticker to image
      if (!msg.quoted.text.isAnimated) {
        out = await webp2.webp2png(await msg.quoted.download());
        await conn.sendFile(msg.from, out, "image.mp4", "", msg);
      }
      // Convert animated sticker to video
      else {
        out = await webp2.webp2mp4(await msg.quoted.download());
        await conn.sendFile(msg.from, out, "image.jpeg", "", msg);
      }
    } else {
      return send(chat.needReplySticker, msg.key)
    }
  },
};