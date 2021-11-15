let fetcher = require('./../lib/fetcher')

global.fetch = fetcher.fetchJson
global.buffer = fetcher.getBuffer

/**
 * Reply message
 * @param {string} txt
 */
CXD.reply = (txt) => {
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
CXD.sendText = (txt) => {
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
CXD.sendImage = (img, caption, replying) => {
  if (replying = true) {
    CXD.sendMessage(
      from,
      img,
      image, {
        caption: caption
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
CXD.sendFile = (file, type, captions, replying) => {
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
//CXD.sendFileFromUrl = (url, type, captions, replying) => {
