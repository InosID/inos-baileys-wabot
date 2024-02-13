const axios = require("axios").default;

// Creating an instance of Axios for Sticker API
const sticker = axios.create({
  baseURL: "https://sticker-api-tpe3wet7da-uc.a.run.app"
});

module.exports = {
  // Command details
  name: 'sticker',
  alias: ['s', 'stiker', 'stickergif', 'stikergif', 'gifsticker', 'gifstiker', 'take'],
  use: "[packname]|[authorname]",
  category: 'converter',
  isSpam: true,
  cooldown: 5,

  // Command execution function
  async run({ conn, msg }, { query }) {
    // Splitting the command arguments
    const q = query.split('|');

    // Extracting packname and author from arguments or using default values
    let packname = q[0] || setting.defaultSticker.packname;
    let author = q[1] || setting.defaultSticker.author;

    const { isImage, isQImage, isQSticker, isVideo, isQDocument, isQVideo} = msg

    try {
      // Handling image or sticker
      if (isImage || isQImage || isQSticker) {
        const buffer = isQImage || isQSticker ? await msg.quoted.download() : await msg.download();
        const data = {
          image: `data:image/jpeg;base64,${buffer.toString("base64")}`,
          stickerMetadata: {
            pack: packname,
            author: author,
            keepScale: true,
            circle: false,
            removebg: false
          }
        };
        const res = await sticker.post("/prepareWebp", data);

        // Sending the sticker
        conn.sendMessage(msg.from, { sticker: Buffer.from(res.data.webpBase64, "base64") }, { quoted: msg });
      } else if (isVideo || isQVideo) {
        // Handling video
        if ((isQVideo ? msg.quoted?.message?.videoMessage?.seconds : msg.message?.videoMessage?.seconds) >= 10) {
          return send(global.largeFileSize, msg.key);
        }

        const buffer = isQVideo ? await msg.quoted.download() : await msg.download();
        const data = {
          file: `data:video/mp4;base64,${buffer.toString("base64")}`,
          stickerMetadata: {
            pack: packname,
            author: author,
            keepScale: true,
          },
          processOptions: {
            crop: false,
            fps: 10,
            startTime: "00:00:00.0",
            endTime: "00:00:7.0",
            loop: 0,
          }
        };

        const res = await sticker.post("/convertMp4BufferToWebpDataUrl", data);

        // Sending the sticker
        conn.sendMessage(
          msg.from,
          { sticker: Buffer.from(res.data.split(";base64,")[1], "base64") },
          { quoted: msg }
        );
      } else if (isQDocument && (/image|video/.test(msg.quoted?.message?.documentMessage?.mimetype))) {
        // Handling document (image or video)
        const inImage = /image/.test(msg.quoted?.message?.documentMessage?.mimetype);
        const inVideo = /video/.test(msg.quoted?.message?.documentMessage?.mimetype);

        const buffer = await msg.quoted.download();

        if (inImage) {
          const data = {
            image: `data:image/jpeg;base64,${buffer.toString("base64")}`,
            stickerMetadata: {
              pack: packname,
              author: author,
              keepScale: true,
              circle: false,
              removebg: false
            }
          };

          const res = await sticker.post("/prepareWebp", data);

          // Sending the sticker
          conn.sendMessage(
            msg.from,
            { sticker: Buffer.from(res.data.webpBase64, "base64") },
            { quoted: msg }
          );
        } else if (inVideo) {
          // Handling video from document
          const data = {
            file: `data:video/mp4;base64,${buffer.toString("base64")}`,
            stickerMetadata: {
              pack: packname,
              author: author,
              keepScale: true,
            },
            processOptions: {
              crop: false,
              fps: 10,
              startTime: "00:00:00.0",
              endTime: "00:00:7.0",
              loop: 0
            }
          };

          const res = await sticker.post("/convertMp4BufferToWebpDataUrl", data);

          // Sending the sticker
          conn.sendMessage(
            msg.from,
            { sticker: Buffer.from(res.data.split(";base64,")[1], "base64") },
            { quoted: msg }
          );
        }
      } else {
        // Handling missing media
        return await send(global.missingMedia, msg.key);
      }
    } catch (err) {
      console.log(err);
      await send(global.failed, msg.key);
    }
  }
};
