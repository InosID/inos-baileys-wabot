let Baileys = require('@adiwajshing/baileys');
let { readFileSync: read, writeFileSync: write } = require('fs');

let { help } = require('./../lib/help')
let { color } = require('./../lib/color')
let fetcher = require('./../lib/fetcher')

let _scommand = JSON.parse(read("./database/scommand.json"))
let nsfw = JSON.parse(read('./database/nsfw.json'))
//let sfw = JSON.parse(read('./database/sfw.json'))

let {
  gempa,
  wikiID,
  wikiEN
} = require('./command/information')
let { ind, eng } = require('./language')

let {
  nekonime,
  nsfwanime,
  hentai,
  yuri
} = require('./command/anime')

let {
  artiMimpi,
  artiNama,
  hariBaik,
  hariLarangan,
  kecocokanNama,
  ramalJodoh,
  ramalanJodoh,
  rejekiWeton,
  tanggalJadian,
  watakArtis
} = require('./command/primbon')

let {
  ytmp3,
  tiktok
} = require('./command/downloader')

let { githubstalk } = require('./command/stalker')
let { photofunia } = require('./command/maker')

require('./../config')

if (language == 'ind') {
  mess = ind
} else if (language == 'eng') {
  mess = eng
}

let Presence = Baileys.Presence
  global.online = Presence.available
    global.typing = Presence.composing
      global.recording = Presence.recording
        global.paused = Presence.paused

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

    if (multiPrefix == false) {
      var prefix = global.messConf.prefix[0]
    } else if (multiPrefix == true) {
      var prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~zZ+×_*!#%^&./\\©^]/.test(cmd) ? cmd.match(/^[°•π÷×¶∆£¢€¥®™✓=|~xzZ+×_*!#,|÷?;:%^&./\\©^]/gi) : '-'
    } else {
      console.log('[Multi Err] ' + multi + ' is a wrong boolean.')
    }
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
    let getGroupAdmins = (participants) => {
      admins = []
      for (let i of participants) {
        i.isAdmin ? admins.push(i.jid) : ''
      }
      return admins
    }
    let groupAdmins = isGroupMsg ? getGroupAdmins(groupMembers) : ''
    let isBotGroupAdmins = groupAdmins.includes(botNumber) || false
    let isGroupAdmins = groupAdmins.includes(sender) || false
    let isNsfw = isGroupMsg ? nsfw.includes(groupId) : false

    global.buffer = fetcher.getBuffer
    data = {
      msg: msg,
      type: type,
      from,
      CXD
    }
    require('./../lib/attr')(data)

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
      case 'help':
      case '?':
        CXD.reply(help(prefix))
      break
      case 'infogempa':
        CXD.reply(mess.wait())
        gempa.result()
          .then(async (res) => {
            buf = await buffer(res.thumbnail)
            CXD.sendButtonImg(from, buf,`╭﹝🄸🄽🄵🄾🄶🄴🄼🄿🄰﹞\n├ Waktu : ${res.waktu}\n├ Magnitude : ${res.magnitude}\n├ Koordinat : ${res.koordinat}\n├ Lokasi : ${res.lokasi}\n├ Dirasakan : ${res.dirasakan}\n╰────────`, "© Bot", [
              {
                buttonId: `${prefix}menu`,
                buttonText: {
                  displayText: '🔙 Back to menu',
                },
                type: 1,
              },
            ], { quoted: msg })
          })
      break
      case 'wiki':
        if (args.length < 1) return await CXD.reply(mess.needQuery())
        CXD.reply(mess.wait())
        wikiID.result(q)
          .then(async (res) => {
            CXD.sendButton(from, `╭﹝🅆🄸🄺🄸🄿🄴🄳🄸🄰﹞\n├ Judul : ${res.title}\n├ URL : ${res.url}\n├ Penerbit : ${res.publisher}\n├ Tanggal Diterbitkan : ${res.datePublished}\n├ Konteks : ${res.context}\n╰────────`, "© Bot", [
              {
                buttonId: `${prefix}menu`,
                buttonText: {
                  displayText: '🔙 Back to menu',
                },
                type: 1,
              },
            ], { quoted: msg })
          })
      break
      case 'wikien':
        if (args.length < 1) return await CXD.reply(mess.needQuery())
        CXD.reply(mess.wait())
        wikiEN.result(q)
          .then(async (res) => {
            CXD.sendButton(from, `╭﹝🅆🄸🄺🄸🄿🄴🄳🄸🄰﹞\n├ Title : ${res.title}\n├ URL : ${res.url}\n├ Publisher : ${res.publisher}\n├ Date Published : ${res.datePublished}\n├ Context : ${res.context}\n╰────────`, "© Bot", [
              {
                buttonId: `${prefix}menu`,
                buttonText: {
                  displayText: '🔙 Back to menu',
                },
                type: 1,
              },
            ], { quoted: msg })
          })
      break
      case 'nekonime':
        CXD.reply(mess.wait())
        nekonime.result()
          .then(async (res) => {
            buf = await buffer(res.image)
            CXD.sendButtonImg(from, buf, mess.done(), "© Bot", [
              {
                buttonId: `${prefix}nekonime`,
                buttonText: {
                  displayText: '➡️ Next',
                },
                type: 1,
              },
              {
                buttonId: `${prefix}menu`,
                buttonText: {
                  displayText: '🔙 Back to menu',
                },
                type: 1,
              },
            ], { quoted: msg })
          })
      break
      case 'nsfwanime':
        if (isGroupMsg) {
          if (!allow.nsfw) return CXD.sendButtonLoc(from, read('./../lib/fbi.jpg'), mess.notAllowed(), "© Bot", [
            {
              buttonId: `${prefix}menu`,
              buttonText: {
                displayText: '🔙 Back to menu',
              },
              type: 1,
            },
          ], { quoted: msg })
          if (!isNsfw) return CXD.sendButton(from, mess.nsfwOff(), "© Bot", [
            {
              buttonId: `${prefix}enable nsfw`,
              buttonText: {
                displayText: '🔛 Enable nsfw',
              },
              type: 1,
            },
            {
              buttonId: `${prefix}menu`,
              buttonText: {
                displayText: '🔙 Back to menu',
              },
              type: 1,
            },
          ], { quoted: msg })
          CXD.reply(mess.wait())
          nsfwanime.result()
            .then(async (res) => {
              buf = await buffer(res.image)
              CXD.sendButtonImg(from, buf, mess.done(), "© Bot", [
                {
                  buttonId: `${prefix}nsfwanime`,
                  buttonText: {
                    displayText: '➡️ Next',
                  },
                  type: 1,
                },
                {
                  buttonId: `${prefix}menu`,
                  buttonText: {
                    displayText: '🔙 Back to menu',
                  },
                  type: 1,
                },
              ], { quoted: msg })
            })
        } else {
          if (!allow.nsfw) return CXD.sendButtonLoc(from, read('./../lib/fbi.jpg'), mess.notAllowed(), "© Bot", [
            {
              buttonId: `${prefix}enable nsfw`,
              buttonText: {
                displayText: '🔛 Enable nsfw',
              },
              type: 1,
            },
            {
              buttonId: `${prefix}menu`,
              buttonText: {
                displayText: '🔙 Back to menu',
              },
              type: 1,
            },
          ], { quoted: msg })
          CXD.reply(mess.wait())
          nsfwanime.result()
            .then(async (res) => {
              buf = await buffer(res.image)
              CXD.sendButtonImg(from, buf, mess.done(), "© Bot", [
                {
                  buttonId: `${prefix}nsfwanime`,
                  buttonText: {
                    displayText: '➡️ Next',
                  },
                  type: 1,
                },
                {
                  buttonId: `${prefix}menu`,
                  buttonText: {
                    displayText: '🔙 Back to menu',
                  },
                  type: 1,
                },
              ], { quoted: msg })
            })
        }
      break
      case 'ytmp3':
        if (args.length < 1) return CXD.reply(mess.needLink())
        if (!isUrl(args[0]) && !args[0].includes('youtu')) return CXD.reply(mess.invalidLink())
        CXD.reply(mess.wait())
        ytmp3.result(q).then(async (res) => {
          var title = res[0].judul
          var quality = res[0].quality
          var type = res[0].tipe
          var size = res[0].size
          if (size < global.messConf.maxFileSize) {
            CXD.sendImage(from, res[0].thumb, mess.yt3res(title, quality, type, size), true)
            CXD.sendFileFromUrl(from, res[0].link, 'audio', null, true)
          } else {
            var link = res[0].link
            CXD.reply(mess.sizeMax(link))
          }
        })
      break
      case 'enable':
        if (!isGroupMsg) return CXD.reply(mess.onlyGroup())
        if (args.length < 1) return CXD.reply(mess.needQuery())
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
        if (!isGroupMsg) return CXD.reply(mess.onlyGroup())
        if (args.length < 1) return CXD.reply(mess.needQuery())
        switch(args[0]) {
          case 'nsfw':
            nsfw.splice(groupId, 1)
            write('./database/nsfw.json', JSON.stringify(nsfw))
            CXD.reply(mess.done())
          break
        }
      break
      case 'artinama':
        if (args.length < 1) return CXD.reply(mess.needQuery() + `\nExample: ${prefix}${command} Nazwa`)
        artiNama.result(q)
          .then(async (res) => {
            CXD.reply(res.result)
          })
      break
      case 'artimimpi':
        if (args.length < 1) return CXD.reply(mess.needQuery() + `\nExample: ${prefix}${command} jatuh`)
        artiMimpi.result(q)
          .then(async (res) => {
            CXD.reply(res.result)
          })
      break
      case 'haribaik':
        if (args.length < 1) return CXD.reply(mess.needQuery() + `\nExample: ${prefix}${command} 14-4-2004`)
        hariBaik.result(q)
          .then(async (res) => {
            CXD.reply(res.result)
          })
      break
      case 'harilarangan':
        if (args.length < 1) return CXD.reply(mess.needQuery() + `\nExample: ${prefix}${command} 14-4-2004`)
        hariLarangan.result(q)
          .then(async (res) => {
            CXD.reply(res.result)
          })
      break
      case 'kecocokannama':
        if (args.length < 1) return CXD.reply(mess.needQuery() + `\nExample: ${prefix}${command} Nazwa|14-4-2004`)
        var kn = body.slice(15)
        var nama = kn.split('|')[0]
        var tgl = kn.split('|')[1]
        kecocokanNama.result(nama, tgl)
          .then(async (res) => {
            CXD.reply(res.result)
          })
      break
      case 'ramaljodoh':
        if (args.length < 1) return CXD.reply(mess.needQuery() + `\nExample: ${prefix}${command} Nazwa|Aksa`)
        var rj = body.slice(12)
        var nama1 = rj.split('|')[0]
        var nama2 = rj.split('|')[1]
        ramalJodoh.result(nama1, nama2)
          .then(async (res) => {
            CXD.sendImage(from, res.thumbnail, `*Nama anda* : ${res.namaAnda}\n*Nama Pasangan* : ${res.namaPasangan}\n\n*Positif* : ${res.positif}\n\n*Negatif* : ${res.negatif}`, true)
          })
      break
      case 'ramalanjodoh':
        if (args.length < 1) return CXD.reply(mess.needQuery() + `\nExample: ${prefix}${command} Nazwa|14-4-2004|Aksa|14-4-2008`)
        var rj = body.slice(14)
        var nama1 = rj.split('|')[0]
        var tgl1 = rj.split('|')[1]
        var nama2 = rj.split('|')[2]
        var tgl2 = rj.split('|')[3]
        ramalanJodoh.result(nama1, tgl1, nama2, tgl2)
          .then(async (res) => {
            CXD.reply(res.result)
          })
      break
      case 'rejekiweton':
        if (args.length < 1) return CXD.reply(mess.needQuery() + `\nExample: ${prefix}${command} Nazwa|14-4-2004`)
        rejekiWeton.result(q)
          .then(async (res) => {
            CXD.sendImage(from, res.statistik, `Penjelasan: ${res.penjelasan}`, true)
          })
      break
      case 'tanggaljadian':
        if (args.length < 1) return CXD.reply(mess.needQuery() + `\nExample: ${prefix}${command} 14-4-2004`)
        tanggalJadian.result(q)
          .then(async (res) => {
            CXD.reply(res.result)
          })
      break
      case 'watakartis':
        if (args.length < 1) return CXD.reply(mess.needQuery() + `\nExample: ${prefix}${command} Nazwa|14-4-2004`)
        var wa = body.slice(12)
        var nama = wa.split('|')[0]
        var tgl = wa.split('|')[1]
        watakArtis.result(nama, tgl)
          .then(async (res) => {
            CXD.reply(res.result)
          })
      break
      case 'tiktok':
        if (args.length < 1) return CXD.reply(mess.needLink())
        CXD.reply(mess.wait())
        tiktok.musically(q)
          .then(async (res) => {
            CXD.sendFileFromUrl(from, res.url_wm, 'video', mess.done(), true)
          })
      break
      case 'hentai':
        if (isGroupMsg) {
          if (!allow.nsfw) return CXD.sendButtonLoc(from, read('./../lib/fbi.jpg'), mess.notAllowed(), "© Bot", [
            {
              buttonId: `${prefix}hentai`,
              buttonText: {
                displayText: '➡️ Next',
              },
              type: 1,
            },
            {
              buttonId: `${prefix}menu`,
              buttonText: {
                displayText: '🔙 Back to menu',
              },
              type: 1,
            },
          ], { quoted: msg })
          if (!isNsfw) return CXD.sendButton(from, mess.nsfwOff(), "© Bot", [
            {
              buttonId: `${prefix}enable nsfw`,
              buttonText: {
                displayText: '🔛 Enable nsfw',
              },
              type: 1,
            },
            {
              buttonId: `${prefix}menu`,
              buttonText: {
                displayText: '🔙 Back to menu',
              },
              type: 1,
            },
          ], { quoted: msg })
          CXD.reply(mess.wait())
          hentai.result()
            .then(async (res) => {
              buf = await buffer(res.image)
              CXD.sendButtonImg(from, buf, mess.done(), "© Bot", [
                {
                  buttonId: `${prefix}hentai`,
                  buttonText: {
                    displayText: '➡️ Next',
                  },
                  type: 1,
                },
                {
                  buttonId: `${prefix}menu`,
                  buttonText: {
                    displayText: '🔙 Back to menu',
                  },
                  type: 1,
                },
              ], { quoted: msg })
            })
        } else {
          if (!allow.nsfw) return CXD.sendButtonLoc(from, read('./../lib/fbi.jpg'), mess.notAllowed(), "© Bot", [
            {
              buttonId: `${prefix}menu`,
              buttonText: {
                displayText: '🔙 Back to menu',
              },
              type: 1,
            },
          ], { quoted: msg })
          CXD.reply(mess.wait())
          hentai.result()
            .then(async (res) => {
              buf = await buffer(res.image)
              CXD.sendButtonImg(from, buf, mess.done(), "© Bot", [
                {
                  buttonId: `${prefix}hentai`,
                  buttonText: {
                    displayText: '➡️ Next',
                  },
                  type: 1,
                },
                {
                  buttonId: `${prefix}menu`,
                  buttonText: {
                    displayText: '🔙 Back to menu',
                  },
                  type: 1,
                },
              ], { quoted: msg })
            })
        }
      break
      case 'yuri':
        if (isGroupMsg) {
          if (!allow.nsfw) return CXD.sendButtonLoc(from, read('./../lib/fbi.jpg'), mess.notAllowed(), "© Bot", [
            {
              buttonId: `${prefix}hentai`,
              buttonText: {
                displayText: '➡️ Next',
              },
              type: 1,
            },
            {
              buttonId: `${prefix}menu`,
              buttonText: {
                displayText: '🔙 Back to menu',
              },
              type: 1,
            },
          ], { quoted: msg })
          if (!isNsfw) return CXD.sendButton(from, mess.nsfwOff(), "© Bot", [
            {
              buttonId: `${prefix}enable nsfw`,
              buttonText: {
                displayText: '🔛 Enable nsfw',
              },
              type: 1,
            },
            {
              buttonId: `${prefix}menu`,
              buttonText: {
                displayText: '🔙 Back to menu',
              },
              type: 1,
            },
          ], { quoted: msg })
          CXD.reply(mess.wait())
          yuri.result()
            .then(async (res) => {
              buf = await buffer(res.image)
              CXD.sendButtonImg(from, buf, mess.done(), "© Bot", [
                {
                  buttonId: `${prefix}yuri`,
                  buttonText: {
                    displayText: '➡️ Next',
                  },
                  type: 1,
                },
                {
                  buttonId: `${prefix}menu`,
                  buttonText: {
                    displayText: '🔙 Back to menu',
                  },
                  type: 1,
                },
              ], { quoted: msg })
            })
        } else {
          if (!allow.nsfw) return CXD.sendButtonLoc(from, read('./../lib/fbi.jpg'), mess.notAllowed(), "© Bot", [
            {
              buttonId: `${prefix}menu`,
              buttonText: {
                displayText: '🔙 Back to menu',
              },
              type: 1,
            },
          ], { quoted: msg })
          CXD.reply(mess.wait())
          yuri.result()
            .then(async (res) => {
              buf = await buffer(res.image)
              CXD.sendButtonImg(from, buf, mess.done(), "© Bot", [
                {
                  buttonId: `${prefix}yuri`,
                  buttonText: {
                    displayText: '➡️ Next',
                  },
                  type: 1,
                },
                {
                  buttonId: `${prefix}menu`,
                  buttonText: {
                    displayText: '🔙 Back to menu',
                  },
                  type: 1,
                },
              ], { quoted: msg })
            })
        }
      break
      case 'promote':
        if (!isGroupMsg) return CXD.reply(mess.onlyGroup())
        if (!isGroupAdmins) return CXD.reply(mess.onlyAdmin())
        if (!isBotGroupAdmins) return CXD.reply(mess.onlyBotAdmin())
        if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return CXD.reply(mess.needTag())
        mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid
        if (mentioned.length > 1) {
          txtacc = mess.promoting() + `\n`
          for (let _ of mentioned) {
            teks += `@${_.split('@')[0]}\n`
          }
          CXD.SendTextWithMentions(teks, mentioned)
          CXD.groupMakeAdmin(from, mentioned)
        } else {
          CXD.SendTextWithMentions(`${mess.promoting()} @${mentioned[0].split('@')[0]}`, mentioned)
          CXD.groupMakeAdmin(from, mentioned)
        }
      break
      case 'demote':
        if (!isGroupMsg) return CXD.reply(mess.onlyGroup())
        if (!isGroupAdmins) return CXD.reply(mess.onlyAdmin())
        if (!isBotGroupAdmins) return CXD.reply(mess.onlyBotAdmin())
        if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return CXD.reply(mess.needTag())
        mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid
        if (mentioned.length > 1) {
          teks = ''
          for (let _ of mentioned) {
            teks += mess.demoting()
            teks += `@_.split('@')[0]`
          }
          CXD.SendTextWithMentions(teks, mentioned)
          CXD.groupDemoteAdmin(from, mentioned)
        } else {
          CXD.SendTextWithMentions(`${mess.demoting()} @${mentioned[0].split('@')[0]}`, mentioned)
          CXD.groupDemoteAdmin(from, mentioned)
        }
      break
      case 'githubstalk':
        if (args.length < 1) return CXD.reply(mess.needQuery())
        githubstalk.result(q)
          .then((res) => {
            nones = '_none_'
            if (res.bio == null || res.bio == undefined) {
              var bio = nones
            } else {
              bio = res.bio
            }
            if (res.company == null) {
              var company = nones
            } else {
              company = res.company
            }
            if (res.email == null) {
              var email = nones
            } else {
              email = res.email
            }
            if (res.twitter_username == null) {
              var twitter = nones
            } else {
              twitter = res.twitter_username
            }
            if (res.location == null || res.bio == undefined) {
              var locs = nones
            } else {
              locs = res.location
            }
            var fls = res.follower
            var flg = res.following
            CXD.sendImage(from, res.avatar, mess.ghstalk(q, bio, company, email, twitter, fls, flg, locs), true)
          })
      break
      case 'photofunia':
        if (args.length < 1) return CXD.reply(mess.needQuery())
        switch(args[0]) {
          case 'light':
            photofunia.result("https://m.photofunia.com/categories/all_effects/light-writing?server=1", args[1])
              .then(async (res) => {
                CXD.sendImage(from, res.result, mess.done(), true)
              })
          break
          case 'snow':
            photofunia.result("https://m.photofunia.com/categories/all_effects/snow-sign?server=1", args[1])
              .then(async (res) => {
                CXD.sendImage(from, res.result, mess.done(), true)
              })
          break
        }
      break
      default:
        CXD.setPresence(online)
        if (autoRead == true) {
          CXD.chatRead(from)
        }
    }
  } catch(err) {
    console.log(color("Error:", "red"), err)
  }
}
