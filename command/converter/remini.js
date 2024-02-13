const { remini } = require('betabotz-tools');
const { webp2 } = require('../../lib/scrape');

module.exports = {
  name: "remini",
  alias: ["hd", "rescale", "hdr"],
  category: "converter",
  async run({ msg, conn }) {
    if (msg.isQSticker || msg.isQVideo || msg.isVideo) {
      return await send(chat.onlyImageMedia, msg.key);
    }
    if (msg.isQImage || msg.isImage) {
      let webp = await webp2.webp2png(msg.isImage ? await msg.download() : await msg.quoted.download())
      let data = await remini(webp);
      if (data.image_data === undefined) {
        data = await srgan4x(data);
        return conn.sendFile(msg.from, data.result, "", "", msg);
      }
      conn.sendFile(msg.from, data.image_data, "", "", msg);
    } else if (msg.isQDocument && /image/.test(msg.quoted.message.documentMessage.mimetype)) {
      let webp = await webp2.webp2png(await msg.quoted.download());
      let data = await remini(webp);
      if (data.image_data === undefined) {
        data = await srgan4x(data);
        return conn.sendFile(msg.from, data.result, "", "", msg);
      }
      conn.sendFile(msg.from, data.image_data, "", "", msg);
    } else {
      await send(chat.onlyImageMedia, msg.key);
    }
  }
}