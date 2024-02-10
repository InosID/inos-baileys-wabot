const axios = require('axios');
const FormData = require('form-data');
const { webp2 } = require('../../lib/scrape');
const { sticker } = require('../../lib/convert');

module.exports = {
  // Command details
  name: "removebg",
  alias: ['removebackground', 'rmvbg', 'rmvbackground'],
  category: "converter",
  isSpam: true,
  cooldown: 5,

  // Command execution function
  async run({ conn, msg }) {
    try {
      // Create FormData instance for API request
      const formData = new FormData();

      // Check if the message contains an image or sticker
      if (msg.isQImage || msg.isImage || (msg.isQSticker && !msg.quoted.text.isAnimated)) {
        // Download the media file based on the message type
        let buffer = msg.isQSticker
          ? await webp2.webp2png(await msg.quoted.download())
          : msg.isQImage
          ? await msg.quoted.download()
          : await msg.download();

        if (!Buffer.isBuffer(buffer)) {
          buffer = await conn.getBuffer(buffer)
        }

        // Convert the buffer to base64
        const base64Image = Buffer.from(buffer).toString("base64");

        // Append necessary data to form data
        formData.append('size', 'auto');
        formData.append('image_file', Buffer.from(base64Image, 'base64'), 'filename.jpg'); // Set filename here

        // Make the API request
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
          headers: {
            ...formData.getHeaders(),
            'X-Api-Key': setting.api.removebg.key,
          },
          responseType: 'arraybuffer',
          encoding: null,
        });

        // Check if the request was successful
        if (response.status === 200) {
          // Determine whether to send as image or sticker
          if (msg.isImage || msg.isQImage) {
            conn.sendImage(msg.from, response.data);
          } else if (msg.isQSticker) {
            let stickerBuff = await sticker(response.data, {
              isImage: true,
              withPackInfo: true,
              packInfo: {
                packname: setting.defaultSticker.packname,
                author: setting.defaultSticker.author,
              },
              cmdType: "1",
            });
            await conn.sendMessage(
              msg.from,
              { sticker: stickerBuff },
              { quoted: msg }
            );
          }
        } else {
          // Log the error response data
          console.error('Error:', response.status, response.statusText);
          if (response.data) {
            console.error('Error Response Data:', response.data.toString());
          }
        }
      } else {
        // Send a reply for messages that are not valid images
        await send(global.onlyImageMedia, msg.key);
      }
    } catch (error) {
      // Log the error details
      console.error("Error:", error);

      // Check if the error has a response
      if (error.response) {
        console.log(error.response.data.toString());
      }
    }
  },
};
