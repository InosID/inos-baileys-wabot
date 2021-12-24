let Baileys = require('@adiwajshing/baileys')
let fetcher = require('./../lib/fetcher')

module.exports = attr = async (data) => {
  let msg = data.msg
  let this = data.CXD
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
  this.reply = (txt) => {
    this.sendMessage(from, txt, text, { quoted: msg })
  }
  this.sendText = (from, txt) => {
    this.sendMessage(from, txt, text)
  }
  this.sendImage = async (from, img, captions, replying) => {
    if (img.includes("https://")) {
      try {
        var fetch = await global.buffer(img)
        if (replying = true) {
          this.sendMessage(from, fetch, image, { caption: captions, quoted: msg })
        } else {
          this.sendMessage(from, fetch, image, { caption: captions })
        }
      } catch(e) {
        console.log(color("[ERROR]", "red"), e)
        this.reply(from, "Error!")
      }
    } else {
      try {
        var fetch = await global.buffer(img)
        if (replying = true) {
          this.sendMessage(from, fetch, image, { caption: captions, quoted: msg })
        } else {
          this.sendMessage(from, fetch, image, { caption: captions })
        }
      } catch(e) {
        console.log(color("[ERROR", "red"), e)
        this.reply(from, "Error!")
      }
    }
  }
  this.sendFile = (from, file, type, captions, replying) => {
    if (type == 'document') {
      if (replying == true) {
        this.sendMessage(from, file, type, { quoted: msg })
      } else {
        this.sendMessage(from, file, type)
      }
    } else if (type == 'image') {
      if (replying == true) {
        this.sendMessage(from, file, type, { caption: captions, quoted: msg })
      } else {
        this.sendMessage(from, file, type, { caption: captions })
      }
    } else if (type === 'video') {
      if (replying == true) {
        this.sendMessage(from, file, type, { caption: captions, quoted: msg })
      } else {
        this.sendMessage(from, file, type, { caption: captions })
      }
    } else if (type == 'audio') {
      if (replying == true) {
        this.sendMessage(from, file, type, { mimetype: Baileys.Mimetype.mp4Audio, quoted: msg })
      } else {
        this.sendMessage(from, file, type, { mimetype: Baileys.Mimetype.mp4Audio, })
      }
    } else if (type == 'gif') {
      if (replying == true) {
        this.sendMessage(from, file, video, { mimetype: Baileys.Mimetype.gif, quoted: msg, caption: captions })
      } else {
        this.sendMessage(from, file, video, { mimetype: Baileys.Mimetype.gif, caption: captions })
      }
    } else {
      console.log(color("[ERROR] ", "red") + 'File Type ' + type + ' not found.')
    }
  }
  this.sendFileFromUrl = async (from, url, type, captions, replying) => {
    if (type == 'document') {
      var fetch = await global.buffer(url)
      if (replying == true) {
        this.sendMessage(from, fetch, type, { quoted: msg })
      } else {
        this.sendMessage(from, fetch, type)
      }
    } else if (type == 'image') {
      var fetch = await global.buffer(url)
      if (replying == true) {
        this.sendMessage(from, fetch, type, { quoted: msg })
      } else {
        this.sendMessage(from, fetch, type)
      }
    } else if (type == 'video') {
      var fetch = await global.buffer(url)
      if (replying == true) {
        this.sendMessage(from, fetch, type, { quoted: msg })
      } else {
        this.sendMessage(from, fetch, type)
      }
    } else if (type == 'audio') {
      var fetch = await global.buffer(url)
      if (replying == true) {
        this.sendMessage(from, fetch, type, { mimetype: Baileys.Mimetype.mp4Audio, quoted: msg })
      } else {
        this.sendMessage(from, fetch, type, { mimetype: Baileys.Mimetype.mp4Audio })
      }
    } else if (type == 'gif') {
      var fetch = await global.buffer(url)
      if (replying == true) {
        this.sendMessage(from, fetch, video, { mimetype: Baileys.Mimetype.gif, quoted: msg, caption: captions })
      } else {
        this.sendMessage(from, fetch, video, { mimetype: Baileys.Mimetype.gif })
      }
    } else {
      console.log(color("[ERROR] ", "red") + 'File Type ' + type + ' not found.')
    }
  }
  this.sendButton = (from, text1, desc1, but = [], options = {}) => {
    const buttonMessage = {
      contentText: text1,
      footerText: desc1,
      buttons: but,
      headerType: 1,
    }
    this.sendMessage(from, buttonMessage, Baileys.MessageType.buttonsMessage, options)
  }
  this.sendButtonLoc = async(jid, buffer, content, footer, but = [], options = {}) => {
    let button = {
      locationMessage: { jpegThumbnail: buffer },                                             contentText: content,
      footerText: footer,
      buttons: but,
      headerType: 6
    }
    this.sendMessage(from, button, Baileys.MessageType.buttonsMessage, options)
  }
  this.sendButtonImg = async(jid, buffer, content, footer, but = [], options = {}) => {
    let buttonimg = {
      contentText: content,
      footerText: footer,
      buttons: but,
      headerType: 4,
      imageMessage: (await this.prepareMessageMedia(buffer, Baileys.MessageType.image, {})).imageMessage
    }
    this.sendMessage(from, buttonimg, Baileys.MessageType.buttonsMessage, options)
  }
  this.SendTextWithMentions = (teks, memberr, id) => {
    if (id == null || id == undefined) {
      id = true
    }
    (id == null || id == undefined || id == false) ? this.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : this.sendMessage(from, teks.trim(), extendedText, {quoted: msg, contextInfo: {"mentionedJid": memberr}})
  }
  this.setPresence = async(prs) => {
    await this.updatePresence(from, prs)
  }
}
