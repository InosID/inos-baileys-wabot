let Baileys = require('@adiwajshing/baileys')
let fetcher = require('./../lib/fetcher')

module.exports = attr = async (data) => {
  let msg = data.msg
  let CXD = data.CXD
  let from = data.from
  let type = data.type
  let {
    text,
    extendedText,
    contact,
    location,
    liveLocation,
    image,
    video,
    sticker,
    document,
    audio,
    product,
    buttonsMessage
  } = Baileys.MessageType
  global.buffer = fetcher.getBuffer
  CXD.reply = (txt) => {
    CXD.sendMessage(from, txt, text, { quoted: msg })
  }
  CXD.sendText = (from, txt) => {
    CXD.sendMessage(from, txt, text)
  }
  CXD.sendImage = async (from, img, captions, replying) => {
    if (img.includes("https://")) {
      try {
        var fetch = await global.buffer(img)
        if (replying = true) {
          CXD.sendMessage(from, fetch, image, { caption: captions, quoted: msg })
        } else {
          CXD.sendMessage(from, fetch, image, { caption: captions })
        }
      } catch(e) {
        console.log(color("[ERROR]", "red"), e)
        CXD.reply(from, "Error!")
      }
    } else {
      try {
        var fetch = await global.buffer(img)
        if (replying = true) {
          CXD.sendMessage(from, fetch, image, { caption: captions, quoted: msg })
        } else {
          CXD.sendMessage(from, fetch, image, { caption: captions })
        }
      } catch(e) {
        console.log(color("[ERROR", "red"), e)
        CXD.reply(from, "Error!")
      }
    }
  }
  CXD.sendFile = (from, file, type, captions, replying) => {
    if (type == 'document') {
      if (replying == true) {
        CXD.sendMessage(from, file, type, { quoted: msg })
      } else {
        CXD.sendMessage(from, file, type)
      }
    } else if (type == 'image') {
      if (replying == true) {
        CXD.sendMessage(from, file, type, { caption: captions, quoted: msg })
      } else {
        CXD.sendMessage(from, file, type, { caption: captions })
      }
    } else if (type === 'video') {
      if (replying == true) {
        CXD.sendMessage(from, file, type, { caption: captions, quoted: msg })
      } else {
        CXD.sendMessage(from, file, type, { caption: captions })
      }
    } else if (type == 'audio') {
      if (replying == true) {
        CXD.sendMessage(from, file, type, { mimetype: Baileys.Mimetype.mp4Audio, quoted: msg })
      } else {
        CXD.sendMessage(from, file, type, { mimetype: Baileys.Mimetype.mp4Audio, })
      }
    } else if (type == 'gif') {
      if (replying == true) {
        CXD.sendMessage(from, file, video, { mimetype: Baileys.Mimetype.gif, quoted: msg, caption: captions })
      } else {
        CXD.sendMessage(from, file, video, { mimetype: Baileys.Mimetype.gif, caption: captions })
      }
    } else {
      console.log(color("[ERROR] ", "red") + 'File Type ' + type + ' not found.')
    }
  }
  CXD.sendFileFromUrl = async (from, url, type, captions, replying) => {
    if (type == 'document') {
      var fetch = await global.buffer(url)
      if (replying == true) {
        CXD.sendMessage(from, fetch, type, { quoted: msg })
      } else {
        CXD.sendMessage(from, fetch, type)
      }
    } else if (type == 'image') {
      var fetch = await global.buffer(url)
      if (replying == true) {
        CXD.sendMessage(from, fetch, type, { quoted: msg })
      } else {
        CXD.sendMessage(from, fetch, type)
      }
    } else if (type == 'video') {
      var fetch = await global.buffer(url)
      if (replying == true) {
        CXD.sendMessage(from, fetch, type, { quoted: msg })
      } else {
        CXD.sendMessage(from, fetch, type)
      }
    } else if (type == 'audio') {
      var fetch = await global.buffer(url)
      if (replying == true) {
        CXD.sendMessage(from, fetch, type, { mimetype: Baileys.Mimetype.mp4Audio, quoted: msg })
      } else {
        CXD.sendMessage(from, fetch, type, { mimetype: Baileys.Mimetype.mp4Audio })
      }
    } else if (type == 'gif') {
      var fetch = await global.buffer(url)
      if (replying == true) {
        CXD.sendMessage(from, fetch, video, { mimetype: Baileys.Mimetype.gif, quoted: msg, caption: captions })
      } else {
        CXD.sendMessage(from, fetch, video, { mimetype: Baileys.Mimetype.gif })
      }
    } else {
      console.log(color("[ERROR] ", "red") + 'File Type ' + type + ' not found.')
    }
  }
  CXD.sendButton = (from, text1, desc1, but = [], options = {}) => {
    const buttonMessage = {
      contentText: text1,
      footerText: desc1,
      buttons: but,
      headerType: 1,
    }
    CXD.sendMessage(from, buttonMessage, Baileys.MessageType.buttonsMessage, options)
  }
  CXD.sendButtonLoc = async(jid, buffer, content, footer, but = [], options = {}) => {
    let button = {
      locationMessage: { jpegThumbnail: buffer },                                             contentText: content,
      footerText: footer,
      buttons: but,
      headerType: 6
    }
    CXD.sendMessage(from, button, Baileys.MessageType.buttonsMessage, options)
  }
  CXD.sendButtonImg = async(jid, buffer, content, footer, but = [], options = {}) => {
    let buttonimg = {
      contentText: content,
      footerText: footer,
      buttons: but,
      headerType: 4,
      imageMessage: (await CXD.prepareMessageMedia(buffer, Baileys.MessageType.image, {})).imageMessage
    }
    CXD.sendMessage(from, buttonimg, Baileys.MessageType.buttonsMessage, options)
  }
  CXD.SendTextWithMentions = (teks, memberr) = {
    id = true
    (id == null || id == undefined || id == false) ? CXD.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : CXD.sendMessage(from, teks.trim(), extendedText, {quoted: msg, contextInfo: {"mentionedJid": memberr}})
  }
}
