let {
  default: makeWASocket,
  DisconnectReason,
  useSingleFileAuthState,
  fetchLatestBaileysVersion,
  AnyMessageContent,
  delay,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  makeInMemoryStore,
} = require('@adiwajshing/baileys')
let { readFileSync: read, writeFileSync: write, unlinkSync: remove } = require('fs');
let { help, welcomeOpt } = require('./../lib/help')
let { color } = require('./../lib/color')
let fetcher = require('./../lib/fetcher')
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
  wallpaper
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
  ytmp4,
  tiktok,
  igstory
} = require('./command/downloader')
let {
  halah,
  hilih,
  shortlink
} = require('./command/other')
let {
  addGame,
  getGameAnswer,
  isGame,
  checkGameTime,
  getGamePosi
} = require('./command/game')
let { welcome } = require('./command/group')
let { githubstalk } = require('./command/stalker')
let { photofunia } = require('./command/maker')
let { moduleWA } = require('./../lib/simple')

let _scommand = JSON.parse(read("./database/scommand.json"))
let nsfw = JSON.parse(read('./database/nsfw.json'))
let _welcome = JSON.parse(read('./database/welcome.json'))

require('./../config')

if (language == 'ind') {
  mess = ind
} else if (language == 'eng') {
  mess = eng
}

var gameArray = {
  tekateki: []
}

