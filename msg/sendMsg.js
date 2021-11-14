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
