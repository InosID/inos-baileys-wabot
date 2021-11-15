let Baileys = require('@adiwajshing/baileys')
let CXD = new Baileys.WAConnection()
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
let fetcher = require('./../lib/fetcher')
let get = require('got')

global.fetch = fetcher.fetchJson
global.buffer = fetcher.getBuffer

/**
 * Reply message
 * @param {string} txt
 */
global.reply = (from, txt) => {
  CXD.sendMessage(
    from,
    txt,
    text, {
      quoted: msg
    }
  )
}

/**
 * Send text
 * @param {string} txt
 */
global.sendText = (from, txt) => {
  CXD.sendMessage(
    from,
    txt,
    text
  )
}

/**
 * Send Image File
 * @param {object} img
 * @param {string} caption
 * @param {boolean} replying
 */
global.sendImage = (from, img, caption, replying) => {
  if (replying = true) {
    CXD.sendMessage(
      from,
      img,
      image, {
        caption: caption,
        quoted: msg
      }
    )
  } else {
    CXD.sendMessage(
      from,
      img,
      image, {
        caption: caption
      }
    )
  }
}

/**
 * Send file
 * @param {object} file
 * @param {string} type
 * @param {string} captions
 * @param {boolean} replying
 */
global.sendFile = (from, file, type, captions, replying) => {
  if (type == 'document') {
    if (replying == true) {
      CXD.sendMessage(
        from,
        file,
        type, {
          quoted: msg
        }
      )
    } else {
      CXD.sendMessage(
        from,
        file,
        type
      )
    }
  } else if (type == 'image') {
    if (replying == true) {
      CXD.sendMessage(
        from,
        file,
        type, {
          caption: captions,
          quoted: msg
        }
      )
    } else {
      CXD.sendMessage(
        from,
        file,
        type, {
          caption: captions
        }
      )
    }
  } else if (type === 'video') {
    if (replying == true) {
      CXD.sendMessage(
        from,
        file,
        type, {
          caption: captions,
          quoted: msg
        }
      )
    } else {
      CXD.sendMessage(
        from,
        file,
        type, {
          caption: captions
        }
      )
    }
  } else if (type == 'audio') {
    if (replying == true) {
      CXD.sendMessage(
        from,
        file,
        type, {
          mimetype: 'audio/mp4',
          quoted: msg
        }
      )
    } else {
      CXD.sendMessage(
        from,
        file,
        type, {
          mimetype: 'audio/mp4',
        }
      )
    }
  } else if (type == 'gif') {
    if (replying == true) {
      CXD.sendMessage(
        from,
        file,
        video, {
          mimetype: Baileys.Mimetype.gif,
          quoted: msg,
          caption: captions
        }
      )
    }
  }
}

/**
 * Send file from url
 * @param {string} url
 * @param {string} type
 * @param {string} captions
 * @param {boolean} replying
 */
global.sendFileFromUrl = (from, url, type, captions, replying) => {
  if (type == 'document') {
    var fetch = global.buffer(url)
    if (replying == true) {
      CXD.sendMessage(
        from,
        url,
        type, {
          quoted: msg
        }
      )
    } else {
      CXD.sendMessage(
        from,
        url,
        type
      )
    }
  }
}
