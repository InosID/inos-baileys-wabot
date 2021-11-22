let Baileys = require('@adiwajshing/baileys')
let fs = require('fs')
let axios = require('axios')
let get = require('got')

let fetcher = require('./../lib/fetcher')
let { color } = require('./../lib/color')
let _scommand = JSON.parse(fs.readFileSync("./database/scommand.json"))
let { help } = require('./../lib/help')
let { gempa, wikiInd, wikiEng } = require('./command/information')
let { ind, eng } = require('./language')
require('./../config')

if (language == 'ind') {
  mess = ind
} else if (language == 'eng') {
  mess = eng
}

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

    let prefix = global.messConf.prefix[0]
    body = type === 'listResponseMessage' && msg.message.listResponseMessage.title ? msg.message.listResponseMessage.title: type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId: type == "conversation" && msg.message.conversation.startsWith(prefix) ? msg.message.conversation: type == "imageMessage" && msg.message.imageMessage.caption.startsWith(prefix) ? msg.message.imageMessage.caption: type == "videoMessage" && msg.message.videoMessage.caption.startsWith(prefix) ? msg.message.videoMessage.caption: type == "extendedTextMessage" && msg.message.extendedTextMessage.text.startsWith(prefix) ? msg.message.extendedTextMessage.text: ""
    let chats = (type === 'conversation') ? msg.message.conversation: (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text: ''
    let command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
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

    global.buffer = fetcher.getBuffer

    CXD.reply = (from, txt) => {
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
          CXD.sendMessage(from, file, type, { mimetype: 'audio/mp4', quoted: msg })
        } else {
          CXD.sendMessage(from, file, type, { mimetype: 'audio/mp4', })
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
          CXD.sendMessage(from, type, { quoted: msg })
        } else {
          CXD.sendMessage(from, fetch, type)
        }
      } else if (type == 'audio') {
        var fetch = await global.buffer(url)
        if (replying == true) {
          CXD.sendMessage(from, fetch, type, { mimetype: 'audio/mp4', quoted: msg })
        } else {
          CXD.sendMessage(from, fetch, type, { mimetype: 'audio/mp4' })
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

    global.pushname = CXD.contacts[sender] != undefined ? CXD.contacts[sender].vname || CXD.contacts[sender].notify : undefined

    let isMedia = type === "imageMessage" || type === "videoMessage"
    let isQuotedImage = type === "extendedTextMessage" && content.includes("imageMessage")
    let isQuotedVideo = type === "extendedTextMessage" && content.includes("videoMessage")
    let isQuotedAudio = type === "extendedTextMessage" && content.includes("audioMessage")
    let isQuotedSticker = type === "extendedTextMessage" && content.includes("stickerMessage")
    if (isCmd && isGroupMsg) console.log('[CXD]', body, 'from', sender.split('@')[0], 'args :', args.length)
    if (!isGroupMsg && isCmd) console.log('[CXD]', body, 'from', sender.split('@')[0], 'args :', args.length)
    switch(command) {
      case 'menu':
        CXD.reply(from, help(prefix))
      break
      case 'infogempa':
        CXD.reply(from, mess.wait)
        gempa.gempa()
          .then(async (res) => {
            CXD.sendImage(from, res.thumbnail, `╭﹝🄶🄴🄼🄿🄰🄱🅄🄼🄸 🅃🄴🅁🄺🄸🄽🄸﹞\n├ Waktu : ${res.waktu}\n├ Magnitude : ${res.magnitude}\n├ Koordinat : ${res.koordinat}\n├ Lokasi : ${res.lokasi}\n├ Dirasakan : ${res.dirasakan}\n╰────────`, true)
        })
      break
      case 'wiki':
        CXD.reply(from, mess.wait())
        wikiInd.wikiID(q)
          .then(async (res) {
            CXD.reply(from, `╭﹝🅆🄸🄺🄸🄿🄴🄳🄸🄰﹞\n├ Judul : ${res.title}\n├ URL : ${res.url}\n├ Penerbit : ${res.publisher}\n├ Tanggal Diterbitkan : ${res.datePublished}\n├ Konteks : ${res.context}\n╰────────`)
          })
      break
      case 'wikien':
        CXD.reply(from, mess.wait())
        wikiEng.wikiEN(q)
          .then(async (res) {
            CXD.reply(from, `╭﹝🅆🄸🄺🄸🄿🄴🄳🄸🄰﹞\n├ Title : ${res.title}\n├ URL : ${res.url}\n├ Publisher : ${res.publisher}\n├ Date Published : ${res.datePublished}\n├ Context : ${res.context}\n╰────────`)
          })
      break
    }
  } catch(err) {
    console.log(color("Error:", "red"), err)
  }
}
