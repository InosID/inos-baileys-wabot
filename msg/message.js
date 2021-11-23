let Baileys = require('@adiwajshing/baileys');
let { readFileSync: read, writeFileSync: write } = require('fs');

let { help } = require('./../lib/help')
let { color } = require('./../lib/color')
let fetcher = require('./../lib/fetcher')

let _scommand = JSON.parse(read("./database/scommand.json"))
let nsfw = JSON.parse(read('./database/nsfw.json'))
let sfw = JSON.parse(read('./database/sfw.json'))

let {
  gempa,
  wikiInd,
  wikiEng
} = require('./command/information')
let { ind, eng } = require('./language')

let {
  nekonime,
  nsfwanime
} = require('./command/anime')

let { ytmp3 } = require('./command/downloader')

require('./../config')

if (language == 'ind') {
  mess = ind
} else if (language == 'eng') {
  mess = eng
}

module.exports = msgMain = async(CXD = new conn, msg) => {
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
    let groupMetadata = isGroupMsg ? await CXD.groupMetadata(from) : ''
    let groupName = isGroupMsg ? groupMetadata.subject : ''
    let groupId = isGroupMsg ? groupMetadata.id : ''
    let groupMembers = isGroupMsg ? groupMetadata.participants : ''
    let isNsfw = isGroupMsg ? nsfw.includes(groupId) : false

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
          CXD.sendMessage(from, type, { quoted: msg })
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

    let isUrl = (url) => {
      return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
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
        CXD.reply(help(prefix))
      break
      case 'infogempa':
        CXD.reply(mess.wait)
        gempa.gempa()
          .then(async (res) => {
            CXD.sendImage(from, res.thumbnail, `╭﹝🄶🄴🄼🄿🄰🄱🅄🄼🄸 🅃🄴🅁🄺🄸🄽🄸﹞\n├ Waktu : ${res.waktu}\n├ Magnitude : ${res.magnitude}\n├ Koordinat : ${res.koordinat}\n├ Lokasi : ${res.lokasi}\n├ Dirasakan : ${res.dirasakan}\n╰────────`, true)
        })
      break
      case 'wiki':
        if (args.length < 1) return await CXD.reply(mess.needQuery())
        CXD.reply(mess.wait())
        wikiInd.wikiID(q)
          .then(async (res) => {
            CXD.reply(`╭﹝🅆🄸🄺🄸🄿🄴🄳🄸🄰﹞\n├ Judul : ${res.title}\n├ URL : ${res.url}\n├ Penerbit : ${res.publisher}\n├ Tanggal Diterbitkan : ${res.datePublished}\n├ Konteks : ${res.context}\n╰────────`)
          })
      break
      case 'wikien':
        if (args.length < 1) return await CXD.reply(mess.needQuery())
        CXD.reply(mess.wait())
        wikiEng.wikiEN(q)
          .then(async (res) => {
            CXD.reply(`╭﹝🅆🄸🄺🄸🄿🄴🄳🄸🄰﹞\n├ Title : ${res.title}\n├ URL : ${res.url}\n├ Publisher : ${res.publisher}\n├ Date Published : ${res.datePublished}\n├ Context : ${res.context}\n╰────────`)
          })
      break
      case 'nekonime':
        CXD.reply(mess.wait())
        nekonime.neko()
          .then(async (res) => {
            CXD.sendImage(from, res.image, mess.done(), true)
          })
      break
      case 'nsfwanime':
        if (allow.nsfw) return CXD.reply(mess.notAllowed())
        if (!isNsfw) return CXD.reply(mess.nsfwOff())
        CXD.reply(mess.wait())
        nsfwanime.nsfwanime()
          .then(async (res) => {
            CXD.sendImage(from, res.image, mess.done(), true)
          })
      break
      case 'ytmp3':
        if (args.length < 1) return CXD.reply(mess.needLink())
        if (!isUrl(args[0]) && !args[0].includes('youtu')) return CXD.reply(mess.invalidLink())
        CXD.reply(mess.wait())
        ytmp3.ytdl3(q).then(async (res) => {
          var title = res[0].judul
          var quality = res[0].quality
          var type = res[0].tipe
          var size = res[0].size
          CXD.sendImage(from, res[0].thumb, mess.yt3res(title, quality, type, size), true)
          CXD.sendFileFromUrl(from, res[0].link, 'audio', null, true)
        })
      break
      case 'enable':
        switch(args[0]) {
          case 'nsfw':
            if (isNsfw) return CXD.reply(mess.nsfwHasOn())
            nsfw.push(groupId, 1)
            write('./database/nsfw.json', JSON.stringify(nsfw))
            CXD.reply(mess.done())
          break
        }
      break
      case 'disable':
        switch(args[0]) {
          case 'nsfw':
            nsfw.splice(groupId, 1)
            write('./database/nsfw.json', JSON.stringify(nsfw))
            CXD.reply(mess.done())
          break
        }
      break
    }
  } catch(err) {
    console.log(color("Error:", "red"), err)
  }
}
