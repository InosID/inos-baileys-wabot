let fs = require('fs')
let welcomeDB = JSON.parse(fs.readFileSync('./database/welcome.json'))

/** Add group to welcome database
 * @param {String} chatId
 * @param {String} initialWelcome
 */
function addWelcome(chatId, initialWelcome) {
  var obj = {
    id: chatId,
    welcomeText: initialWelcome,
    useProfileImage: false
  }
  welcomeDB.push(obj)
  fs.writeFileSync('./database/welcome.json', JSON.stringify(welcomeDB, null, "\t"))
}

function getWelcomePosi(chatId) {
  let position = null;
  Object.keys(welcomeDB).forEach((i) => {
    if (welcomeDB[i].id === chatId) {
      position = i;
    }
  });
  if (position !== null) {
    return position;
  }
}

/** Get welcome text
 * @param {String} chatId
 */
function getWelcomeText(chatId) {
  let position = false
  Object.keys(welcomeDB).forEach((i) => {
    if (welcomeDB[i].id === chatId) {
      position = i;
    }
  });
  if (position !== false) {
    return welcomeDB[position].welcomeText;
  }
}

/** Set custom welcome
 * @param {String} chatId
 * @param {String} newText
 */
function setWelcome(chatId, newText) {
  let position = false
  Object.keys(welcomeDB).forEach((i) => {
    if (welcomeDB[i].id === chatId) {
      position = i;
    }
  });
  if (position !== false) {
    welcomeDB[position].welcomeText = newText
    fs.writeFileSync('./database/welcome.json', JSON.stringify(welcomeDB))
  }
}

/** Get use profile image
 * @param {String} chatId
 */
function getUseProfileImage(chatId) {
  let position = false
  Object.keys(welcomeDB).forEach((i) => {
    if (welcomeDB[i].id === chatId) {
      position = i;
    }
  });
  if (position !== false) {
    return welcomeDB[position].useProfileImage;
  }
}

/** Set use profile image
 * @param {String} chatId
 * @param {String} newText
 */
function setUseProfileImage(chatId, bool) {
  let position = false
  Object.keys(welcomeDB).forEach((i) => {
    if (welcomeDB[i].id === chatId) {
      position = i;
    }
  });
  if (position !== false) {
    welcomeDB[position].useProfileImage = bool
    fs.writeFileSync('./database/welcome.json', JSON.stringify(welcomeDB))
  }
}

module.exports = {
  addWelcome,
  getWelcomePosi,
  getWelcomeText,
  setWelcome,
  getUseProfileImage,
  setUseProfileImage
}
