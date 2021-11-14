let Baileys = require('@adiwajshing/baileys')
let { color } = require('./../lib/color')
let fs = require('fs')
let _scommand = JSON.parse(fs.readFileSync("./database/scommand.json"))

require('./../config')

module.exports = msgMain = (CXD = new conn, msg) => {
  try {
    if (!msg.hasNewMessage) return
    msg = msg.messages.all()[0]
    if (!msg.message) return
    if (msg.key && msg.key.remoteJid == 'status@broadcast') return
    msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message: msg.message
    let content = JSON.stringify(msg.message)
    let from = msg.key.remoteJid
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
    type = Object.keys(msg.message)[0]
    cmd = type === "conversation" && msg.message.conversation ? msg.message.conversation: type == "imageMessage" && msg.message.imageMessage.caption ? msg.message.imageMessage.caption: type == "videoMessage" && msg.message.videoMessage.caption ? msg.message.videoMessage.caption: type == "extendedTextMessage" && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text: type == "buttonsResponseMessage" && msg.message[type].selectedButtonId ? msg.message[type].selectedButtonId: ""
    let getCmd = (id) => { let position = null
      Object.keys(_scommand).forEach((i) => {
        if (_scommand[i].id === id) {
          position = i
        }
      })
      if (position !== null) {
        return _scommand[position].chats
      }
    }
    let prefix = global.botConf.prefix[0]
    body = type === 'listResponseMessage' && msg.message.listResponseMessage.title ? msg.message.listResponseMessage.title: type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId: type == "conversation" && msg.message.conversation.startsWith(prefix) ? msg.message.conversation: type == "imageMessage" && msg.message.imageMessage.caption.startsWith(prefix) ? msg.message.imageMessage.caption: type == "videoMessage" && msg.message.videoMessage.caption.startsWith(prefix) ? msg.message.videoMessage.caption: type == "extendedTextMessage" && msg.message.extendedTextMessage.text.startsWith(prefix) ? msg.message.extendedTextMessage.text: ""
    let chats = (type === 'conversation') ? msg.message.conversation: (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text: ''
    listbut = (type == 'listResponseMessage') ? msg.message.listResponseMessage.title: ''
    let args = body.trim().split(/ +/).slice(1)
    let isCmd = body.startsWith(prefix)
    let q = args.join(' ')
    let botNumber = CXD.user.jid
    let isGroupMsg = from.endsWith("@g.us")
    let sender = isGroupMsg ? msg.participant : msg.key.remoteJid
    let groupMetadata = isGroupMsg ? CXD.groupMetadata(from) : ''
    let groupName = isGroupMsg ? groupMetadata.subject : ''
    let groupId = isGroupMsg ? groupMetadata.jid : ''
    let groupMembers = isGroupMsg ? groupMetadata.participants : ''

    global.pushname = CXD.contacts[sender] != undefined ? CXD.contacts[sender].vname || CXD.contacts[sender].notify : undefined

    let isMedia = type === "imageMessage" || type === "videoMessage"
    let isQuotedImage = type === "extendedTextMessage" && content.includes("imageMessage")
    let isQuotedVideo = type === "extendedTextMessage" && content.includes("videoMessage")
    let isQuotedAudio = type === "extendedTextMessage" && content.includes("audioMessage")
    let isQuotedSticker = type === "extendedTextMessage" && content.includes("stickerMessage")
    if (isCmd && isGroupMsg) console.log('[CXD]', body, 'from', sender.split('@')[0], 'args :', args.length)
    if (!isGroupMsg && isCmd) console.log('[CXD]', body, 'from', sender.split('@')[0], 'args :', args.length)
    switch(body) {
      case prefix + 'p':
        CXD.reply('Test')
      break
    }
  } catch(err) {
    console.log(color("Error:", "red"), err)
  }
}
