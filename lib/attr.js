require('./../config')
const {
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
  jidDecode
} = require('@adiwajshing/baileys')
let axios = require('axios')
let fetcher = require('./../lib/fetcher')
let { color } = require('./color')
let { readFileSync: read, unlinkSync: remove, existsSync: check } = require('fs')
let ffmpeg = require('fluent-ffmpeg')
let { getRandom } = require('./function')
let { ind, eng } = require('./../msg/language')
let {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require('./exif')

module.exports = attr = async (data) => {
  let msg = data.msg
  let CXD = data.CXD
  let from = data.from
  let type = data.type
  let content = data.content
  let args = data.args
  let sender = data.sender
  global.buffer = fetcher.getBuffer

  let isMedia = type === "imageMessage" || type === "videoMessage"
  let isQuotedImage = type === "extendedTextMessage" && content.includes("imageMessage")
  let isQuotedVideo = type === "extendedTextMessage" && content.includes("videoMessage")
  let isQuotedAudio = type === "extendedTextMessage" && content.includes("audioMessage")

  /** Reply message
   * @param {String} txt
   */
  CXD.reply = (txt) => {
    CXD.sendMessage(from, {
      text: txt,
      mentions: [sender]
    }, { quoted: msg })
  }

  /** Send text message
   * @param {String} from
   * @param {String} txt
   */
  CXD.sendText = (from, txt) => {
    CXD.sendMessage(from, { text: txt })
  }

  /** Send image message
   * @param {String} from
   * @param {object} img
   * @param {String} captions
   * @param {Boolean} replying
   */
  CXD.sendImage = async (from, img, captions, replying) => {
    try {
      if (img.includes('https') || img.includes('http')) {
        var mime = '';
        var res = await axios.head(img)
        var mimee = res.headers['content-type']
	mime = mimee.split("/")[0]
      } else {
	var mime = '';
	var res = path.extname(img)
	if (res == '.png' || res == '.jpg' || res == '.jpeg' || res == '.svg' || mime == '.webp') {
	  mime = 'image'
	} else mime = res
      }
      if (mime === 'image') {
        if (replying = true) {
	  CXD.sendMessage(from, {
	    image: { url: img },
	    caption: captions
          }, { quoted: msg })
        } else {
	  CXD.sendMessage(from, {
            image: { url: img },
            caption: captions
          })
        }
      } else {
	if (language === 'ind') {
	  CXD.sendMessage(from, { text: ind.invalidFileType() }, { quoted: msg })
        } else {
	  CXD.sendMessage(from, { text: eng.invalidFileType() }, { quoted: msg })
	}
      }
    } catch(e) {
      console.log(color("[ERROR]", "red"), e)
      CXD.reply("Error!")
    }
  }

  /** Send file message
   * @param {String} from
   * @param {object} file
   * @param {String} captions
   * @param {Boolean} replying
   */
  CXD.sendFile = async(from, file, captions, replying) => {
    if (file.includes('https') || file.includes('http')) {
      var mime = ''
      var res = await axios.head(file)
      var mimee = res.headers['content-type']
      mime = mimee.split("/")[0]
    } else {
      var mime = path.extname(file)
      if (mime == '.png' || mime == '.jpg' || mime == '.jpeg' || mime == '.svg' || mime == '.webp') {
	mime = 'image'
      } else if (mime == '.mp4') {
	mime = 'video'
      } else if (mime == '.mp3' || mime == '.ogg') {
	mime = 'audio'
      } else if (mime == '.gif') {
	mime = 'gif'
      } else mime = 'document'
    }
    if (mime == 'image') {
      if (replying == true) {
        CXD.sendMessage(from, {
	  image: { url: file },
	  caption: captions
        }, { quoted: msg })
      } else {
        CXD.sendMessage(from, {
          image: { url: file },
          caption: captions
        })
      }
    } else if (mime == 'video') {
      if (replying == true) {
	CXD.sendMessage(from, {
	  video: { url: file },
	  caption: captions
        }, { quoted: msg })
      } else {
	CXD.sendMessage(from, {
          video: { url: file },
          caption: captions
        })
      }
    } else if (mime == 'audio') {
      if (replying == true) {
	CXD.sendMessage(from, {
	  audio: { url: file },
	  mimetype: 'audio/mp4'
	}, { quoted: msg })
      }
    } else if (mime == 'gif') {
      if (replying == true) {
	CXD.sendMessage(from, {
	  video: { url: file },
	  caption: captions,
	  gifPlayback: true
	}, { quoted: msg })
      } else {
	CXD.sendMessage(from, {
          video: { url: file },
          caption: captions,
          gifPlayback: true
        })
      }
    } else {
      if (replying == true) {
	CXD.sendMessage(from, {
	  document: { url: file },
	  mimetype: mime
	}, { quoted: msg })
      } else {
	CXD.sendMessage(from, {
          document: { url: file },
          mimetype: mime
        })
      }
    }
  }

  /** Send file from url
   * @param {String} from
   * @param {object} url
   * @param {String} captions
   * @param {Boolean} replying
   */
  CXD.sendFileFromUrl = async (from, url, captions, replying, options = {}) => {
    var type = ''
    var res = await axios.head(url)
    var mimee = res.headers['content-type']
    type = mimee.split("/")[0]
    if (type == 'image') {
      if (replying == true) {
	CXD.sendMessage(from, {
	  image: { url: url },
	  caption: captions,
	  ...options
	}, { quoted: msg })
      } else {
	CXD.sendMessage(from, {
          image: { url: url },
          caption: captions,
	  ...options
        }, { quoted: msg })
      }
    } else if (type == 'video') {
      if (replying == true) {
	CXD.sendMessage(from, {
	  video: { url: url },
	  caption: captions,
	  ...options
	}, { quoted: msg })
      } else {
	CXD.sendMessage(from, {
          video: { url: url },
          caption: captions,
	  ...options
        })
      }
    } else if (type == 'audio') {
      if (replying == true) {
	CXD.sendMessage(from, {
	  audio: { url: url },
	  mimetype: 'audio/mp4',
	  ...options
	}, { quoted: msg })
      } else {
	CXD.sendMessage(from, {
          audio: { url: url },
          mimetype: 'audio/mp4',
	  ...options
        })
      }
    } else if (type == 'gif') {
      if (replying == true) {
	CXD.sendMessage(from, {
	  video: { url: url },
	  caption: captions,
	  gifPlayback: true,
	  ...options
	}, { quoted: msg })
      } else {
	CXD.sendMessage(from, {
          video: { url: url },
          caption: captions,
          gifPlayback: true,
	  ...options
        })
      }
    } else {
      if (replying == true) {
	CXD.sendMessage(from, {
	  document: { url: url },
	  mimetype: mime,
	  ...options
	}, { quoted: msg })
      } else {
	CXD.sendMessage(from, {
          document: { url: url },
	  ...options
        })
      }
    }
  }

  /** Send button message
   * @param {String} from
   * @param {String} content
   * @param {String} footer
   * @param {Array} but
   * @param {String} options
   */
  CXD.sendButton = (from, content, footer, but = [], options = {}) => {
    var buttonTxt = {
      text: content,
      footer: footer,
      buttons: but,
      headerType: 1
    }

    CXD.sendMessage(from, buttonTxt, options)
  }

  // CXD.sendButtonLoc = async(jid, buffer, content, footer, but = [], options = {}) => {
  //   let button = {
  //     caption: content,
  //     footer: footer,
  //     buttons: but,
  //     location: { jpegThumbnail: buffer }
  //	 headerType: 4
  //   }
  //
  //   CXD.sendMessage(from, button, options)
  // }

  /** Send button with image
   * @param {String} from
   * @param {Object} buffer
   * @param {String} content
   * @param {String} footer
   * @param {Array} but
   * @param {String} options
   */
  CXD.sendButtonImg = async(from, buffer, content, footer, but = [], options = {}) => {
    let buttonimg = {
      image: {
        url: buffer
      },
      caption: content,
      footer: footer,
      buttons: but,
      headerType: 4
    }

    CXD.sendMessage(from, buttonimg, options)
  }

  /** Send text with mentions
   * @param {String} teks
   * @param {String} memberr
   * @param {String} options
   * @param {Boolean} id
   */
  CXD.SendTextWithMentions = (teks, memberr, options = {}, id) => {
    if (id == null || id == undefined) {
      id = true
    }
    (id == null || id == undefined || id == false) ? CXD.sendMessage(from, {
      text: teks.trim()
    }, options) : CXD.sendMessage(from, {
      text: teks.trim(),
      mentions: [memberr]
    }, options)
  }

  /** Send image sticker
   * @param {String} jid
   * @param {Object} path
   * @param {String} quoted
   * @param {String} options
   * @param {String} opts
   */
  CXD.sendImageAsSticker = async(jid, path, quoted, options = {}, opts = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await buffer(path)) : check(path) ? read(path) : Buffer.alloc(0)
    let buffer

    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options)
    } else {
      buffer = await imageToWebp(buff)
    }
    CXD.sendMessage(jid, {
      sticker: {
	url: buffer
      },
      ...options
    }, opts)
  }

  /** Send video sticker
   * @param {String} jid
   * @param {Object} path
   * @param {String} quoted
   * @param {String} options
   * @param {String} opts
   * @returns {String}
   */
  CXD.sendVideoAsSticker = async (jid, path, quoted, options = {}, opts = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer

    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options)
    } else {
      buffer = await videoToWebp(buff)
    }

    await CXD.sendMessage(jid, {
      sticker: {
	url: buffer
      },
      ...options
    }, opts)

    return buffer
  }

  CXD.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {}
      return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
  }
}