module.exports = msgMain = async(CXD, chatUpdate, store) => {
  try {
    msg = chatUpdate.messages[0]
    if (!msg.message) return
    if (msg.key && msg.key.remoteJid == 'status@broadcast') return
    msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message: msg.message
    m = moduleWA(CXD, msg, store)
    m.isBaileys = m.key.id.startsWith('BAE5') || m.key.id.startsWith('3EB0')
    let content = JSON.stringify(msg.message)
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
      console.log('[Multi Err] ' + multiPrefix + ' is a wrong boolean.')
    }
    var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
    let chats = (typeof m.text == 'string' ? m.text : '')
    let command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
    listbut = (type == 'listResponseMessage') ? msg.message.listResponseMessage.title: ''
    let args = chats.trim().split(/ +/).slice(1)
    const isCmd = chats.startsWith(prefix)
    let q = args.join(' ')
    let botNumber = CXD.user.id
    let quoted = m.quoted ? m.quoted : m
    let from = m.key.remoteJid
    let isGroup = msg.key.remoteJid.endsWith('@g.us')
    let sender = isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
    let groupMetadata = isGroup ? await CXD.groupMetadata(from) : null
    let groupName = isGroup ? groupMetadata.subject : ''
    let groupId = isGroup ? groupMetadata.id : ''
    let groupMembers = isGroup ? groupMetadata.participants : ''
    let getGroupAdmins = (participants) => {
      admins = []
      for (let i of participants) {
        i.isAdmin ? admins.push(i.jid) : ''
      }
      return admins
    }
    let groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
    let isBotGroupAdmins = groupAdmins.includes(botNumber) || false
    let isGroupAdmins = groupAdmins.includes(sender) || false
    let isNsfw = isGroup ? nsfw.includes(groupId) : false
    let isWelcome = isGroup ? _welcome.includes(groupId) : false

    global.buffer = fetcher.getBuffer
    data = {
      msg: msg,
      type: type,
      from,
      CXD: CXD,
      content,
      args,
      sender,
      m
    }

    require('./../lib/attr')(data)

    let isUrl = (url) => {
      return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
    }

    global.pushname = m.pushname

    const isImage = (type == 'imageMessage')
    const isVideo = (type == 'videoMessage')
    const isSticker = (type == 'stickerMessage')
    const isQuotedMsg = (type == 'extendedTextMessage')

    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
    const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
    const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
    const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false

    // Game function
    checkGameTime(CXD, gameArray.tekateki)
    try {
      if (isGame(from, gameArray.tekateki)) {
        if (quoted && m.msg.contextInfo.participant.includes(botNumber.split(':')[0])) {
          if (chats.toLowerCase().includes(getGameAnswer(from, gameArray.tekateki))) {
            CXD.reply(mess.gameCorrectAnswer())
            gameArray.tekateki.splice(getGamePosi(from, gameArray.tekateki), 1)
          } else {
            CXD.reply(mess.gameWrongAnswer())
          }
        } else {
          console.log('[GAME] User does not reply to bot messages')
        }
      }
    } catch {
      return
    }

    if (isCmd && isGroup) console.log('[CXD]', 'from', body, sender.split('@')[0], 'args :', args.length)
    if (!isGroup && isCmd) console.log('[CXD]', 'from', body, sender.split('@')[0], 'args :', args.length)
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
            buf = res.thumbnail
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
            buf = res.image
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
        if (isGroup) {
          if (!allow.nsfw) return CXD.sendButtonImg(from, './lib/fbi.jpg', mess.notAllowed(), "© Bot", [
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
              buf = res
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
          if (!allow.nsfw) return CXD.sendButtonImg(from, './lib/fbi.jpg', mess.notAllowed(), "© Bot", [
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
              buf = res
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
          //if (size < global.messConf.maxFileSize) {
            CXD.sendImage(from, res[0].thumb, mess.yt3res(title, quality, type, size), true)
            CXD.sendFileFromUrl(from, res[0].link, 'audio', null, true)
          /*} else {
            var link = res[0].link
            CXD.reply(mess.sizeMax(link))
          }*/
        })
      break
      case 'enable':
        if (!isGroup) return CXD.reply(mess.onlyGroup())
        if (!isGroupAdmins) return CXD.reply(mess.onlyAdmin())
        if (args.length < 1) return CXD.reply(mess.needQuery())
        switch(args[0]) {
          case 'nsfw':
            if (isNsfw) return CXD.reply(mess.nsfwHasOn())
            nsfw.push(groupId, 1)
            write('./database/nsfw.json', JSON.stringify(nsfw))
            CXD.reply(mess.done())
          break
          case 'welcome':
            if (isWelcome) return CXD.reply(mess.welcomeHasOn())
            welcome.addWelcome(groupId, initialWelcome)
            CXD.reply(mess.done())
          break
        }
      break
      case 'disable':
        if (!isGroup) return CXD.reply(mess.onlyGroup())
        if (!isGroupAdmins) return CXD.reply(mess.onlyAdmin())
        if (args.length < 1) return CXD.reply(mess.needQuery())
        switch(args[0]) {
          case 'nsfw':
            nsfw.splice(groupId, 1)
            write('./database/nsfw.json', JSON.stringify(nsfw))
            CXD.reply(mess.done())
          break
          case 'welcome':
            _welcome.splice(welcome.getWelcomePosi(from), 1)
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
        if (isGroup) {
          if (!allow.nsfw) return CXD.sendButtonImg(from, './lib/fbi.jpg', mess.notAllowed(), "© Bot", [
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
              buf = res
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
          if (!allow.nsfw) return CXD.sendButtonImg(from, './lib/fbi.jpg', mess.notAllowed(), "© Bot", [
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
              buf = res
              CXD.sendButtonImg(from, buf, mess.done(), "© Bot",
                [
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
      case 'wallpaper':
        wallpaper.result()
          .then(async (res) => {
            buf = res
            CXD.sendButtonImg(from, buf, mess.done(), "© Bot",
              [
                {
                  buttonId: `${prefix}wallpaper`,
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
      case 'promote':
        if (!isGroup) return CXD.reply(mess.onlyGroup())
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
        if (!isGroup) return CXD.reply(mess.onlyGroup())
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
      case 'sticker':
      case 'stiker':
      case 's':
	if ((isImage || isQuotedImage)) {
	  var anu = args.join(' ').split('|')
	  var satu = anu[0] !== '' ? anu[0] : stickerInfo.pack
	  var dua = typeof anu[1] !== 'undefined' ? anu[1] : stickerInfo.author
	  var mime = (quoted.msg || quoted).mimetype || ''

	  if (/image/.test(mime)) {
	    var media = await quoted.download()
	    var encmedia;
	    encmedia = await CXD.sendImageAsSticker(from, media, m, {
	      packname: satu,
	      author: dua
	    }, { quoted: msg })
	    remove(encmedia)
	  } else {
	    CXD.reply(mess.needReplyOrSendImg())
	  }
	} else {
	  console.log(color("[STICKER]", "cyan"), `Users don't post pictures/videos/with captions!`)
	  CXD.reply(mess.needReplyOrSendImg())
	}
      break
      case 'stickergif':
        if ((isVideo || isQuotedImage)) {
	  var anu = args.join(' ').split('|')
          var satu = anu[0] !== '' ? anu[0] : stickerInfo.pack
          var dua = typeof anu[1] !== 'undefined' ? anu[1] : stickerInfo.author
          var mime = (quoted.msg || quoted).mimetype || ''

	  if (/video/.test(mime)) {
	    var media = await quoted.download()
	    var encmedia = await CXD.sendVideoAsSticker(from, media, m, {
	      packname: satu,
	      author: dua
	    })
	    await remove(encmedia)
	  } else {
	    console.log(color("[STICKER]", "cyan"), `Users don't post pictures/videos/with captions!`)
	    CXD.reply(mess.needReplyOrSendVid())
	  }
        }
      break
      case 'ytmp4':
        if (args.length < 1) return CXD.reply(mess.needLink())
        if (!isUrl(args[0]) && !args[0].includes('youtu')) return CXD.reply(mess.invalidLink())
        CXD.reply(mess.wait())
        ytmp4.result(args[0])
          .then(async (res) => {
            CXD.sendImage(from, res[0].thumb, mess.yt4res(res), true)
            CXD.sendFileFromUrl(from, res[0].link, 'video', mess.done(), true)
          })
      break
      case 'halah':
        if (args.length < 1) return CXD.reply(mess.needQuery())
        halah.result(q)
          .then(async (res) => {
            CXD.reply(res.result)
          })
      break
      case 'hilih':
        if (args.length < 1) return CXD.reply(mess.needQuery())
        hilih.result(q)
          .then(async (res) => {
            CXD.reply(res.result)
          })
      break
      case 'tekateki':
        if (!isGroup) return CXD.reply(mess.onlyGroup())
        if (isGame(from, gameArray.tekateki)) return CXD.reply(mess.unsolvedQuestion())
        var data = read('./msg/command/game/database/tekateki.json')
        var list = JSON.parse(data)
        var random = Math.floor(Math.random() * list.length);
        var p = list[random]
        CXD.reply(mess.gameQuestion(p, gameTime))
        var anh = p.jawaban.toLowerCase();
        addGame(from, anh, gameTime, gameArray.tekateki)
      break
      case 'igstory':
        if (args.length < 1) return CXD.reply(mess.needLink())
        try {
          var igUser = args[0]
          // Scraper by @piyoxz
          await igstory.getstoryvideo(igUser)
            .then(async (res) => {
              data = res.data
              teks = mess.igstory(igUser, data) + `\n`
              for (let i of data) {
                await shortlink.result(i)
                  .then(async (res) => {
                    teks += `*#* ${res}\n`
                  })
              }
              await CXD.sendFileFromUrl(from, res.data[0] + '╰───────────', teks, true)
            })
        } catch {
          CXD.reply('Error')
        }
      break
      case 'setwelcome':
        if (!isGroup) return CXD.reply(mess.onlyGroup())
        if (!isGroupAdmins) return CXD.reply(mess.onlyAdmin())
        if (!isWelcome) return CXD.reply(mess.welcomeOff())
        if (args.length < 1) return CXD.reply(mess.needQuery())
        switch(args[0]) {
          case 'text':
            await welcome.setWelcome(groupId, body.slice(16))
            CXD.reply(mess.done())
          break
          case 'useprofile':
            switch(args[1]) {
              case 'true':
                await welcome.setUseProfileImage(groupId, true)
                CXD.reply(mess.done())
              case 'false':
                await welcome.setUseProfileImage(groupId, false)
                CXD.reply(mess.done())
              break
              default:
                CXD.reply(mess.invalidQuery())
            }
          break
          case 'opt':
            CXD.reply(welcomeOpt())
          break
          default:
            CXD.reply(mess.invalidQuery())
        }
      break
      case 'simulation':
      case 'simulasi':
        if (!isGroup) return CXD.reply(mess.onlyGroup())
        if (!isGroupAdmins) return CXD.reply(mess.onlyAdmin())
        if (!isWelcome) return CXD.reply(mess.welcomeOff())
        if (args.length < 1) return CXD.reply(mess.needQuery())
        switch(args[0]) {
          case 'welcome':
            switch(welcome.getUseProfileImage(from)) {
              case true:
                var welcomeText = welcome.getWelcomeText(groupId)
                try {
                  var imgUrl = await CXD.profilePictureUrl(`${sender.split('@')[0]}@c.us`)
                } catch {
                  imgUrl = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                }
                if (welcomeText.includes('@user')) {
                  welcomeText = welcomeText.replace("@user", `@${sender.split("@")[0]}`)
                }
                CXD.sendFileFromUrl(from, imgUrl, welcomeText, true, { mentions: [sender] })
              break
              case false:
                var welcomeText = welcome.getWelcomeText(groupId)
                if (welcomeText.includes('@user')) {
                  welcomeText = welcomeText.replace("@user", `@${sender.split("@")[0]}`)
                }
                CXD.SendTextWithMentions(welcomeText, `${sender.split('@')[0]}@s.whatsapp.net`, {
                  quoted: msg
                })
              break
            }
          break
          default:
            CXD.reply(mess.invalidQuery())
        }
      break
    }
  } catch(err) {
    console.log(color("Error:", "red"), err)
  }
}
